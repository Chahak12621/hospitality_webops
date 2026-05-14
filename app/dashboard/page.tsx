"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  Hotel,
  Package,
  CalendarDays,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/getUser";
import type { UserRole, Profile } from "@/types/database.types";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<Profile | null>(null);

  const [teamCount, setTeamCount] = useState(0);

  const [guestCount, setGuestCount] = useState(0);

  const [inventoryCount, setInventoryCount] = useState(0);

  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        window.location.href = "/auth/login";
        return;
      }

      // EVENT HEADS SHOULD NEVER ACCESS THIS DASHBOARD
      if (currentUser.role === "event_head") {
        window.location.href = "/dashboard/my-guests";
        return;
      }

      setUser(currentUser);

      await fetchDashboardData(currentUser.role);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (role: UserRole) => {
    // TEAM MEMBERS COUNT
    const { count: teamMembers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    setTeamCount(teamMembers ?? 0);

    // GUESTS COUNT
    const { count: guests } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true });

    setGuestCount(guests ?? 0);

    // INVENTORY COUNT
    const { count: inventory } = await supabase
      .from("inventory_items")
      .select("*", { count: "exact", head: true });

    setInventoryCount(inventory ?? 0);

    // EVENTS COUNT — SUPERADMIN ONLY
    if (role === "superadmin") {
      const { count: events } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });

      setEventCount(events ?? 0);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-12 h-12 border-t-2 border-pink-500 rounded-full animate-spin" />
      </main>
    );
  }

  const role = user?.role;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-pink-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-fuchsia-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 px-6 md:px-12 py-10">
        {/* TOPBAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-14">
          <div>
            <p className="uppercase tracking-[0.35em] text-pink-400 text-sm mb-4">
              Hospitality Portal
            </p>

            <h1 className="text-5xl font-black">
              Dashboard
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              Welcome back, {user?.full_name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-pink-500/10 flex items-center gap-3">
              <ShieldCheck
                className="text-pink-400"
                size={20}
              />

              <span className="capitalize">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-all flex items-center gap-3"
            >
              <LogOut size={18} />

              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">
          {/* TEAM */}
          <div className="bg-white/5 border border-pink-500/10 rounded-[32px] p-7 backdrop-blur-xl">
            <Users
              className="text-pink-400 mb-5"
              size={30}
            />

            <h2 className="text-5xl font-black">
              {teamCount}
            </h2>

            <p className="text-gray-400 mt-3">
              Team Members
            </p>
          </div>

          {/* GUESTS */}
          <div className="bg-white/5 border border-pink-500/10 rounded-[32px] p-7 backdrop-blur-xl">
            <Hotel
              className="text-pink-400 mb-5"
              size={30}
            />

            <h2 className="text-5xl font-black">
              {guestCount}
            </h2>

            <p className="text-gray-400 mt-3">
              Guests
            </p>
          </div>

          {/* INVENTORY */}
          <div className="bg-white/5 border border-pink-500/10 rounded-[32px] p-7 backdrop-blur-xl">
            <Package
              className="text-pink-400 mb-5"
              size={30}
            />

            <h2 className="text-5xl font-black">
              {inventoryCount}
            </h2>

            <p className="text-gray-400 mt-3">
              Inventory Items
            </p>
          </div>

          {/* EVENTS */}
          {role === "superadmin" && (
            <div className="bg-white/5 border border-pink-500/10 rounded-[32px] p-7 backdrop-blur-xl">
              <CalendarDays
                className="text-pink-400 mb-5"
                size={30}
              />

              <h2 className="text-5xl font-black">
                {eventCount}
              </h2>

              <p className="text-gray-400 mt-3">
                Events
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION CARDS */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* TEAM MEMBERS */}
          <Link
            href="/dashboard/team"
            className="group rounded-[32px] bg-white/5 border border-pink-500/10 p-8 hover:border-pink-500/30 transition-all"
          >
            <Users
              className="text-pink-400 mb-5 group-hover:scale-110 transition-all"
              size={34}
            />

            <h2 className="text-3xl font-black">
              Team Members
            </h2>

            <p className="text-gray-400 mt-4">
              {role === "superadmin"
                ? "Manage hospitality team members and assignments."
                : "Search and view hospitality team members."}
            </p>
          </Link>

          {/* GUESTS */}
          <Link
            href="/dashboard/guests"
            className="group rounded-[32px] bg-white/5 border border-pink-500/10 p-8 hover:border-pink-500/30 transition-all"
          >
            <Hotel
              className="text-pink-400 mb-5 group-hover:scale-110 transition-all"
              size={34}
            />

            <h2 className="text-3xl font-black">
              Guests
            </h2>

            <p className="text-gray-400 mt-4">
              View guest accommodations and hospitality details.
            </p>
          </Link>

          {/* INVENTORY */}
          <Link
            href="/dashboard/inventory"
            className="group rounded-[32px] bg-white/5 border border-pink-500/10 p-8 hover:border-pink-500/30 transition-all"
          >
            <Package
              className="text-pink-400 mb-5 group-hover:scale-110 transition-all"
              size={34}
            />

            <h2 className="text-3xl font-black">
              Inventory
            </h2>

            <p className="text-gray-400 mt-4">
              Track hospitality inventory and logistics.
            </p>
          </Link>
        </div>

        {/* SUPERADMIN EVENT CONTROL */}
        {role === "superadmin" && (
          <div className="mt-14 rounded-[36px] bg-white/5 border border-pink-500/10 p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="uppercase tracking-[0.3em] text-pink-400 text-sm mb-3">
                  Admin Controls
                </p>

                <h2 className="text-4xl font-black mb-4">
                  Event Management
                </h2>

                <p className="text-gray-400 text-lg">
                  Create events, assign coordinators and volunteers,
                  manage hospitality workflows and oversee event operations.
                </p>
              </div>

              <Link
                href="/dashboard/events"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,20,147,0.4)]"
              >
                Manage Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
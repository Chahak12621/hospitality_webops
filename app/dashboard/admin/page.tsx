"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Phone,
  Users,
  CalendarDays,
  MapPin,
  UserPlus,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

type EventType = {
  id: string;
  event_name: string;
  department: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
};

type GuestType = {
  id: string;
  event_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  guest_food_preferences: string;
  room_number: string;
  pickup_point: string;
  dropoff_point: string;
  arrival_date: string;
  departure_date: string;
  special_requests: string;
  status: string;
};

type CoreTeamType = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  role: string;
  department: string;
  assigned_event_id?: string;
};

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [guests, setGuests] = useState<GuestType[]>([]);
  const [coreTeam, setCoreTeam] = useState<CoreTeamType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    const { data: guestData } = await supabase.from("guests").select("*");

    const { data: coreTeamData } = await supabase
      .from("core_team")
      .select("*")
      .order("created_at", { ascending: false });

    setEvents(eventData || []);
    setGuests(guestData || []);
    setCoreTeam(coreTeamData || []);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.event_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const assignCoreTeamMember = async (
    eventId: string,
    memberId: string
  ) => {
    const { error } = await supabase
      .from("core_team")
      .update({ assigned_event_id: eventId })
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Member assigned successfully");
    fetchData();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#0b0705]">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#d0e7dd,#fdcbca,#ebdbe6,#ffe8b5,#d8d0e8)] bg-[length:300%_300%] animate-[gradientShift_20s_ease_infinite]" />
      <div className="fixed left-[-120px] top-[-100px] -z-10 h-[400px] w-[400px] rounded-full bg-[#f56483]/20 blur-3xl" />
      <div className="fixed right-[-120px] bottom-[-100px] -z-10 h-[400px] w-[400px] rounded-full bg-[#703c84]/15 blur-3xl" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="h-full w-full"
              >
                <defs>
                  <radialGradient id="adLogoGrad" cx="45%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#f56483" />
                    <stop offset="60%" stopColor="#703c84" />
                    <stop offset="100%" stopColor="#4a1a6b" />
                  </radialGradient>

                  <radialGradient id="adRingGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8b3fa8" />
                    <stop offset="100%" stopColor="#4a1060" />
                  </radialGradient>
                </defs>

                <circle cx="100" cy="100" r="98" fill="url(#adRingGrad)" />
                <circle cx="100" cy="100" r="90" fill="url(#adLogoGrad)" />

                {[
                  [100, 60, 2],
                  [120, 65, 2],
                  [135, 78, 2.5],
                  [140, 95, 2.5],
                  [135, 112, 2.5],
                  [125, 126, 3],
                  [112, 136, 3],
                  [95, 140, 3.5],
                  [78, 136, 3.5],
                  [64, 126, 4],
                  [58, 112, 4],
                  [58, 95, 4],
                  [64, 78, 4.5],
                  [78, 66, 4.5],
                ].map(([cx, cy, r], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="rgba(255,255,255,0.9)"
                  />
                ))}

                <circle
                  cx="100"
                  cy="100"
                  r="5"
                  fill="rgba(255,255,255,0.6)"
                />

                <text
                  x="100"
                  y="88"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="white"
                  letterSpacing="2"
                >
                  IIT MADRAS
                </text>

                <text
                  x="100"
                  y="108"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill="white"
                  letterSpacing="1"
                >
                  PARADOX
                </text>
              </svg>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">
                Paradox '26 · Hospitality
              </p>

              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-[#f56483]" />

                <h1 className="text-xl font-black tracking-tight text-[#0b0705]">
                  Admin Dashboard
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/inventory"
              className="rounded-full border-2 border-[#703c84] bg-white/40 px-5 py-2.5 text-sm font-semibold text-[#703c84] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/70"
            >
              Inventory
            </Link>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(245,100,131,0.3)] transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">
              Overview
            </p>

            <h2 className="mt-1 text-3xl font-black text-[#0b0705]">
              Manage Events &amp; Team
            </h2>
          </div>

          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#703c84]" />

            <input
              type="text"
              placeholder="Search event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border-2 border-[#703c84]/20 bg-white/70 py-3 pl-11 pr-5 text-sm text-[#0b0705] outline-none backdrop-blur-md placeholder:text-[#a090a8] focus:border-[#703c84] transition duration-200"
            />
          </div>
        </div>

        {/* EVENTS */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#f56483]" />

            <h2 className="text-2xl font-black text-[#703c84]">
              Events
            </h2>
          </div>

          <div className="grid gap-6">
            {filteredEvents.map((event) => {
              const eventGuests = guests.filter(
                (g) => g.event_id === event.id
              );

              const assignedMember = coreTeam.find(
                (m) => m.assigned_event_id === event.id
              );

              return (
                <div
                  key={event.id}
                  className="rounded-[32px] border border-white/50 bg-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.07)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5"
                >
                  <div className="border-b border-white/40 p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black text-[#0b0705]">
                            {event.event_name}
                          </h3>

                          <span className="rounded-full bg-gradient-to-r from-[#ebdbe6] to-[#d8d0e8] px-4 py-1 text-sm font-semibold text-[#703c84]">
                            {event.department}
                          </span>
                        </div>

                        <p className="mt-4 max-w-2xl leading-7 text-[#3d3144]">
                          {event.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#703c84]">
                          <div className="flex items-center gap-2 rounded-full bg-[#fdcbca]/50 px-4 py-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {event.event_date}
                          </div>

                          <div className="flex items-center gap-2 rounded-full bg-[#ebdbe6]/50 px-4 py-1.5">
                            ⏰ {event.event_time}
                          </div>

                          <div className="flex items-center gap-2 rounded-full bg-[#d0e7dd]/50 px-4 py-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.venue}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="rounded-[32px] border-2 border-dashed border-[#703c84]/20 bg-white/30 p-16 text-center text-[#703c84]">
                No events found matching your search.
              </div>
            )}
          </div>
        </section>

        {/* CORE TEAM */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#703c84]" />

            <h2 className="text-2xl font-black text-[#703c84]">
              Core Team Members
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {coreTeam.map((member) => (
              <div
                key={member.id}
                className="rounded-[28px] border border-white/50 bg-white/50 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#ebdbe6] to-[#d8d0e8] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#703c84]">
                  {member.role}
                </div>

                <h3 className="text-xl font-black text-[#0b0705]">
                  {member.name}
                </h3>

                <p className="mt-3 break-all text-sm text-[#3d3144]">
                  {member.email}
                </p>

                <p className="mt-1 text-sm text-[#703c84]">
                  {member.department}
                </p>

                <a
                  href={`tel:${member.contact_number}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#703c84] to-[#f56483] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(112,60,132,0.25)] transition duration-300 hover:scale-105"
                >
                  <Phone className="h-4 w-4" />
                  Dial Member
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/40 bg-white/20 py-6 text-center backdrop-blur-xl">
        <p className="text-sm tracking-wide text-[#3d3144]">
          IIT Madras BS Presents • PARADOX '26 • Admin Panel
        </p>
      </footer>

      {/* KEYFRAMES */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  );
}
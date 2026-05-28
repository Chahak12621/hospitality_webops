"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Users,
  Utensils,
  BedDouble,
  LayoutDashboard,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
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

type CoreTeamType = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  role: string;
  department: string;
  assigned_event_id?: string | null;
};

type GuestType = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_food_preferences: string;
  special_requests: string;
  pickup_point: string;
  dropoff_point: string;
  arrival_date: string;
  departure_date: string;
  arrival_time: string;
  departure_time: string;
  status: string;
};
type EventHeadType = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  assigned_event_id?: string | null;
};

export default function CoreTeamDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [guests, setGuests] = useState<GuestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventHeads, setEventHeads] = useState<EventHeadType[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [coreTeam, setCoreTeam] = useState<CoreTeamType[]>([]);

  useEffect(() => {
    const role = sessionStorage.getItem("portal_role");
    if (role !== "core_team") {
      alert("Unauthorized");
      window.location.href = "/";
    }
  }, []);

  // ─────────────────────────────────────────────
  // FETCH ASSIGNED EVENTS
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchAssignedEvents();
    fetchCoreTeam();
  }, []);
  const fetchCoreTeam = async () => {
    const { data } = await supabase
      .from("core_team")
      .select("*")
      .order("name", { ascending: true });
    setCoreTeam(data || []);
  };


  const filteredCoreTeam = useMemo(
    () => coreTeam.filter(
      (m) =>
        m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(teamSearch.toLowerCase())
    ),
    [coreTeam, teamSearch]
  );

  const fetchAssignedEvents = async () => {
    try {
      // GET EMAIL FROM SESSION STORAGE
      const email = sessionStorage.getItem("portal_email");

      if (!email) {
        setLoading(false);
        return;
      }

      // FIND CORE TEAM MEMBER
      const { data: member, error: memberError } = await supabase
        .from("core_team")
        .select("assigned_event_id")
        .eq("email", email)
        .single();

      if (memberError || !member?.assigned_event_id) {
        console.log(memberError);
        setLoading(false);
        return;
      }


      // FETCH ASSIGNED EVENT
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", member.assigned_event_id)
        .single();

      if (eventError || !eventData) {
        console.log(eventError);
        setLoading(false);
        return;
      }

      setEvents([eventData]);
      const { data: eventHeadData } = await supabase
        .from("event_heads")
        .select("*")
        .eq("assigned_event_id", eventData.id);

      setEventHeads(eventHeadData || []);

      // FETCH GUESTS OF THAT EVENT
      const { data: guestData, error: guestError } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventData.id);

      if (guestError) {
        console.log(guestError);
      }

      setGuests(guestData || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#d0e7dd,#fdcbca,#ebdbe6,#ffe8b5,#d8d0e8)] bg-[length:300%_300%] animate-[gradientShift_20s_ease_infinite]" />
        <div className="rounded-[28px] border border-white/50 bg-white/60 px-12 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#703c84]/20 border-t-[#703c84]" />
          <p className="text-base font-semibold text-[#703c84]">Loading dashboard...</p>
        </div>
        <style jsx global>{`
          @keyframes gradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#0b0705]">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#d0e7dd,#fdcbca,#ebdbe6,#ffe8b5,#d8d0e8)] bg-[length:300%_300%] animate-[gradientShift_20s_ease_infinite]" />
      <div className="fixed left-[-120px] top-[-100px] -z-10 h-[400px] w-[400px] rounded-full bg-[#f56483]/20 blur-3xl" />
      <div className="fixed right-[-120px] bottom-[-100px] -z-10 h-[400px] w-[400px] rounded-full bg-[#703c84]/15 blur-3xl" />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-xl overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

          {/* Left — Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0">
              <img src="/logo1.png" alt="paradox-logo" />
            </div>

            <div>
              <p className="hidden sm:block text-xs uppercase tracking-[0.4em] text-[#703c84]">
                Paradox '26 · Hospitality
              </p>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-[#f56483]" />
                <h1 className="text-xl font-black tracking-tight text-[#0b0705]">
                  Core Team Dashboard
                </h1>
              </div>
            </div>
          </div>

          {/* Right — Inventory + Logout */}
          <div className="flex items-center gap-4">

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-3 py-2.5 sm:px-5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(245,100,131,0.3)] transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Intro */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">Your Assignment</p>
          <h2 className="mt-1 text-3xl font-black text-[#0b0705]">
            Assigned Events &amp; Guests
          </h2>
          <p className="mt-3 max-w-2xl leading-8 text-[#3d3144]">
            View your assigned events and manage guest hospitality details.
          </p>
        </div>

        {/* NO EVENTS */}
        {events.length === 0 && (
          <div className="rounded-[32px] border-2 border-dashed border-[#703c84]/20 bg-white/30 p-16 text-center backdrop-blur-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ebdbe6] to-[#d8d0e8]">
              <CalendarDays className="h-8 w-8 text-[#703c84]" />
            </div>
            <h2 className="text-2xl font-black text-[#703c84]">No Events Assigned</h2>
            <p className="mt-3 text-[#3d3144]">
              You currently do not have any assigned events.
            </p>
          </div>
        )}

        {/* ── EVENTS ── */}
        <div className="grid gap-8">
          {events.map((event) => {
            const eventGuests = guests.filter(
              (guest: any) => guest.event_id === event.id
            );
            const eventHead = eventHeads.find((h) => h.assigned_event_id === event.id);

            return (
              <div
                key={event.id}
                className="overflow-hidden rounded-[32px] border border-white/50 bg-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-md"
              >
                {/* ── EVENT HEADER BANNER ── */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#703c84] to-[#f56483] p-5 sm:p-8 text-white">
                  {/* Decorative orb */}
                  <div className="absolute right-[-60px] top-[-60px] h-[200px] w-[200px] rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute bottom-[-40px] left-[30%] h-[150px] w-[150px] rounded-full bg-white/10 blur-2xl" />

                  <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-black">{event.event_name}</h2>
                        <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur-sm">
                          {event.department}
                        </span>
                      </div>
                      <p className="mt-4 max-w-3xl leading-8 text-white/90">{event.description}</p>
                    </div>
                  </div>

                  {/* Info Pills */}
                  <div className="relative mt-6 flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {event.event_date}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                      ⏰ {event.event_time}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                      <Users className="h-3.5 w-3.5" />
                      {eventGuests.length} Guests
                    </div>
                  </div>
                </div>
                {/* Event Head */}
                {eventHead && (
                  <div className="mt-5 rounded-2xl border border-[#703c84]/20 bg-[#ebdbe6]/30 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#703c84]">Event Head</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="font-bold text-[#0b0705]">{eventHead.name}</p>
                      <a href={`mailto:${eventHead.email}`} className="flex items-center gap-1.5 text-xs text-[#703c84]">
                        <Mail className="h-3.5 w-3.5" /> {eventHead.email}
                      </a>
                      {eventHead.contact_number && (
                        <a href={`tel:${eventHead.contact_number}`} className="flex items-center gap-1.5 text-xs font-semibold text-[#f56483]">
                          <Phone className="h-3.5 w-3.5" /> {eventHead.contact_number}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── EDIT EVENT ── */}
                <div className="border-b border-white/40 p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-1 w-8 rounded-full bg-[#f56483]" />
                    <h3 className="text-xl font-black text-[#703c84]">Edit Event Details</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      defaultValue={event.event_name}
                      placeholder="Event Name"
                      onChange={(e) => {
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, event_name: e.target.value }
                              : ev
                          )
                        );
                      }}
                      className="rounded-full border-2 border-[#703c84]/20 bg-white/70 px-5 py-3 text-sm text-[#0b0705] outline-none placeholder:text-[#a090a8] focus:border-[#703c84] transition duration-200 backdrop-blur-md"
                    />
                    <input
                      type="text"
                      defaultValue={event.venue}
                      placeholder="Venue"
                      onChange={(e) => {
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, venue: e.target.value }
                              : ev
                          )
                        );
                      }}
                      className="rounded-full border-2 border-[#703c84]/20 bg-white/70 px-5 py-3 text-sm text-[#0b0705] outline-none placeholder:text-[#a090a8] focus:border-[#703c84] transition duration-200 backdrop-blur-md"
                    />
                    <input
                      type="date"
                      defaultValue={event.event_date}
                      onChange={(e) => {
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, event_date: e.target.value }
                              : ev
                          )
                        );
                      }}
                      className="rounded-full border-2 border-[#703c84]/20 bg-white/70 px-5 py-3 text-sm text-[#0b0705] outline-none focus:border-[#703c84] transition duration-200 backdrop-blur-md"
                    />
                    <input
                      type="time"
                      defaultValue={event.event_time}
                      onChange={(e) => {
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, event_time: e.target.value }
                              : ev
                          )
                        );
                      }}
                      className="rounded-full border-2 border-[#703c84]/20 bg-white/70 px-5 py-3 text-sm text-[#0b0705] outline-none focus:border-[#703c84] transition duration-200 backdrop-blur-md"
                    />
                  </div>

                  <textarea
                    defaultValue={event.description}
                    placeholder="Event Description"
                    onChange={(e) => {
                      setEvents((prev) =>
                        prev.map((ev) =>
                          ev.id === event.id
                            ? { ...ev, description: e.target.value }
                            : ev
                        )
                      );
                    }}
                    className="mt-4 min-h-[120px] w-full rounded-[20px] border-2 border-[#703c84]/20 bg-white/70 px-5 py-4 text-sm text-[#0b0705] outline-none placeholder:text-[#a090a8] focus:border-[#703c84] transition duration-200 backdrop-blur-md"
                  />

                  <button
                    onClick={async () => {
                      const { error } = await supabase
                        .from("events")
                        .update({
                          event_name: event.event_name,
                          description: event.description,
                          event_date: event.event_date,
                          event_time: event.event_time,
                          venue: event.venue,
                        })
                        .eq("id", event.id);

                      if (error) {
                        alert(error.message);
                        return;
                      }

                      alert("Event updated successfully");
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#703c84] to-[#f56483] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(112,60,132,0.25)] transition duration-300 hover:scale-105"
                  >
                    Save Event Changes
                  </button>
                </div>

                {/* ── GUESTS ── */}
                <div className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-1 w-8 rounded-full bg-[#703c84]" />
                    <h3 className="text-xl font-black text-[#703c84]">Guest Information</h3>
                  </div>

                  {eventGuests.length === 0 ? (
                    <div className="rounded-[24px] border-2 border-dashed border-[#703c84]/20 bg-white/30 p-10 text-center text-[#703c84]">
                      No guests assigned yet.
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                      {eventGuests.map((guest) => (
                        <div
                          key={guest.id}
                          className="rounded-[24px] border border-white/50 bg-gradient-to-br from-[#fdcbca]/30 to-[#ebdbe6]/30 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5"
                        >
                          {/* Guest Header */}
                          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <h4 className="text-xl font-black text-[#0b0705]">
                              {guest.guest_name}
                            </h4>
                            <span className="rounded-full bg-[#d0e7dd] px-3 py-1 text-xs font-bold text-[#406014]">
                              {guest.status}
                            </span>
                          </div>

                          {/* Contact */}
                          <div className="mb-5 space-y-2 text-sm text-[#3d3144]">
                            {guest.guest_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-[#703c84]" />
                                {guest.guest_email}
                              </div>
                            )}
                            {guest.guest_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-[#703c84]" />
                                {guest.guest_phone}
                              </div>
                            )}
                          </div>

                          {/* Details Grid */}
                          <div className="mb-5 grid grid-cols-2 gap-2 rounded-[16px] bg-white/50 p-4 text-xs text-[#3d3144]">
                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">Food</p>
                              <p>{guest.guest_food_preferences || "N/A"}</p>
                            </div>

                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">Pickup</p>
                              <p>{guest.pickup_point || "N/A"}</p>
                            </div>
                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">Drop</p>
                              <p>{guest.dropoff_point || "N/A"}</p>
                            </div>
                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">
                                Arrival Date
                              </p>

                              <p>{guest.arrival_date || "N/A"}</p>
                            </div>

                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">
                                Departure Date
                              </p>

                              <p>{guest.departure_date || "N/A"}</p>
                            </div>

                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">
                                Arrival Time
                              </p>

                              <p>{guest.arrival_time || "N/A"}</p>
                            </div>

                            <div>
                              <p className="mb-0.5 font-bold text-[#703c84]">
                                Departure Time
                              </p>

                              <p>{guest.departure_time || "N/A"}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="mb-0.5 font-bold text-[#703c84]">Special Requests</p>
                              <p>{guest.special_requests || "None"}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {guest.guest_phone && (
                              <a
                                href={`tel:${guest.guest_phone}`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f56483] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(245,100,131,0.3)] transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
                              >
                                <Phone className="h-4 w-4" />
                                Call Guest
                              </a>
                            )}
                            {guest.guest_email && (
                              <a
                                href={`mailto:${guest.guest_email}`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#703c84] bg-white/60 px-5 py-2.5 text-sm font-semibold text-[#703c84] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/80"
                              >
                                <Mail className="h-4 w-4" />
                                Email Guest
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* CORE TEAM SECTION */}
        <section className="mb-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-1 w-8 rounded-full bg-[#703c84]" />
              <h2 className="text-2xl font-black text-[#703c84]">Core Team Members</h2>
            </div>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#703c84]" />
              <input
                placeholder="Search team member..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="w-full rounded-full border-2 border-[#703c84]/20 bg-white/70 py-2.5 pl-11 pr-5 text-sm outline-none placeholder:text-[#a090a8] focus:border-[#703c84] transition"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCoreTeam.map((member) => {

              return (
                <div
                  key={member.id}
                  className="rounded-[24px] border border-white/60 bg-white/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-block rounded-full bg-gradient-to-r from-[#ebdbe6] to-[#d8d0e8] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#703c84]">
                      {member.role}
                    </span>

                  </div>

                  <h3 className="text-lg font-black text-[#0b0705]">{member.name}</h3>
                  <p className="mt-1 break-all text-xs text-[#4a3d52]">{member.email}</p>
                  <p className="mt-0.5 text-xs text-[#703c84]">{member.department || "Hospitality"}</p>



                  <a
                    href={`tel:${member.contact_number}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#703c84] to-[#f56483] px-4 py-2.5 text-xs font-bold text-white shadow-[0_6px_20px_rgba(112,60,132,0.2)] transition hover:scale-105"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Dial Member
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      </div>


      {/* FOOTER */}
      <footer className="relative z-10 mt-10 border-t border-white/40 bg-white/20 py-6 text-center backdrop-blur-xl">
        <p className="text-sm tracking-wide text-[#3d3144]">
          IIT Madras BS Presents • PARADOX '26 • Core Team Panel
        </p>
      </footer>

      {/* KEYFRAMES */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}
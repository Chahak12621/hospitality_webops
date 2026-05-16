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

  // ─────────────────────────────────────────────
  // FETCH DATA
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // EVENTS
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    // GUESTS
    const { data: guestData } = await supabase
      .from("guests")
      .select("*");

    // CORE TEAM
    const { data: coreTeamData } = await supabase
      .from("core_team")
      .select("*")
      .order("created_at", { ascending: false });

    setEvents(eventData || []);
    setGuests(guestData || []);
    setCoreTeam(coreTeamData || []);
  };

  // ─────────────────────────────────────────────
  // FILTER EVENTS
  // ─────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.event_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  // ─────────────────────────────────────────────
  // ASSIGN EVENT HEAD
  // ─────────────────────────────────────────────
  const assignCoreTeamMember = async (
    eventId: string,
    memberId: string
  ) => {
    const { error } = await supabase
      .from("core_team")
      .update({
        assigned_event_id: eventId,
      })
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Member assigned successfully");

    fetchData();
  };

  return (
    <main className="min-h-screen bg-[#f8f6ff] p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-black text-[#2b124c]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-[#5f4b7a]">
            Manage events, guests and core team members.
          </p>
        </div>
        <Link
          href="/dashboard/inventory"
          className="rounded-xl bg-[#6b3df0] px-5 py-3 text-sm font-semibold text-white"
        >
          Inventory Dashboard
        </Link>

        {/* SEARCH */}
        <div className="relative w-full md:w-[340px]">

          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d6b99]" />

          <input
            type="text"
            placeholder="Search event name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[#ddd3f5] bg-white py-4 pl-11 pr-4 outline-none focus:border-[#8d5cf6]"
          />
        </div>
      </div>

      {/* EVENTS */}
      <section>
        <h2 className="mb-5 text-2xl font-bold text-[#2b124c]">
          Events
        </h2>

        <div className="grid gap-6">
          {filteredEvents.map((event) => {
            const eventGuests = guests.filter(
              (guest) => guest.event_id === event.id
            );

            return (
              <div
                key={event.id}
                className="rounded-[28px] border border-[#e5dbff] bg-white p-5 shadow-sm"
              >

                {/* EVENT TOP */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  {/* LEFT */}
                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-2xl font-black text-[#2b124c]">
                        {event.event_name}
                      </h3>

                      <span className="rounded-full bg-[#efe7ff] px-4 py-1 text-sm font-medium text-[#6b3df0]">
                        {event.department}
                      </span>
                    </div>

                    <p className="mt-4 max-w-2xl leading-7 text-[#5f4b7a]">
                      {event.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#5f4b7a]">

                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {event.event_date}
                      </div>

                      <div className="flex items-center gap-2">
                        ⏰ {event.event_time}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </div>
                    </div>
                  </div>

                  {/* ASSIGN */}
                  <div className="w-full lg:w-[320px]">

                    <div className="rounded-2xl bg-[#f8f4ff] p-4">

                      <div className="mb-3 flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-[#6b3df0]" />

                        <p className="font-semibold text-[#2b124c]">
                          Assign Event coordinator
                        </p>
                      </div>

                      <input
                        type="text"
                        placeholder="Search core team member..."
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="w-full rounded-xl border border-[#ddd3f5] bg-white px-4 py-3 outline-none"
                      />

                      <div className="mt-3 max-h-[220px] overflow-y-auto rounded-xl border border-[#e5dbff] bg-white">

                        {coreTeam
                          .filter((member) =>
                            member.name
                              .toLowerCase()
                              .includes(selectedMember.toLowerCase())
                          )
                          .map((member) => (
                            <button
                              key={member.id}
                              onClick={() =>
                                assignCoreTeamMember(event.id, member.id)
                              }
                              className="flex w-full items-center justify-between border-b border-[#f3edff] px-4 py-3 text-left transition hover:bg-[#f8f4ff]"
                            >
                              <div>
                                <p className="font-semibold text-[#2b124c]">
                                  {member.name}
                                </p>

                                <p className="text-sm text-[#7d6b99]">
                                  {member.role}
                                </p>

                                {/* ADD HERE */}
                                <p className="mt-1 text-xs text-[#5f4b7a]">
                                  Assigned Event:
                                  {" "}
                                  {member.assigned_event_id
                                    ? "Already Assigned"
                                    : "Not Assigned"}
                                </p>
                              </div>

                              <span className="text-xs text-[#6b3df0]">
                                Assign
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* GUESTS */}
                  <div className="mt-8">

                    <button
                      onClick={() =>
                        setSelectedEvent(
                          selectedEvent === event.id
                            ? null
                            : event.id
                        )
                      }
                      className="flex items-center gap-2 rounded-full bg-[#2b124c] px-5 py-3 text-sm font-semibold text-white"
                    >
                      <Users className="h-4 w-4" />

                      View Guests ({eventGuests.length})
                    </button>

                    {selectedEvent === event.id && (
                      <div className="mt-5 grid gap-4">

                        {eventGuests.map((guest) => (
                          <div
                            key={guest.id}
                            className="rounded-2xl border border-[#ece3ff] bg-[#faf8ff] p-5"
                          >

                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                              {/* LEFT */}
                              <div>

                                <div className="flex flex-wrap items-center gap-3">

                                  <h4 className="text-xl font-bold text-[#2b124c]">
                                    {guest.guest_name}
                                  </h4>

                                  <span className="rounded-full bg-[#dff7e7] px-3 py-1 text-xs font-semibold text-[#147a39]">
                                    {guest.status}
                                  </span>
                                </div>

                                <div className="mt-4 grid gap-2 text-sm leading-7 text-[#5f4b7a]">

                                  <p>
                                    🍽 Food Preference:
                                    {" "}
                                    {guest.guest_food_preferences || "N/A"}
                                  </p>

                                  <p>
                                    🛏 Room:
                                    {" "}
                                    {guest.room_number || "N/A"}
                                  </p>

                                  <p>
                                    📍 Pickup:
                                    {" "}
                                    {guest.pickup_point || "N/A"}
                                  </p>

                                  <p>
                                    🚘 Drop:
                                    {" "}
                                    {guest.dropoff_point || "N/A"}
                                  </p>

                                  <p>
                                    📅 Arrival:
                                    {" "}
                                    {guest.arrival_date || "N/A"}
                                  </p>

                                  <p>
                                    📅 Departure:
                                    {" "}
                                    {guest.departure_date || "N/A"}
                                  </p>

                                  <p>
                                    ✨ Special Requests:
                                    {" "}
                                    {guest.special_requests || "None"}
                                  </p>
                                </div>
                              </div>

                              {/* RIGHT */}
                              <div className="flex flex-col gap-3">

                                {guest.guest_phone && (
                                  <a
                                    href={`tel:${guest.guest_phone}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b3df0] px-5 py-3 text-sm font-semibold text-white"
                                  >
                                    <Phone className="h-4 w-4" />

                                    Call Guest
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {eventGuests.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-[#d7c8ff] bg-[#faf8ff] p-8 text-center text-[#7d6b99]">
                            No guests assigned to this event yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="mt-14">

        <h2 className="mb-5 text-2xl font-bold text-[#2b124c]">
          Core Team Members
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {coreTeam.map((member) => (
            <div
              key={member.id}
              className="rounded-[24px] border border-[#e5dbff] bg-white p-5"
            >

              <h3 className="text-xl font-bold text-[#2b124c]">
                {member.name}
              </h3>

              <p className="mt-2 text-sm text-[#6b3df0]">
                {member.role}
              </p>

              <p className="mt-4 break-all text-sm text-[#5f4b7a]">
                {member.email}
              </p>

              <p className="mt-2 text-sm text-[#5f4b7a]">
                {member.department}
              </p>

              <a
                href={`tel:${member.contact_number}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b124c] px-4 py-3 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" />

                Dial Member
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
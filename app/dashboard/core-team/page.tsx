"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Users,
  Utensils,
  BedDouble,
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
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_food_preferences: string;
  special_requests: string;
  room_number: string;
  pickup_point: string;
  dropoff_point: string;
  arrival_date: string;
  departure_date: string;
  status: string;
};

export default function CoreTeamDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [guests, setGuests] = useState<GuestType[]>([]);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────
  // FETCH ASSIGNED EVENTS
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchAssignedEvents();
  }, []);

  const fetchAssignedEvents = async () => {
    try {
      // CURRENT AUTH USER
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setLoading(false);
        return;
      }

      // FIND EVENT HEAD ENTRY
      // FIND CORE TEAM MEMBER
const { data: member, error: memberError } = await supabase
  .from("core_team")
  .select(`
    assigned_event_id
  `)
  .eq("email", user.email)
  .single();

if (memberError || !member?.assigned_event_id) {
  setLoading(false);
  return;
}

// FETCH ONLY ASSIGNED EVENT
const { data: eventData, error: eventError } =
  await supabase
    .from("events")
    .select("*")
    .eq("id", member.assigned_event_id)
    .single();

if (eventError || !eventData) {
  setLoading(false);
  return;
}

setEvents([eventData]);

// FETCH GUESTS OF THAT EVENT ONLY
const { data: guestData } = await supabase
  .from("guests")
  .select("*")
  .eq("event_id", eventData.id);

setGuests(guestData || []);

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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6ff]">
        <div className="text-lg font-semibold text-[#5f4b7a]">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6ff] p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-3xl font-black text-[#2b124c]">
          Core Team Dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-8 text-[#5f4b7a]">
          View your assigned events and manage guest hospitality details.
        </p>
      </div>

      {/* NO EVENTS */}
      {events.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-[#d8cfff] bg-white p-12 text-center">

          <h2 className="text-2xl font-bold text-[#2b124c]">
            No Events Assigned
          </h2>

          <p className="mt-3 text-[#6f5b8e]">
            You currently do not have any assigned events.
          </p>
        </div>
      )}
      <Link
        href="/dashboard/inventory"
        className="rounded-xl bg-[#6b3df0] px-5 py-3 text-sm font-semibold text-white"
      >
        Inventory Dashboard
      </Link>
      {/* EVENTS */}
      <div className="grid gap-8">

        {events.map((event) => {
          const eventGuests = guests.filter(
            (guest: any) => guest.event_id === event.id
          );

          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-[32px] border border-[#e7ddff] bg-white shadow-sm"
            >

              {/* EVENT HEADER */}
              <div className="bg-gradient-to-r from-[#6b3df0] to-[#8f6dff] p-6 text-white">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-3xl font-black">
                        {event.event_name}
                      </h2>

                      <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
                        {event.department}
                      </span>
                    </div>

                    <p className="mt-4 max-w-3xl leading-8 text-white/90">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* INFO */}
                <div className="mt-6 flex flex-wrap gap-5 text-sm">

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

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {eventGuests.length} Guests
                  </div>
                </div>
              </div>
              {/* EDIT EVENT */}

              <div className="mt-8 rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-md">

                <h3 className="mb-5 text-xl font-bold text-white">
                  Edit Event Details
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    defaultValue={event.event_name}
                    placeholder="Event Name"
                    onChange={(e) =>
                      event.event_name = e.target.value
                    }
                    className="rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-white outline-none placeholder:text-white/70"
                  />

                  <input
                    type="text"
                    defaultValue={event.venue}
                    placeholder="Venue"
                    onChange={(e) =>
                      event.venue = e.target.value
                    }
                    className="rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-white outline-none placeholder:text-white/70"
                  />

                  <input
                    type="date"
                    defaultValue={event.event_date}
                    onChange={(e) =>
                      event.event_date = e.target.value
                    }
                    className="rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-white outline-none"
                  />

                  <input
                    type="time"
                    defaultValue={event.event_time}
                    onChange={(e) =>
                      event.event_time = e.target.value
                    }
                    className="rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-white outline-none"
                  />
                </div>

                <textarea
                  defaultValue={event.description}
                  placeholder="Event Description"
                  onChange={(e) =>
                    event.description = e.target.value
                  }
                  className="mt-4 min-h-[130px] w-full rounded-xl border border-white/20 bg-white/20 px-4 py-3 text-white outline-none placeholder:text-white/70"
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
                  className="mt-5 rounded-xl bg-white px-6 py-3 font-semibold text-[#6b3df0] transition hover:opacity-90"
                >
                  Save Event Changes
                </button>
              </div>
              {/* GUESTS */}
              <div className="p-5 md:p-7">

                <h3 className="mb-6 text-2xl font-bold text-[#2b124c]">
                  Guest Information
                </h3>

                {eventGuests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ddd2ff] bg-[#faf8ff] p-8 text-center text-[#7a6996]">
                    No guests assigned yet.
                  </div>
                ) : (
                  <div className="grid gap-5">

                    {eventGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="rounded-[24px] border border-[#ece4ff] bg-[#fcfbff] p-5"
                      >

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                          {/* LEFT */}
                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                              <h4 className="text-2xl font-bold text-[#2b124c]">
                                {guest.guest_name}
                              </h4>

                              <span className="rounded-full bg-[#dff8e8] px-3 py-1 text-xs font-semibold text-[#137a3c]">
                                {guest.status}
                              </span>
                            </div>

                            {/* CONTACT */}
                            <div className="mt-5 grid gap-3 text-sm text-[#5f4b7a]">

                              {guest.guest_email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {guest.guest_email}
                                </div>
                              )}

                              {guest.guest_phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {guest.guest_phone}
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <Utensils className="h-4 w-4" />
                                Food:
                                {" "}
                                {guest.guest_food_preferences || "N/A"}
                              </div>

                              <div className="flex items-center gap-2">
                                <BedDouble className="h-4 w-4" />
                                Room:
                                {" "}
                                {guest.room_number || "N/A"}
                              </div>

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

                            {guest.guest_email && (
                              <a
                                href={`mailto:${guest.guest_email}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ddd2ff] bg-white px-5 py-3 text-sm font-semibold text-[#2b124c]"
                              >
                                <Mail className="h-4 w-4" />
                                Email Guest
                              </a>
                            )}
                          </div>
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
    </main>
  );
}
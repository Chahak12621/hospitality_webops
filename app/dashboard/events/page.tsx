"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";

interface EventType {
  id: string;
  event_name: string;
  department: string;
  description: string;
  venue: string;
  event_date: string;
  event_time: string;

  event_heads: {
    name: string;
    email: string;
    contact_number: string | null;
  }[];
}
interface GuestType {
  id: string;
  event_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  status: string;
}

export default function EventsDashboard() {

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<GuestType[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {

    try {

      const department =
        sessionStorage.getItem(
          "portal_department"
        );

      if (!department) {
        setLoading(false);
        return;
      }

      // FETCH EVENTS + EVENT HEADS
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_heads (
            name,
            email,
            contact_number
          )
        `)
        .eq("department", department)
        .order("event_date", {
          ascending: true,
        });

      if (error) {
        console.log(error);
        return;
      }

      setEvents(data || []);
      const eventIds = (data || []).map((e: EventType) => e.id);
      const { data: guestData } = await supabase
        .from("guests")
        .select("id, event_id, guest_name, guest_email, guest_phone, status")
        .in("event_id", eventIds);
      setGuests(guestData || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const updateGuestStatus = async (guestId: string, status: string) => {
    const { error } = await supabase
      .from("guests")
      .update({ status })
      .eq("id", guestId);
    if (error) { alert(error.message); return; }
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status } : g));
  };
  if (loading) {
    return (
      <div className="p-10 text-xl">
        Loading events...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f8] p-6">

      <h1 className="mb-8 text-4xl font-black text-[#703c84]">
        Department Events
      </h1>
      <button
                    onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(245,100,131,0.3)] transition hover:scale-105 hover:bg-[#e14f72]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>

      {events.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 shadow">
          <p className="text-lg text-gray-600">
            No events available
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {events.map((event) => (

            <div
              key={event.id}
              className="rounded-3xl bg-white p-8 shadow"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-[#0b0705]">
                    {event.event_name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {event.description || "No description"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f56483]/10 px-4 py-2 text-sm font-semibold text-[#f56483]">
                  {event.department}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <div>
                  <p className="font-semibold">
                    Venue
                  </p>

                  <p className="text-gray-600">
                    {event.venue || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    Date
                  </p>

                  <p className="text-gray-600">
                    {event.event_date || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    Time
                  </p>

                  <p className="text-gray-600">
                    {event.event_time || "Not available"}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-bold">Guests</h3>
                {guests.filter(g => g.event_id === event.id).length === 0 ? (
                  <p className="text-gray-500">No guests yet</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {guests.filter(g => g.event_id === event.id).map(guest => (
                      <div key={guest.id} className="rounded-2xl border p-4">
                        <p className="font-bold">{guest.guest_name}</p>
                        <p className="text-sm text-gray-600">{guest.guest_email}</p>
                        <p className="text-sm text-gray-600">{guest.guest_phone}</p>
                        <select
                          value={guest.status}
                          onChange={(e) => updateGuestStatus(guest.id, e.target.value)}
                          className="mt-3 w-full rounded-xl border border-[#ddd2ff] px-3 py-2 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="checked_out">Checked Out</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EVENT HEADS */}
              <div className="mt-8">

                <h3 className="mb-4 text-xl font-bold">
                  Event Heads
                </h3>

                {event.event_heads?.length === 0 ? (

                  <div className="rounded-2xl bg-gray-50 p-4">
                    No event heads assigned
                  </div>

                ) : (

                  <div className="grid gap-4 md:grid-cols-2">

                    {event.event_heads.map(
                      (head, index) => (

                        <div
                          key={index}
                          className="rounded-3xl border border-[#f1e7f5] bg-white p-5 shadow-sm"
                        >

                          <p className="text-lg font-bold text-[#0b0705]">
                            {head.name || "Unnamed"}
                          </p>

                          {/* EMAIL */}
                          <a
                            href={`mailto:${head.email}`}
                            className="mt-3 block text-sm text-[#703c84] underline underline-offset-4"
                          >
                            {head.email}
                          </a>

                          {/* CONTACT */}
                          <p className="mt-3 text-sm text-gray-700">
                            <span className="font-semibold">
                              Contact:
                            </span>{" "}

                            {head.contact_number ? (
                              <a
                                href={`tel:${head.contact_number}`}
                                className="text-[#f56483] underline underline-offset-4"
                              >
                                {head.contact_number}
                              </a>
                            ) : (
                              "Contact number not available"
                            )}
                          </p>

                          {/* ACTION BUTTONS */}
                          <div className="mt-5 flex gap-3">

                            <a
                              href={`mailto:${head.email}`}
                              className="rounded-xl bg-[#703c84] px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
                            >
                              Mail
                            </a>

                            {head.contact_number && (
                              <a
                                href={`tel:${head.contact_number}`}
                                className="rounded-xl bg-[#f56483] px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
                              >
                                Call
                              </a>
                            )}

                          </div>
                        </div>
                      )
                    )}

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
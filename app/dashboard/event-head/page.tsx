"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";

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
};
type CoreTeamType = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  role: string;
  department: string;
  assigned_event_id: string;
};
export default function EventHeadDashboard() {

  const [events, setEvents] = useState<EventType[]>([]);
  const [guests, setGuests] = useState<GuestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [coreTeam, setCoreTeam] = useState<any[]>([]);



  // CREATE EVENT FORM
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    department: "technical",
    description: "",
    event_date: "",
    event_time: "",
    venue: "",
  });
  const [newEventContact, setNewEventContact] = useState("");

  // CREATE GUEST FORM
  const [newGuest, setNewGuest] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    guest_food_preferences: "",
    special_requests: "",
    pickup_point: "",
    dropoff_point: "",
    arrival_date: "",
    departure_date: "",
    arrival_time: "",
    departure_time: "",
  });

  useEffect(() => {
    const role = sessionStorage.getItem("portal_role");

    if (role !== "event_head") {
      window.location.href = "/login";
      return;
    }

    fetchMyEvents();
  }, []);

  // ─────────────────────────────────────────────
  // FETCH ONLY MY EVENTS
  // ─────────────────────────────────────────────

  const fetchMyEvents = async () => {
    try {
      const email = sessionStorage.getItem("portal_email");

      if (!email) {
        setLoading(false);
        return;
      }

      // 1. GET EVENT HEAD RECORD
      const { data: head, error: headError } = await supabase
        .from("event_heads")
        .select("assigned_event_id")
        .eq("email", email);



      if (headError) {
        console.log(headError);
        setLoading(false);
        return;
      }

      if (!head || head.length === 0) {
        setLoading(false);
        return;
      }

      const eventIds = head
        .map((item: any) => item.assigned_event_id)
        .filter(Boolean);


      // 2. FETCH EVENTS
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      setEvents(eventData || []);

      // 3. FETCH GUESTS
      const { data: guestData } = await supabase
        .from("guests")
        .select("*")
        .in("event_id", eventIds);

      setGuests(guestData || []);

      // 4. FETCH CORE TEAM (IMPORTANT FIX)
      const { data: coreTeamData } = await supabase
        .from("core_team")
        .select("*");

      setCoreTeam(coreTeamData || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // CREATE EVENT
  // ─────────────────────────────────────────────
  const createEvent = async () => {
    const email = sessionStorage.getItem("portal_email");
    if (!email) { alert("Unauthorized"); return; }

    // Insert event WITHOUT contact_number
    const { event_name, department, description, event_date, event_time, venue } = newEvent;
    const { data, error } = await supabase
      .from("events")
      .insert([{ event_name, department, description, event_date, event_time, venue }])
      .select()
      .single();

    if (error) { alert(error.message); return; }

    // Update event_heads with assigned_event_id AND contact_number
    const { error: updateError } = await supabase
      .from("event_heads")
      .update({
        assigned_event_id: data.id,
        contact_number: newEventContact,
      })
      .eq("email", email);

    if (updateError) { alert(updateError.message); return; }

    alert("Event created");
    setNewEvent({ event_name: "", department: "technical", description: "", event_date: "", event_time: "", venue: "" });
    setNewEventContact("");
    fetchMyEvents();
  };

  // ─────────────────────────────────────────────
  // UPDATE EVENT
  // ─────────────────────────────────────────────
  const updateEvent = async (event: EventType) => {

    const { error } = await supabase
      .from("events")
      .update({
        event_name: event.event_name,
        department: event.department,
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

    alert("Event updated");
  };

  // ─────────────────────────────────────────────
  // DELETE EVENT
  // ─────────────────────────────────────────────
  const deleteEvent = async (eventId: string) => {

    const confirmDelete = confirm(
      "Delete this event?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("guests")
      .delete()
      .eq("event_id", eventId);

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Event deleted");
    setNewEvent({ event_name: "", department: "technical", description: "", event_date: "", event_time: "", venue: "" });
    setNewEventContact("");


    fetchMyEvents();
  };

  // ─────────────────────────────────────────────
  // CREATE GUEST
  // ─────────────────────────────────────────────
  const createGuest = async (
    eventId: string
  ) => {

    const { error } = await supabase
      .from("guests")
      .insert([
        {
          ...newGuest,
          event_id: eventId,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Guest added");

    fetchMyEvents();
    // at end of createGuest(), after fetchMyEvents():
    setNewGuest({
      guest_name: "", guest_email: "", guest_phone: "",
      guest_food_preferences: "", special_requests: "",
      pickup_point: "", dropoff_point: "",
      arrival_date: "", departure_date: "",
      arrival_time: "", departure_time: "",
    });
  };

  // ─────────────────────────────────────────────
  // UPDATE GUEST
  // ─────────────────────────────────────────────
  const updateGuest = async (
    guest: GuestType
  ) => {

    const { error } = await supabase
      .from("guests")
      .update({
        guest_name: guest.guest_name,
        guest_email: guest.guest_email,
        guest_phone: guest.guest_phone,
        guest_food_preferences:
          guest.guest_food_preferences,
        special_requests:
          guest.special_requests,

        pickup_point: guest.pickup_point,
        dropoff_point: guest.dropoff_point,
        arrival_date: guest.arrival_date,
        departure_date: guest.departure_date,
        arrival_time: guest.arrival_time,
        departure_time: guest.departure_time,
      })
      .eq("id", guest.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Guest updated");
  };

  // ─────────────────────────────────────────────
  // DELETE GUEST
  // ─────────────────────────────────────────────
  const deleteGuest = async (
    guestId: string
  ) => {

    const confirmDelete = confirm(
      "Delete this guest?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("guests")
      .delete()
      .eq("id", guestId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Guest deleted");

    fetchMyEvents();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6ff]">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6ff] p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-10 flex items-start justify-between gap-4">

        <div>
          <h1 className="text-4xl font-black text-[#2b124c]">
            Event Head Dashboard
          </h1>

          <p className="mt-3 text-[#6f5b8e]">
            Manage your events and guests
          </p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#f56483] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(245,100,131,0.3)] transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

      </div>


      {/* CREATE EVENT */}
      <div className="mb-10 rounded-[30px] border border-[#e5dcff] bg-white p-6">

        <div className="mb-6 flex items-center gap-3">

          <Plus className="h-5 w-5 text-[#6b3df0]" />

          <h2 className="text-2xl font-bold text-[#2b124c]">
            Create Event
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <input
            placeholder="Event Name"
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                event_name: e.target.value,
              })
            }
            className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
          />

          <select
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                department: e.target.value,
              })
            }
            className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
          >
            <option value="technical">
              Technical
            </option>

            <option value="cultural">
              Cultural
            </option>

            <option value="sports">
              Sports
            </option>

            <option value="open">
              Central
            </option>
          </select>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
              Event Date
            </label>

            <input
              type="date"
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  event_date: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
              Event Time
            </label>
            <input

              type="time"
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  event_time: e.target.value,
                })
              }
              className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
            />
          </div>

          <input
            placeholder="Venue"
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                venue: e.target.value,
              })
            }
            className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
          />
          <input
            placeholder="Your Contact Number"
            onChange={(e) => setNewEventContact(e.target.value)}
            className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
          />

          <textarea
            placeholder="Description"
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                description: e.target.value,
              })
            }
            className="min-h-[120px] rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none md:col-span-2"
          />

        </div>

        <button
          onClick={createEvent}
          className="mt-6 rounded-xl bg-[#6b3df0] px-6 py-3 font-semibold text-white"
        >
          Create Event
        </button>
      </div>

      {/* EVENTS */}
      <div className="grid gap-8">

        {events.map((event) => {
          const assignedMember = coreTeam.find(
            (m) => m.assigned_event_id === event.id
          );

          const eventGuests = guests.filter(
            (guest) => guest.event_id === event.id
          );


          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-[32px] border border-[#e7ddff] bg-white"
            >

              {/* EVENT HEADER */}
              <div className="bg-gradient-to-r from-[#6b3df0] to-[#8f6dff] p-6 text-white">

                <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">

                  <div className="flex-1">

                    <input
                      value={event.event_name}
                      onChange={(e) =>
                        setEvents((prev) =>
                          prev.map((item) =>
                            item.id === event.id
                              ? {
                                ...item,
                                event_name: e.target.value,
                              }
                              : item
                          )
                        )
                      }
                      className="w-full bg-transparent text-3xl font-black outline-none"
                    />

                    <textarea
                      value={event.description}
                      onChange={(e) =>
                        setEvents((prev) =>
                          prev.map((item) =>
                            item.id === event.id
                              ? {
                                ...item,
                                description: e.target.value,
                              }
                              : item
                          )
                        )
                      }
                      className="mt-4 min-h-[100px] w-full bg-transparent outline-none"
                    />

                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                      <input
                        type="date"
                        value={event.event_date}
                        onChange={(e) =>
                          setEvents((prev) =>
                            prev.map((item) =>
                              item.id === event.id
                                ? {
                                  ...item,
                                  event_date: e.target.value,
                                }
                                : item
                            )
                          )
                        }
                        className="rounded-xl bg-white/20 px-4 py-3 outline-none"
                      />

                      <input
                        type="time"
                        value={event.event_time}
                        onChange={(e) =>
                          setEvents((prev) =>
                            prev.map((item) =>
                              item.id === event.id
                                ? {
                                  ...item,
                                  event_time: e.target.value,
                                }
                                : item
                            )
                          )
                        }
                        className="rounded-xl bg-white/20 px-4 py-3 outline-none"
                      />

                      <input
                        value={event.venue}
                        onChange={(e) =>
                          setEvents((prev) =>
                            prev.map((item) =>
                              item.id === event.id
                                ? {
                                  ...item,
                                  venue: e.target.value,
                                }
                                : item
                            )
                          )
                        }
                        placeholder="Venue"
                        className="rounded-xl bg-white/20 px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">

                    <button
                      onClick={() =>
                        updateEvent(event)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#6b3df0]"
                    >
                      <Pencil className="h-4 w-4" />
                      Save
                    </button>

                    <button
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                  <div className="mt-6 rounded-xl border border-[#ddd2ff] bg-white p-4">
                    <h4 className="text-sm font-bold text-[#2b124c]">
                      Assigned Core Member
                    </h4>

                    {assignedMember ? (
                      <div className="mt-2 text-sm text-[#3d3144]">
                        <p className="font-semibold">{assignedMember.name}</p>
                        <p>{assignedMember.email}</p>
                        <a
                          href={`tel:${assignedMember.contact_number}`}
                          className="text-[#6b3df0] underline"
                        >
                          Call
                        </a>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">
                        Not assigned yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CREATE GUEST */}
              <div className="border-b border-[#eee6ff] p-6">

                <h3 className="mb-5 text-2xl font-bold text-[#2b124c]">
                  Add Guest
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    placeholder="Guest Name"
                    onChange={(e) =>
                      setNewGuest({
                        ...newGuest,
                        guest_name:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                  />

                  <input
                    placeholder="Guest Email"
                    onChange={(e) =>
                      setNewGuest({
                        ...newGuest,
                        guest_email:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                  />

                  <input
                    placeholder="Guest Phone"
                    onChange={(e) =>
                      setNewGuest({
                        ...newGuest,
                        guest_phone:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                  />

                  <select
                    onChange={(e) => setNewGuest({ ...newGuest, guest_food_preferences: e.target.value })}
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none bg-white"
                  >
                    <option value="">Food Preferences</option>
                    <option value="Veg">N/A</option>
                    <option value="Non-Veg">Veg</option>
                  </select>

                  <input
                    placeholder="Pickup Point"
                    onChange={(e) => setNewGuest({ ...newGuest, pickup_point: e.target.value })}
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                  />
                  <input
                    placeholder="Dropoff Point"
                    onChange={(e) => setNewGuest({ ...newGuest, dropoff_point: e.target.value })}
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                  />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                      Arrival Date
                    </label>

                    <input
                      type="date"
                      value={newGuest.arrival_date}
                      onChange={(e) =>
                        setNewGuest({
                          ...newGuest,
                          arrival_date: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                      Arrival Time
                    </label>

                    <input
                      type="time"
                      value={newGuest.arrival_time}
                      onChange={(e) =>
                        setNewGuest({
                          ...newGuest,
                          arrival_time: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                      Departure Date
                    </label>

                    <input
                      type="date"
                      value={newGuest.departure_date}
                      onChange={(e) =>
                        setNewGuest({
                          ...newGuest,
                          departure_date: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                      Departure Time
                    </label>

                    <input
                      type="time"
                      value={newGuest.departure_time}
                      onChange={(e) =>
                        setNewGuest({
                          ...newGuest,
                          departure_time: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Special Requests"
                    onChange={(e) => setNewGuest({ ...newGuest, special_requests: e.target.value })}
                    className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none md:col-span-2"
                  />


                </div>

                <button
                  onClick={() =>
                    createGuest(event.id)
                  }
                  className="mt-5 rounded-xl bg-[#6b3df0] px-5 py-3 font-semibold text-white"
                >
                  Add Guest
                </button>
              </div>

              {/* GUESTS */}
              <div className="p-6">

                <h3 className="mb-6 text-2xl font-bold text-[#2b124c]">
                  Guests
                </h3>

                <div className="grid gap-5">

                  {eventGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="rounded-[24px] border border-[#ece4ff] bg-[#fcfbff] p-5"
                    >

                      <div className="grid gap-4 md:grid-cols-2">

                        <input
                          value={guest.guest_name}
                          onChange={(e) =>
                            setGuests((prev) =>
                              prev.map((item) =>
                                item.id === guest.id
                                  ? {
                                    ...item,
                                    guest_name: e.target.value,
                                  }
                                  : item
                              )
                            )
                          }
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                        />

                        <input
                          value={guest.guest_email}
                          onChange={(e) =>
                            setGuests((prev) =>
                              prev.map((item) =>
                                item.id === guest.id
                                  ? {
                                    ...item,
                                    guest_email: e.target.value,
                                  }
                                  : item
                              )
                            )
                          }
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                        />

                        <input
                          value={guest.guest_phone}
                          onChange={(e) =>
                            setGuests((prev) =>
                              prev.map((item) =>
                                item.id === guest.id
                                  ? {
                                    ...item,
                                    guest_phone: e.target.value,
                                  }
                                  : item
                              )
                            )
                          }
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                        />

                        <select
                          value={guest.guest_food_preferences}
                          onChange={(e) => setGuests((prev) => prev.map((item) => item.id === guest.id ? { ...item, guest_food_preferences: e.target.value } : item))}
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none bg-white"
                        >
                          <option value="">Food Preferences</option>
                          <option value="Veg">N/A</option>
                          <option value="Non-Veg">Veg</option>



                        </select>

                        <input
                          value={guest.pickup_point}
                          onChange={(e) => setGuests((prev) => prev.map((item) => item.id === guest.id ? { ...item, pickup_point: e.target.value } : item))}
                          placeholder="Pickup Point"
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                        />
                        <input
                          value={guest.dropoff_point}
                          onChange={(e) => setGuests((prev) => prev.map((item) => item.id === guest.id ? { ...item, dropoff_point: e.target.value } : item))}
                          placeholder="Dropoff Point"
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                        />
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                            Arrival Date
                          </label>

                          <input
                            type="date"
                            value={guest.arrival_date || ""}
                            onChange={(e) =>
                              setGuests((prev) =>
                                prev.map((item) =>
                                  item.id === guest.id
                                    ? {
                                      ...item,
                                      arrival_date: e.target.value,
                                    }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                            Arrival Time
                          </label>

                          <input
                            type="time"
                            value={guest.arrival_time || ""}
                            onChange={(e) =>
                              setGuests((prev) =>
                                prev.map((item) =>
                                  item.id === guest.id
                                    ? {
                                      ...item,
                                      arrival_time: e.target.value,
                                    }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                            Departure Date
                          </label>

                          <input
                            type="date"
                            value={guest.departure_date || ""}
                            onChange={(e) =>
                              setGuests((prev) =>
                                prev.map((item) =>
                                  item.id === guest.id
                                    ? {
                                      ...item,
                                      departure_date: e.target.value,
                                    }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#2b124c]">
                            Departure Time
                          </label>

                          <input
                            type="time"
                            value={guest.departure_time || ""}
                            onChange={(e) =>
                              setGuests((prev) =>
                                prev.map((item) =>
                                  item.id === guest.id
                                    ? {
                                      ...item,
                                      departure_time: e.target.value,
                                    }
                                    : item
                                )
                              )
                            }
                            className="w-full rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none"
                          />
                        </div>
                        <textarea
                          value={guest.special_requests}
                          onChange={(e) => setGuests((prev) => prev.map((item) => item.id === guest.id ? { ...item, special_requests: e.target.value } : item))}
                          placeholder="Special Requests"
                          className="rounded-xl border border-[#ddd2ff] px-4 py-3 outline-none md:col-span-2"
                        />


                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">

                        <button
                          onClick={() =>
                            updateGuest(guest)
                          }
                          className="rounded-xl bg-[#6b3df0] px-5 py-3 font-semibold text-white"
                        >
                          Save Guest
                        </button>

                        <button
                          onClick={() =>
                            deleteGuest(guest.id)
                          }
                          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white"
                        >
                          Delete Guest
                        </button>

                        {guest.guest_phone && (
                          <a
                            href={`tel:${guest.guest_phone}`}
                            className="rounded-xl border border-[#ddd2ff] px-5 py-3 font-semibold text-[#2b124c]"
                          >
                            Call
                          </a>
                        )}

                        {guest.guest_email && (
                          <a
                            href={`mailto:${guest.guest_email}`}
                            className="rounded-xl border border-[#ddd2ff] px-5 py-3 font-semibold text-[#2b124c]"
                          >
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
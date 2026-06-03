"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Phone,
  CalendarDays,
  MapPin,
  LogOut,
  LayoutDashboard,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  Users,
  Mail,
  Utensils,
  BedDouble,
  Car,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Package,
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
  pickup_point: string;
  dropoff_point: string;
  arrival_date: string;
  departure_date: string;
  arrival_time: string;
  departure_time: string;
  special_requests: string;
  health_issues: string;
  status: string;
};

type CoreTeamType = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  role: string;
  department: string;
};
type AssignmentType = {
  id: string;
  event_id: string;
  member_id: string;
};
type EventHeadType = {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  assigned_event_id?: string | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  checked_in: {
    label: "Checked In",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <UserCheck className="h-3 w-3" />,
  },
  checked_out: {
    label: "Checked Out",
    color: "bg-slate-100 text-slate-500 border-slate-200",
    icon: <UserX className="h-3 w-3" />,
  },
};

const DEPT_COLORS: Record<string, string> = {
  technical: "from-blue-500/20 to-cyan-500/20 border-blue-200 text-blue-700",
  cultural: "from-pink-500/20 to-rose-500/20 border-pink-200 text-pink-700",
  sports: "from-green-500/20 to-emerald-500/20 border-green-200 text-green-700",
  open: "from-violet-500/20 to-purple-500/20 border-violet-200 text-violet-700",
};

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [guests, setGuests] = useState<GuestType[]>([]);
  const [coreTeam, setCoreTeam] = useState<CoreTeamType[]>([]);
  const [eventHeads, setEventHeads] = useState<EventHeadType[]>([]);
  const [search, setSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [assigningEventId, setAssigningEventId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<{ event_id: string, member_id: string }[]>([])
  const [editingGuest, setEditingGuest] = useState<GuestType | null>(null);
  const [addingGuestForEvent, setAddingGuestForEvent] = useState<string | null>(null);
  const [newGuest, setNewGuest] = useState<Partial<GuestType>>({});

  useEffect(() => {
    const role = sessionStorage.getItem("portal_role");
    if (role !== "admin") {
      alert("Unauthorized");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const [{ data: eventData }, { data: guestData }, { data: coreTeamData }, { data: eventHeadData }, { data: assignmentData }] =
      await Promise.all([
        supabase.from("events").select("*").order("event_date", { ascending: true }),
        supabase.from("guests").select("*"),
        supabase.from("core_team").select("*").order("name", { ascending: true }),
        supabase.from("event_heads").select("*"),
        supabase.from("event_team_assignments").select("*"),
      ]);


    setEvents(eventData || []);
    setGuests(guestData || []);
    setCoreTeam(coreTeamData || []);
    setEventHeads(eventHeadData || []);
    setAssignments(assignmentData || []);
  };
  const updateGuest = async () => {
    if (!editingGuest) return;
    const { error } = await supabase
      .from("guests")
      .update({
        guest_name: editingGuest.guest_name,
        guest_email: editingGuest.guest_email,
        guest_phone: editingGuest.guest_phone,
        guest_food_preferences: editingGuest.guest_food_preferences,
        pickup_point: editingGuest.pickup_point,
        dropoff_point: editingGuest.dropoff_point,
        arrival_date: editingGuest.arrival_date,
        departure_date: editingGuest.departure_date,
        arrival_time: editingGuest.arrival_time,
        departure_time: editingGuest.departure_time,
        special_requests: editingGuest.special_requests,
        health_issues: editingGuest.health_issues,
        status: editingGuest.status,
      })
      .eq("id", editingGuest.id);
    if (error) { alert(error.message); return; }
    setEditingGuest(null);
    await fetchData();
  };

  const deleteGuest = async (guestId: string) => {
    if (!confirm("Delete this guest? This cannot be undone.")) return;
    const { error } = await supabase.from("guests").delete().eq("id", guestId);
    if (!error) await fetchData();
  };

  const addGuest = async () => {
    if (!addingGuestForEvent || !newGuest.guest_name) return;
    const { error } = await supabase.from("guests").insert({
      ...newGuest,
      event_id: addingGuestForEvent,
      status: "pending",
    });
    if (error) { alert(error.message); return; }
    setAddingGuestForEvent(null);
    setNewGuest({});
    await fetchData();
  };

  const filteredEvents = useMemo(
    () => events.filter((e) =>
      e.event_name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
    ),
    [events, search]
  );

  const filteredCoreTeam = useMemo(
    () =>
      coreTeam.filter(
        (m) =>
          m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
          m.email.toLowerCase().includes(teamSearch.toLowerCase())
      ),
    [coreTeam, teamSearch]
  );

  // Members not yet assigned to a SPECIFIC event (used per-event in the UI)
  const getMembersNotInEvent = (eventId: string) =>
    coreTeam.filter(
      (m) => !assignments.some((a) => a.event_id === eventId && a.member_id === m.id)
    );
  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const assignMember = async (eventId: string, memberId: string) => {
    setAssigning(true);
    const { error } = await supabase
      .from("event_team_assignments")
      .insert({ event_id: eventId, member_id: memberId });

    if (error) {
      alert(error.message);
    } else {
      await fetchData();
      // Keep panel open so admin can assign more members
    }
    setAssigning(false);
  };

  const unassignMember = async (eventId: string, memberId: string) => {
    const { error } = await supabase
      .from("event_team_assignments")
      .delete()
      .eq("event_id", eventId)
      .eq("member_id", memberId);

    if (!error) await fetchData();
  };
  const deleteEvent = async (eventId: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (!error) await fetchData();
  };
  const updateEvent = async () => {
    if (!editingEvent) return;
    const { error } = await supabase
      .from("events")
      .update({
        event_name: editingEvent.event_name,
        description: editingEvent.description,
        event_date: editingEvent.event_date,
        event_time: editingEvent.event_time,
        venue: editingEvent.venue,
        department: editingEvent.department,
      })
      .eq("id", editingEvent.id);
    if (!error) { setEditingEvent(null); await fetchData(); }
    else alert(error.message);
  };
  const updateGuestStatus = async (guestId: string, status: string) => {
    const { error } = await supabase
      .from("guests")
      .update({ status })
      .eq("id", guestId);
    if (error) { alert(error.message); return; }
    setGuests((prev) => prev.map((g) => g.id === guestId ? { ...g, status } : g));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f5ff] text-[#0b0705]">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,#ede0ff_0%,#fdf6ff_40%,#fff0f5_100%)]" />
      <div className="fixed left-[-200px] top-[-150px] -z-10 h-[500px] w-[500px] rounded-full bg-[#f56483]/10 blur-[120px]" />
      <div className="fixed right-[-200px] bottom-[-150px] -z-10 h-[500px] w-[500px] rounded-full bg-[#703c84]/10 blur-[120px]" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 border-b border-white/60 bg-white/50 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex-shrink-0 sm:h-11 sm:w-11">
              <img src="/logo1.png" alt="paradox-logo" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#703c84] sm:text-xs sm:tracking-[0.4em]">
                Paradox '26 · Hospitality
              </p>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-3.5 w-3.5 text-[#f56483] sm:h-4 sm:w-4" />
                <h1 className="text-base font-black tracking-tight text-[#0b0705] sm:text-xl">
                  Admin Dashboard
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/inventory"
              className="hidden sm:block rounded-full border-2 border-[#703c84] bg-white/60 px-5 py-2.5 text-sm font-semibold text-[#703c84] backdrop-blur-md transition hover:scale-105 hover:bg-white/80"
            >
              Inventory
            </Link>
            <button
              onClick={async () => {
                sessionStorage.clear();
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(245,100,131,0.3)] transition hover:scale-105 hover:bg-[#e14f72]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile-only inventory link */}
      <div className="mx-4 mt-4 sm:hidden">
        <Link
          href="/dashboard/inventory"
          className="flex items-center justify-center gap-2 rounded-full border-2 border-[#703c84] bg-white/60 py-2.5 text-sm font-semibold text-[#703c84] backdrop-blur-md"
        >
          <Package className="h-4 w-4" />
          Go to Inventory
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header & Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">Overview</p>
            <h2 className="mt-1 text-3xl font-black text-[#0b0705]">Events & Hospitality</h2>
          </div>
          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#703c84]" />
            <input
              type="text"
              placeholder="Search by event name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border-2 border-[#703c84]/20 bg-white/70 py-3 pl-11 pr-5 text-sm outline-none placeholder:text-[#a090a8] focus:border-[#703c84] transition"
            />
          </div>
        </div>

        {/* STATS BAR */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Events", value: events.length, color: "text-[#703c84]", bg: "bg-[#ebdbe6]/50" },
            { label: "Total Guests", value: guests.length, color: "text-[#f56483]", bg: "bg-[#fdcbca]/50" },
            { label: "Core Team", value: coreTeam.length, color: "text-emerald-700", bg: "bg-emerald-100/50" },
            { label: "Unassigned", value: coreTeam.filter(m => !assignments.some(a => a.member_id === m.id)).length, color: "text-amber-700", bg: "bg-amber-100/50" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl ${s.bg} border border-white/60 px-5 py-4 backdrop-blur-md`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5a4a60]">{s.label}</p>
              <p className={`mt-1 text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* EVENTS SECTION */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#f56483]" />
            <h2 className="text-2xl font-black text-[#703c84]">Events</h2>
          </div>

          <div className="flex flex-col gap-5">
            {filteredEvents.map((event) => {
              const eventGuests = guests.filter((g) => g.event_id === event.id);
              const eventHead = eventHeads.find((h) => h.assigned_event_id === event.id);
              const isExpanded = expandedEvents.has(event.id);
              const isAssigning = assigningEventId === event.id;
              const deptColor = DEPT_COLORS[event.department] || DEPT_COLORS.open;
              const assignedMembers = assignments
                .filter((a) => a.event_id === event.id)
                .map((a) => coreTeam.find((m) => m.id === a.member_id)!)
                .filter(Boolean);
              const availableMembers = getMembersNotInEvent(event.id);

              return (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-[28px] border border-white/60 bg-white/60 shadow-[0_10px_40px_rgba(112,60,132,0.08)] backdrop-blur-md transition duration-300"
                >
                  {/* EVENT HEADER */}
                  <div className="p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left: Event Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-black text-[#0b0705]">{event.event_name}</h3>
                          <span className={`rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wider ${deptColor}`}>
                            {event.department}
                          </span>
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="rounded-full border border-[#703c84]/30 bg-white/60 px-3 py-1 text-xs font-semibold text-[#703c84] transition hover:bg-[#703c84] hover:text-white"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4a3d52]">{event.description}</p>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <span className="flex items-center gap-1.5 rounded-full bg-[#fdcbca]/60 px-3 py-1.5 text-xs font-semibold text-[#9b3a55]">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {event.event_date}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-[#ebdbe6]/60 px-3 py-1.5 text-xs font-semibold text-[#703c84]">
                            ⏰ {event.event_time}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-[#d0e7dd]/60 px-3 py-1.5 text-xs font-semibold text-[#2b7a4b]">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.venue}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#5a4a60]">
                            <Users className="h-3.5 w-3.5" />
                            {eventGuests.length} Guest{eventGuests.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Right: Assigned Member + Assign button */}
                      <div className="flex flex-col gap-3 lg:min-w-[260px]">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#703c84]">
                            Core Team Assigned
                          </p>
                          {/* Then replace the UI block with: */}
                          {assignedMembers.length > 0 && (
                            <div className="flex flex-col gap-2 mb-2">
                              {assignedMembers.map((member) => (
                                <div key={member.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="font-bold text-[#0b0705]">{member.name}</p>
                                      <p className="mt-0.5 text-xs text-[#5a4a60]">{member.role} · {member.department}</p>
                                      <a href={`tel:${member.contact_number}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#f56483]">
                                        <Phone className="h-3.5 w-3.5" /> {member.contact_number}
                                      </a>
                                    </div>
                                    <button
                                      onClick={() => unassignMember(event.id, member.id)}
                                      className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-100 hover:text-red-500"
                                      title="Unassign"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {assignedMembers.length === 0 && (
                            <div className="mb-2 rounded-2xl border border-dashed border-[#703c84]/30 bg-white/40 p-3 text-xs text-[#703c84]">
                              No members assigned
                            </div>
                          )}

                          {!isAssigning ? (
                            <button
                              onClick={() => setAssigningEventId(event.id)}
                              disabled={availableMembers.length === 0}
                              className="w-full rounded-full bg-gradient-to-r from-[#703c84] to-[#f56483] px-4 py-2.5 text-xs font-bold text-white shadow-[0_6px_20px_rgba(112,60,132,0.25)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {availableMembers.length === 0 ? "All members assigned" : "+ Assign Member"}
                            </button>
                          ) : (
                            <div className="rounded-2xl border border-[#703c84]/20 bg-white/80 p-3">
                              <p className="mb-2 text-xs font-semibold text-[#703c84]">Select member to assign:</p>
                              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                                {availableMembers.map((m) => (
                                  <button
                                    key={m.id}
                                    disabled={assigning}
                                    onClick={() => assignMember(event.id, m.id)}
                                    className="flex items-center justify-between rounded-xl bg-[#f8f5ff] px-3 py-2 text-left text-xs transition hover:bg-[#703c84] hover:text-white group"
                                  >
                                    <span>
                                      <span className="block font-bold">{m.name}</span>
                                      <span className="block opacity-70 group-hover:opacity-90">{m.role}</span>
                                    </span>
                                    <UserCheck className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                                  </button>
                                ))}
                              </div>
                              <button onClick={() => setAssigningEventId(null)} className="mt-2 w-full text-center text-xs text-slate-400 hover:text-slate-600">
                                Cancel
                              </button>
                            </div>
                          )}
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

                    {/* Expand toggle */}
                    {eventGuests.length > 0 && (
                      <button
                        onClick={() => toggleExpand(event.id)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#703c84]/20 bg-white/50 py-2.5 text-xs font-semibold text-[#703c84] transition hover:bg-[#703c84]/5"
                      >
                        {isExpanded ? (
                          <>Hide Guest Details <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>View {eventGuests.length} Guest{eventGuests.length !== 1 ? "s" : ""} <ChevronDown className="h-4 w-4" /></>
                        )}
                      </button>

                    )}
                    <button
                      onClick={() => { setAddingGuestForEvent(event.id); setNewGuest({}); }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f56483]/30 bg-[#fdcbca]/20 py-2.5 text-xs font-semibold text-[#f56483] transition hover:bg-[#f56483]/10"
                    >
                      + Add Guest
                    </button>
                  </div>

                  {/* GUESTS PANEL */}
                  {isExpanded && eventGuests.length > 0 && (
                    <div className="border-t border-white/40 bg-white/30 px-7 py-6">
                      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#703c84]">Guest Details</p>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {eventGuests.map((guest) => {
                          const statusCfg = STATUS_CONFIG[guest.status] || STATUS_CONFIG.pending;
                          return (
                            <div key={guest.id} className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
                              <div className="mb-3 flex items-start justify-between gap-2">
                                <h4 className="font-black text-[#0b0705]">{guest.guest_name}</h4>
                                <select
                                  value={guest.status}
                                  onChange={(e) => updateGuestStatus(guest.id, e.target.value)}
                                  className="rounded-full border px-2.5 py-1 text-[10px] font-bold outline-none cursor-pointer bg-white"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="checked_in">Checked In</option>
                                  <option value="checked_out">Checked Out</option>
                                </select>

                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => setEditingGuest(guest)}
                                    className="rounded-full border border-[#703c84]/30 bg-white/60 px-2 py-1 text-[10px] font-semibold text-[#703c84] transition hover:bg-[#703c84] hover:text-white"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => deleteGuest(guest.id)}
                                    className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1.5 text-xs text-[#4a3d52]">
                                {guest.guest_email && (
                                  <a href={`mailto:${guest.guest_email}`} className="flex items-center gap-1.5 hover:text-[#703c84]">
                                    <Mail className="h-3 w-3 flex-shrink-0 text-[#703c84]" /> {guest.guest_email}
                                  </a>
                                )}
                                {guest.guest_phone && (
                                  <a href={`tel:${guest.guest_phone}`} className="flex items-center gap-1.5 font-semibold text-[#f56483]">
                                    <Phone className="h-3 w-3 flex-shrink-0" /> {guest.guest_phone}
                                  </a>
                                )}
                                {guest.guest_food_preferences && (
                                  <span className="flex items-center gap-1.5">
                                    <Utensils className="h-3 w-3 flex-shrink-0 text-[#703c84]" /> {guest.guest_food_preferences}
                                  </span>
                                )}

                                {(guest.pickup_point || guest.dropoff_point) && (
                                  <span className="flex items-start gap-1.5">
                                    <Car className="h-3 w-3 flex-shrink-0 text-[#703c84] mt-0.5" />
                                    <span>
                                      {guest.pickup_point && <span>Pickup: {guest.pickup_point}</span>}
                                      {guest.pickup_point && guest.dropoff_point && " · "}
                                      {guest.dropoff_point && <span>Drop: {guest.dropoff_point}</span>}
                                    </span>
                                  </span>
                                )}
                                {(guest.arrival_date || guest.departure_date) && (
                                  <span className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3 w-3 flex-shrink-0 text-[#703c84]" />
                                    {guest.arrival_date && <span>{guest.arrival_date}</span>}
                                    {guest.arrival_date && guest.departure_date && <span>→</span>}
                                    {guest.departure_date && <span>{guest.departure_date}</span>}
                                  </span>
                                )}
                                {(guest.arrival_time || guest.departure_time) && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 flex-shrink-0 text-[#703c84]" />

                                    {guest.arrival_time && (
                                      <span>Arrival: {guest.arrival_time}</span>
                                    )}

                                    {guest.arrival_time && guest.departure_time && (
                                      <span>•</span>
                                    )}

                                    {guest.departure_time && (
                                      <span>Departure: {guest.departure_time}</span>
                                    )}
                                  </span>
                                )}
                                {guest.special_requests && (
                                  <span className="mt-1 flex items-start gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1.5 text-amber-700">
                                    <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                    {guest.special_requests}
                                  </span>
                                )}
                                {guest.health_issues && (
                                  <span className="flex items-start gap-1.5 rounded-xl bg-red-50 px-2.5 py-1.5 text-red-600">
                                    <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                    Health: {guest.health_issues}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="rounded-[28px] border-2 border-dashed border-[#703c84]/20 bg-white/30 p-16 text-center text-[#703c84]">
                No events found matching your search.
              </div>
            )}
          </div>
        </section>

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
              const memberAssignments = assignments.filter((a) => a.member_id === member.id);
              const assignedEvents = memberAssignments
                .map((a) => events.find((e) => e.id === a.event_id)!)
                .filter(Boolean);

              return (
                <div
                  key={member.id}
                  className="rounded-[24px] border border-white/60 bg-white/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-block rounded-full bg-gradient-to-r from-[#ebdbe6] to-[#d8d0e8] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#703c84]">
                      {member.role}
                    </span>
                    {assignedEvents.length > 0 ? (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100/60 px-3 py-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> {assignedEvents.length} Event{assignedEvents.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100/60 px-3 py-1 text-[10px] font-bold text-amber-700">
                        <Clock className="h-3 w-3" /> Unassigned
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-[#0b0705]">{member.name}</h3>
                  <p className="mt-1 break-all text-xs text-[#4a3d52]">{member.email}</p>
                  <p className="mt-0.5 text-xs text-[#703c84]">{member.department || "Hospitality"}</p>

                  {assignedEvents.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-2">
                      {assignedEvents.map((ev) => (
                        <div key={ev.id} className="rounded-xl border border-[#703c84]/20 bg-[#f8f5ff]/70 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#703c84]">Assigned Event</p>
                          <p className="mt-1 font-bold text-[#0b0705] text-sm">{ev.event_name}</p>
                          <p className="text-xs text-[#5a4a60]">{ev.venue} · {ev.event_date}</p>
                          <button
                            onClick={() => unassignMember(ev.id, member.id)}
                            className="mt-2 text-[10px] font-semibold text-red-400 hover:text-red-600 transition"
                          >
                            Remove assignment
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-[#703c84]/20 bg-white/40 px-4 py-3 text-xs text-[#a090a8]">
                      Not assigned to any event
                    </div>
                  )}

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
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-5 text-xl font-black text-[#703c84]">Edit Guest</h3>
            {([
              ["guest_name", "Guest Name", "text"],
              ["guest_email", "Email", "email"],
              ["guest_phone", "Phone", "text"],
              ["guest_food_preferences", "Food Preferences", "text"],
              ["pickup_point", "Pickup Point", "text"],
              ["dropoff_point", "Dropoff Point", "text"],
              ["arrival_date", "Arrival Date", "date"],
              ["departure_date", "Departure Date", "date"],
              ["arrival_time", "Arrival Time", "time"],
              ["departure_time", "Departure Time", "time"],
              ["special_requests", "Special Requests", "text"],
              ["health_issues", "Health Issues", "text"],
            ] as [keyof GuestType, string, string][]).map(([field, label, type]) => (
              <input
                key={field}
                type={type}
                placeholder={label}
                value={(editingGuest as any)[field] ?? ""}
                onChange={(e) => setEditingGuest({ ...editingGuest, [field]: e.target.value })}
                className="mb-3 w-full rounded-xl border border-[#703c84]/20 px-4 py-2.5 text-sm outline-none focus:border-[#703c84]"
              />
            ))}
            <select
              value={editingGuest.status}
              onChange={(e) => setEditingGuest({ ...editingGuest, status: e.target.value })}
              className="mb-4 w-full rounded-xl border border-[#703c84]/20 px-4 py-2.5 text-sm outline-none focus:border-[#703c84] bg-white"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
            </select>
            <div className="flex gap-3">
              <button onClick={updateGuest} className="flex-1 rounded-full bg-gradient-to-r from-[#703c84] to-[#f56483] py-2.5 text-sm font-bold text-white">
                Save Changes
              </button>
              <button onClick={() => setEditingGuest(null)} className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {addingGuestForEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-5 text-xl font-black text-[#f56483]">Add Guest</h3>
            {([
              ["guest_name", "Guest Name *", "text"],
              ["guest_email", "Email", "email"],
              ["guest_phone", "Phone", "text"],
              ["guest_food_preferences", "Food Preferences", "text"],
              ["pickup_point", "Pickup Point", "text"],
              ["dropoff_point", "Dropoff Point", "text"],
              ["arrival_date", "Arrival Date", "date"],
              ["departure_date", "Departure Date", "date"],
              ["arrival_time", "Arrival Time", "time"],
              ["departure_time", "Departure Time", "time"],
              ["special_requests", "Special Requests", "text"],
              ["health_issues", "Health Issues", "text"],
            ] as [keyof GuestType, string, string][]).map(([field, label, type]) => (
              <input
                key={field}
                type={type}
                placeholder={label}
                value={(newGuest as any)[field] ?? ""}
                onChange={(e) => setNewGuest({ ...newGuest, [field]: e.target.value })}
                className="mb-3 w-full rounded-xl border border-[#703c84]/20 px-4 py-2.5 text-sm outline-none focus:border-[#703c84]"
              />
            ))}
            <div className="flex gap-3 mt-2">
              <button onClick={addGuest} className="flex-1 rounded-full bg-gradient-to-r from-[#f56483] to-[#703c84] py-2.5 text-sm font-bold text-white">
                Add Guest
              </button>
              <button onClick={() => { setAddingGuestForEvent(null); setNewGuest({}); }} className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
            <h3 className="mb-5 text-xl font-black text-[#703c84]">Edit Event</h3>
            {/* one input per field, bound to editingEvent state */}
            {(["event_name", "description", "event_date", "event_time", "venue"] as const).map((field) => (
              <input
                key={field}
                value={(editingEvent as any)[field]}
                onChange={(e) => setEditingEvent({ ...editingEvent, [field]: e.target.value })}
                placeholder={field.replace("_", " ")}
                className="mb-3 w-full rounded-xl border border-[#703c84]/20 px-4 py-2.5 text-sm outline-none focus:border-[#703c84]"
              />
            ))}
            <select
              value={editingEvent.department}
              onChange={(e) => setEditingEvent({ ...editingEvent, department: e.target.value })}
              className="mb-3 w-full rounded-xl border border-[#703c84]/20 px-4 py-2.5 text-sm outline-none focus:border-[#703c84] bg-white"
            >
              <option value="technical">Technical</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="central">Central</option>
            </select>
            <div className="mt-4 flex gap-3">
              <button onClick={updateEvent} className="flex-1 rounded-full bg-gradient-to-r from-[#703c84] to-[#f56483] py-2.5 text-sm font-bold text-white">
                Save Changes
              </button>
              <button onClick={() => setEditingEvent(null)} className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/40 bg-white/20 py-6 text-center backdrop-blur-xl">
        <p className="text-sm tracking-wide text-[#3d3144]">
          IIT Madras BS Presents • PARADOX '26 • Admin Panel
        </p>
      </footer>
    </main>
  );
}
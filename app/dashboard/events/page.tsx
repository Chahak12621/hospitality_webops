'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Loader,
  Users,
  Search,
  X,
} from 'lucide-react';

import { getCurrentUser } from '@/lib/getUser';
import type { Event, Profile } from '@/types/database.types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [assigningEvent, setAssigningEvent] = useState<Event | null>(null);

  const [assignRole, setAssignRole] = useState<'coordinator' | 'volunteer'>('coordinator');

  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const q = searchQuery.toLowerCase();

    setFilteredEvents(
      events.filter(
        (event) =>
          event.name?.toLowerCase().includes(q) ||
          event.department?.toLowerCase().includes(q) ||
          event.description?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, events]);

  const initPage = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      setCurrentUser(user);

      if (user.role !== 'superadmin') {
        window.location.href = '/dashboard';
        return;
      }

      await Promise.all([fetchEvents(), fetchMembers()]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch('/api/events');
    const data = await res.json();
    if (res.ok) setEvents(data);
    setLoading(false);
  };

  const fetchMembers = async () => {
    const res = await fetch('/api/team');
    const data = await res.json();
    if (res.ok) setMembers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId ? `/api/events/${editingId}` : '/api/events';
    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    await fetchEvents();
    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      name: event.name || '',
      description: event.description || '',
      department: event.department || '',
    });

    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;

    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) fetchEvents();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', department: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const getAssignedMembers = (eventId: string) =>
    members.filter((m) => m.assigned_event_id === eventId);

  const eligibleMembers = members.filter(
    (m) =>
      (m.role === 'coordinator' || m.role === 'volunteer') &&
      m.role === assignRole
  );

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-pink-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-fuchsia-500/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 py-10">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30">
                  <CalendarDays className="text-pink-400" size={28} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  Events
                </h1>
              </div>

              <p className="text-gray-400">
                Superadmin event control center
              </p>
            </div>

            <button
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-105 transition flex items-center gap-2"
            >
              <Plus size={18} />
              {showForm ? 'Cancel' : 'Create Event'}
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-pink-500/20 focus:border-pink-500 outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* FORM */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="mt-10 bg-white/5 border border-pink-500/20 p-8 rounded-3xl max-w-2xl"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Event Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-3 rounded-xl bg-black border border-white/10"
              />

              <input
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="p-3 rounded-xl bg-black border border-white/10"
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full mt-4 p-3 rounded-xl bg-black border border-white/10"
            />

            <button className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600">
              {editingId ? 'Update Event' : 'Create Event'}
            </button>
          </motion.form>
        )}

        {/* EVENTS */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-pink-400" size={40} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {filteredEvents.map((event) => {
              const assigned = getAssignedMembers(event.id);

              return (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-2xl bg-white/5 border border-pink-500/20 hover:border-pink-500/40"
                >

                  <h2 className="text-2xl font-bold">{event.name}</h2>
                  <p className="text-gray-400 text-sm">{event.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {assigned.map((m) => (
                      <span key={m.id} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                        {m.full_name}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-2 rounded-lg bg-red-500/20 text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Edit2,
  Trash2,
  Loader,
  Search,
  X,
  CalendarDays,
} from 'lucide-react';

import { getCurrentUser } from '@/lib/getUser';

import type { Profile, UserRole } from '@/types/database.types';

type EventType = {
  id: string;
  name: string;
};

const ROLE_COLORS: Record<string, string> = {
  superadmin:
    'text-orange-300 bg-orange-500/20 border-orange-500/50',

  coordinator:
    'text-pink-300 bg-pink-500/20 border-pink-500/50',

  volunteer:
    'text-blue-300 bg-blue-500/20 border-blue-500/50',

  event_head:
    'text-fuchsia-300 bg-fuchsia-500/20 border-fuchsia-500/50',
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editData, setEditData] = useState({
    full_name: '',
    role: 'coordinator' as UserRole,
    phone: '',
    assigned_event_id: '',
  });

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(teamMembers);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFiltered(
      teamMembers.filter((m) =>
        m.full_name?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, teamMembers]);

  const initPage = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      setCurrentUser(user);

      if (user.role === 'event_head') {
        window.location.href = '/dashboard/my-guests';
        return;
      }

      if (
        !['superadmin', 'coordinator', 'volunteer'].includes(user.role)
      ) {
        window.location.href = '/dashboard';
        return;
      }

      await Promise.all([fetchTeamMembers(), fetchEvents()]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/team');
      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      setTeamMembers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();

      if (!response.ok) return;

      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getEventName = (eventId?: string | null) => {
    if (!eventId) return null;

    const event = events.find((e) => e.id === eventId);
    return event?.name || 'Unknown Event';
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.role !== 'superadmin') return;

    const confirmed = confirm('Remove this team member?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      fetchTeamMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (member: Profile) => {
    if (currentUser?.role !== 'superadmin') return;

    setEditingId(member.id);

    setEditData({
      full_name: member.full_name || '',
      role: member.role || 'coordinator',
      phone: member.phone || '',
      assigned_event_id: member.assigned_event_id || '',
    });
  };

  const saveEdit = async () => {
    if (currentUser?.role !== 'superadmin') return;

    try {
      const response = await fetch(`/api/team/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      setEditingId(null);
      fetchTeamMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const canManage = currentUser?.role === 'superadmin';

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-pink-500/20 blur-[120px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-fuchsia-500/20 blur-[120px] sm:blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 md:px-12 py-6 sm:py-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <Users className="text-pink-400" size={28} />

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              Team Members
            </h1>
          </div>

          <p className="text-gray-400 text-sm sm:text-lg">
            {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''} on the platform
          </p>
        </motion.div>

        {/* SEARCH */}
        <div className="mb-6 sm:mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />

            <input
              type="text"
              placeholder="Search member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-pink-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 text-sm sm:text-base"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-pink-400" size={36} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {filtered.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-2xl p-5 sm:p-6 hover:border-pink-500/50 transition-all"
              >

                {/* EDIT MODE */}
                {editingId === member.id ? (
                  <div className="space-y-3 sm:space-y-4">

                    <input
                      value={editData.full_name}
                      onChange={(e) =>
                        setEditData({ ...editData, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-pink-500/20 text-sm sm:text-base"
                    />

                    <input
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-pink-500/20 text-sm sm:text-base"
                    />

                    <select
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value as UserRole })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black border border-pink-500/20 text-sm sm:text-base"
                    >
                      <option value="coordinator">Coordinator</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="event_head">Event Head</option>
                    </select>

                    <select
                      value={editData.assigned_event_id}
                      onChange={(e) =>
                        setEditData({ ...editData, assigned_event_id: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black border border-pink-500/20 text-sm sm:text-base"
                    >
                      <option value="">No Event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-sm sm:text-base"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-3 rounded-xl bg-white/10 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {member.full_name}
                    </h2>

                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      {member.email}
                    </p>

                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="text-pink-300 text-xs sm:text-sm mt-2 block hover:underline"
                      >
                        {member.phone}
                      </a>
                    )}

                    {member.assigned_event_id && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                        <CalendarDays size={13} />
                        <span>{getEventName(member.assigned_event_id)}</span>
                      </div>
                    )}

                    <div
                      className={`inline-block mt-3 px-3 py-1 border rounded-full text-xs font-medium capitalize ${
                        ROLE_COLORS[member.role]
                      }`}
                    >
                      {member.role}
                    </div>

                    {canManage && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(member)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300 text-xs sm:text-sm"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(member.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs sm:text-sm"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
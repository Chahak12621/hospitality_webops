'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hotel,
  Trash2,
  Loader,
  Search,
  X,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getUser';
import { hasPermission } from '@/lib/permissions';

import type { Guest, Profile } from '@/types/database.types';

// ─── helper: always get a fresh Bearer token ───────────────────────────────
async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : { 'Content-Type': 'application/json' };
}
// ──────────────────────────────────────────────────────────────────────────

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filtered, setFiltered] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(guests);
      return;
    }

    const q = searchQuery.toLowerCase();

    setFiltered(
      guests.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.email?.toLowerCase().includes(q) ||
          g.phone?.toLowerCase().includes(q) ||
          g.event_name?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, guests]);

  const initPage = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = '/auth/login';
        return;
      }

      setCurrentUser(user);
      await fetchGuests(user);
    } catch (error) {
      console.error('Error initializing guests page:', error);
    }
  };

  const fetchGuests = async (user?: Profile) => {
    try {
      setLoading(true);

      const headers = await authHeaders();
      const response = await fetch('/api/guests', { headers });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !currentUser ||
      !hasPermission(currentUser.role, 'canDeleteAllGuests')
    )
      return;

    const confirmed = confirm('Delete this guest record?');
    if (!confirmed) return;

    try {
      const headers = await authHeaders();

      const response = await fetch(`/api/guests/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete guest');
        return;
      }

      await fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const canDelete =
    currentUser &&
    hasPermission(currentUser.role, 'canDeleteAllGuests');

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* 🔮 Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-pink-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-fuchsia-500/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 py-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30">
              <Hotel className="text-pink-400" size={28} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              Guest Directory
            </h1>
          </div>

          <p className="text-gray-400 text-lg">
            Browse, search and manage all hospitality guests.
          </p>
        </motion.div>

        {/* SEARCH */}
        <div className="relative max-w-2xl mb-10">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search guests by name, email, phone, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-pink-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-all backdrop-blur-xl"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* RESULTS */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-pink-400" size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <Hotel size={60} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl">
              {searchQuery
                ? `No guests match "${searchQuery}"`
                : 'No guests found yet'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((guest, index) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="group relative backdrop-blur-xl bg-white/5 border border-pink-500/15 rounded-3xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,20,147,0.15)]"
              >

                {/* NAME */}
                <h3 className="text-xl font-bold mb-1 group-hover:text-pink-300 transition">
                  {guest.name}
                </h3>

                <p className="text-pink-400 text-sm mb-2">
                  {guest.event_name}
                </p>

                <div className="space-y-1 text-sm text-gray-400">
                  <p>{guest.email}</p>
                  <p>{guest.phone}</p>

                  {guest.room_number && (
                    <p>Room: {guest.room_number}</p>
                  )}

                  {guest.food_preferences && (
                    <p>🍽 {guest.food_preferences}</p>
                  )}

                  {guest.health_issues && (
                    <p className="text-red-300">🩺 {guest.health_issues}</p>
                  )}

                  {guest.special_requests && (
                    <p className="text-yellow-300">✨ {guest.special_requests}</p>
                  )}

                  {guest.arrival_date && (
                    <p className="text-xs text-gray-500 mt-2">
                      {guest.arrival_date} → {guest.departure_date || '—'}
                    </p>
                  )}
                </div>

                {/* BADGE */}
                {guest.accommodation_required && (
                  <div className="mt-3 inline-flex px-3 py-1 rounded-full text-xs bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300">
                    Accommodation Needed
                  </div>
                )}

                {/* DELETE */}
                {canDelete && (
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
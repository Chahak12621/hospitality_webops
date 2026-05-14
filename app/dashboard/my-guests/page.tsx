'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Loader,
    Search,
    X,
    LogOut,
    CalendarDays,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getUser';

import type { Guest, Profile } from '@/types/database.types';

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    event_name: '',
    room_number: '',
    accommodation_required: false,
    food_preferences: '',
    arrival_date: '',
    departure_date: '',
    pickup_point: '',
    dropoff_point: '',
    health_issues: '',
    special_requests: '',
};

async function authHeaders(): Promise<HeadersInit> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    return token
        ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
}

export default function MyGuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [filtered, setFiltered] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

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

            if (user.role !== 'event_head') {
                window.location.href = '/dashboard';
                return;
            }

            setCurrentUser(user);
            await fetchGuests();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGuests = async () => {
        try {
            setLoading(true);

            const headers = await authHeaders();
            const response = await fetch('/api/guests', { headers });

            const data = await response.json();

            if (!response.ok) return;

            setGuests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData(EMPTY_FORM);
    };

    const handleEdit = (guest: Guest) => {
        setEditingId(guest.id);

        setFormData({
            name: guest.name || '',
            email: guest.email || '',
            phone: guest.phone || '',
            event_name: guest.event_name || '',
            room_number: guest.room_number || '',
            accommodation_required: guest.accommodation_required || false,
            food_preferences: guest.food_preferences || '',
            arrival_date: guest.arrival_date || '',
            departure_date: guest.departure_date || '',
            pickup_point: guest.pickup_point || '',
            dropoff_point: guest.dropoff_point || '',
            health_issues: guest.health_issues || '',
            special_requests: guest.special_requests || '',
        });

        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this guest?')) return;

        try {
            const headers = await authHeaders();
            const response = await fetch(`/api/guests/${id}`, {
                method: 'DELETE',
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            fetchGuests();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Guest name is required');
            return;
        }

        try {
            const url = editingId ? `/api/guests/${editingId}` : '/api/guests';
            const method = editingId ? 'PATCH' : 'POST';

            const headers = await authHeaders();
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            setIsModalOpen(false);
            resetForm();
            fetchGuests();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth/login';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader className="animate-spin text-pink-400" size={36} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white overflow-hidden relative">

            {/* GLOW */}
            <div className="absolute top-0 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-pink-500/20 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-fuchsia-500/20 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-4 sm:px-6 md:px-12 py-6 sm:py-8">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                            My Guests
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-lg mt-1">
                            Manage guests you've added.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm"
                        >
                            <Plus size={16} />
                            Add Guest
                        </motion.button>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            <LogOut size={18} className="text-gray-400" />
                        </button>
                    </div>
                </motion.div>

                {/* SEARCH */}
                <div className="mb-6 sm:mb-8 flex justify-center sm:justify-start">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />

                        <input
                            type="text"
                            placeholder="Search guests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-pink-500/20 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-pink-500"
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

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                    {filtered.map((guest, index) => (
                        <motion.div
                            key={guest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-2xl p-5 sm:p-6"
                        >

                            <h3 className="text-lg sm:text-xl font-bold">{guest.name}</h3>

                            <p className="text-gray-400 text-xs sm:text-sm mt-1">{guest.email}</p>

                            <p className="text-gray-400 text-xs sm:text-sm">{guest.phone}</p>

                            {guest.event_name && (
                                <p className="text-pink-400 text-xs sm:text-sm mt-2">
                                    {guest.event_name}
                                </p>
                            )}

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(guest)}
                                    className="flex-1 py-2 rounded-xl bg-pink-500/20 text-pink-300 text-xs sm:text-sm"
                                >
                                    <Edit2 size={14} className="inline mr-1" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(guest.id)}
                                    className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-300 text-xs sm:text-sm"
                                >
                                    <Trash2 size={14} className="inline mr-1" />
                                    Delete
                                </button>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </div>

            {/* MODAL (unchanged UI, just better spacing on mobile) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-pink-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-6">
                            {editingId ? 'Edit Guest' : 'Add Guest'}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {Object.entries(formData).map(([key, value]) => {
                                if (typeof value === 'boolean') return null;

                                return (
                                    <input
                                        key={key}
                                        value={value as string}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [key]: e.target.value })
                                        }
                                        placeholder={key.replaceAll('_', ' ')}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-pink-500/20 text-sm"
                                    />
                                );
                            })}

                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-sm"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-white/10 text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
}
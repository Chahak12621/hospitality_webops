'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Loader,
} from 'lucide-react';

import { getUserRole } from '@/lib/getUser';

import type { UserRole } from '@/types/database.types';

type InventoryRecord = {
  id: string;
  item_name: string;
  category?: string;
  quantity: number;
  unit?: string;
  location?: string;
  status:
    | 'available'
    | 'in_use'
    | 'maintenance'
    | 'out_of_stock';
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    location: '',
    status: 'available' as
      | 'available'
      | 'in_use'
      | 'maintenance'
      | 'out_of_stock',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const role = await getUserRole();
      setUserRole(role);

      const response = await fetch('/api/inventory');
      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/inventory/${editingId}`
        : '/api/inventory';

      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      location: '',
      status: 'available',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleEdit = (item: InventoryRecord) => {
    setFormData({
      name: item.item_name,
      category: item.category || '',
      quantity: item.quantity,
      unit: item.unit || '',
      location: item.location || '',
      status: item.status,
    });

    setEditingId(item.id);
    setShowForm(true);
  };

  const canManage =
    userRole === 'superadmin' ||
    userRole === 'coordinator' ||
    userRole === 'volunteer';

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* background */}
      <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-pink-500/20 blur-[120px] sm:blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-fuchsia-500/20 blur-[120px] sm:blur-[140px] rounded-full" />

      <div className="relative z-10 px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Package className="text-pink-400" size={28} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              Inventory
            </h1>
          </div>

          <p className="text-gray-400 text-sm sm:text-lg">
            Manage hospitality resources and supplies
          </p>
        </motion.div>

        {/* ADD BUTTON */}
        {canManage && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl mb-6 sm:mb-8"
          >
            <Plus size={18} />
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        )}

        {/* FORM */}
        {showForm && canManage && (
          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-3xl p-4 sm:p-6 md:p-8 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-3 sm:p-4 rounded-xl bg-white/10 border border-pink-500/20"
              />

              <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="p-3 sm:p-4 rounded-xl bg-white/10 border border-pink-500/20"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: Number(e.target.value),
                  })
                }
                className="p-3 sm:p-4 rounded-xl bg-white/10 border border-pink-500/20"
              />

              <input
                placeholder="Unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="p-3 sm:p-4 rounded-xl bg-white/10 border border-pink-500/20"
              />

              <input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="p-3 sm:p-4 rounded-xl bg-white/10 border border-pink-500/20 sm:col-span-2"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as any,
                  })
                }
                className="p-3 sm:p-4 rounded-xl bg-white/10 border border-pink-500/20 sm:col-span-2"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-xl text-sm sm:text-base"
            >
              {editingId ? 'Update' : 'Add'} Item
            </button>
          </form>
        )}

        {/* GRID */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-pink-400" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-bold">
                  {item.item_name}
                </h3>

                <p className="text-pink-400 text-sm">{item.category}</p>
                <p className="text-gray-400 text-sm">
                  Qty: {item.quantity} {item.unit}
                </p>

                <div className="flex gap-2 mt-4">
                  {canManage && (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 py-2 text-xs sm:text-sm bg-blue-500/20 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 py-2 text-xs sm:text-sm bg-red-500/20 rounded-lg"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
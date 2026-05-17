"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  Boxes,
  LogOut,
} from "lucide-react";

type InventoryItem = {
  id: string;
  item_name: string;
  quantity: number;
  status: string;
  notes: string;
  category: string;
  unit: string;
  location: string;
};

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    item_name: "",
    quantity: 0,
    status: "available",
    notes: "",
    category: "",
    unit: "",
    location: "",
  });

  // ─────────────────────────────────────────────
  // FETCH INVENTORY
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setInventory(data || []);
  };

  // ─────────────────────────────────────────────
  // CREATE / UPDATE
  // ─────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.item_name) {
        alert("Item name required");
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from("inventory_items")
          .update({
            ...form,
          })
          .eq("id", editingId);

        if (error) {
          alert(error.message);
          return;
        }

        alert("Inventory updated");
      } else {
        const { error } = await supabase
          .from("inventory_items")
          .insert([
            {
              ...form,
            },
          ]);

        if (error) {
          alert(error.message);
          return;
        }

        alert("Inventory item created");
      }

      resetForm();

      fetchInventory();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  const deleteItem = async (id: string) => {
    const confirmDelete = confirm(
      "Delete this inventory item?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchInventory();
  };

  // ─────────────────────────────────────────────
  // EDIT
  // ─────────────────────────────────────────────
  const editItem = (item: InventoryItem) => {
    setEditingId(item.id);

    setForm({
      item_name: item.item_name,
      quantity: item.quantity,
      status: item.status,
      notes: item.notes || "",
      category: item.category || "",
      unit: item.unit || "",
      location: item.location || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ─────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────
  const resetForm = () => {
    setEditingId(null);

    setForm({
      item_name: "",
      quantity: 0,
      status: "available",
      notes: "",
      category: "",
      unit: "",
      location: "",
    });
  };

  // ─────────────────────────────────────────────
  // FILTER
  // ─────────────────────────────────────────────
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.item_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [inventory, search]);

  return (
    <main className="min-h-screen bg-[#f8f6ff] p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-black text-[#2b124c]">
            Inventory Dashboard
          </h1>

          <p className="mt-2 text-[#5f4b7a]">
            Manage hospitality inventory items.
          </p>
        </div>
        

        {/* SEARCH */}
        <div className="relative w-full md:w-[320px]">

          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d6b99]" />

          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-[#ddd3f5] bg-white py-4 pl-11 pr-4 outline-none focus:border-[#8d5cf6]"
          />
        </div>
        <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = "/";
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(245,100,131,0.3)] transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
      </div>
      

      

      {/* INVENTORY LIST */}
      <section className="mt-10">

        <h2 className="mb-5 text-2xl font-bold text-[#2b124c]">
          Inventory Items
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className="rounded-[28px] border border-[#e5dbff] bg-white p-5"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h3 className="text-xl font-bold text-[#2b124c]">
                    {item.item_name}
                  </h3>

                  <p className="mt-2 text-sm text-[#6b3df0]">
                    {item.category}
                  </p>
                </div>

                <div className="rounded-full bg-[#efe7ff] px-3 py-1 text-xs font-semibold text-[#6b3df0]">
                  {item.status}
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-[#5f4b7a]">

                <p>
                  Quantity: {item.quantity}
                </p>

                <p>
                  Unit: {item.unit || "N/A"}
                </p>

                <p>
                  Location: {item.location || "N/A"}
                </p>

                <p>
                  Notes: {item.notes || "None"}
                </p>
              </div>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => editItem(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2b124c] px-4 py-3 text-sm font-semibold text-white"
                >
                  <Pencil className="h-4 w-4" />

                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteItem(item.id)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <Trash2 className="h-4 w-4" />

                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* FORM */}
      <section className="rounded-[30px] border border-[#e5dbff] bg-white p-6 shadow-sm margintop-10">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-2xl bg-[#efe7ff] p-3">
            <Boxes className="h-6 w-6 text-[#6b3df0]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#2b124c]">
              {editingId
                ? "Edit Inventory Item"
                : "Create Inventory Item"}
            </h2>

            <p className="text-sm text-[#7d6b99]">
              Add and manage stock items.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          <input
            type="text"
            placeholder="Item name"
            value={form.item_name}
            onChange={(e) =>
              setForm({
                ...form,
                item_name: e.target.value,
              })
            }
            className="rounded-2xl border border-[#ddd3f5] px-4 py-4 outline-none"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: Number(e.target.value),
              })
            }
            className="rounded-2xl border border-[#ddd3f5] px-4 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="rounded-2xl border border-[#ddd3f5] px-4 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Unit"
            value={form.unit}
            onChange={(e) =>
              setForm({
                ...form,
                unit: e.target.value,
              })
            }
            className="rounded-2xl border border-[#ddd3f5] px-4 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            className="rounded-2xl border border-[#ddd3f5] px-4 py-4 outline-none"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="rounded-2xl border border-[#ddd3f5] px-4 py-4 outline-none"
          >
            <option value="available">
              Available
            </option>

            <option value="reserved">
              Reserved
            </option>

            <option value="in-use">
              In Use
            </option>
          </select>
        </div>

        <textarea
          placeholder="Notes..."
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
          className="mt-4 min-h-[120px] w-full rounded-2xl border border-[#ddd3f5] p-4 outline-none"
        />

        <div className="mt-5 flex flex-wrap gap-4">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#6b3df0] px-6 py-4 font-semibold text-white"
          >
            <Plus className="h-5 w-5" />

            {editingId
              ? "Update Item"
              : "Create Item"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-2xl border border-[#ddd3f5] px-6 py-4 font-semibold text-[#2b124c]"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
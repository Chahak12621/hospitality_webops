export type UserRole =
  | 'superadmin'
  | 'coordinator'
  | 'volunteer'
  | 'event_head';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  assigned_event_id?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  department?: string;
  assigned_event_head?: string;
  created_at?: string;
}

// Single source of truth for Guest - matches Supabase table columns
export interface Guest {
  id: string;
  event_id?: string;
  event_name?: string;       // joined/stored field for display
  name: string;              // actual DB column
  email?: string;
  phone?: string;
  accommodation_required?: boolean;
  food_preferences?: string;
  arrival_date?: string;
  departure_date?: string;
  pickup_point?: string;
  dropoff_point?: string;
  health_issues?: string;
  special_requests?: string;
  room_number?: string;
  status?: string;
  created_by?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  status: 'available' | 'in-use' | 'reserved';
  notes?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface TeamContact {
  id: string;
  name: string;
  phone: string;
  role_label?: string;
  assigned_event_id?: string;
  display_order?: number;
}

export interface DocumentFile {
  id: string;
  title: string;
  file_url: string;
  uploaded_by?: string;
  created_at?: string;
}
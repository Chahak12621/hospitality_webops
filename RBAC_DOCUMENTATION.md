# Role-Based Access Control System Documentation

## Overview
This document describes the complete role-based hospitality management system for Paradox 2026.

## User Roles & Permissions

### 1. **Superadmin**
- **Dashboard**: Full overview with statistics
- **Team Management**: View, create, edit, delete team members
- **Guests**: View all guests, edit/delete guest information
- **Inventory**: View, create, edit, delete inventory items
- **Events**: Create and manage events, assign team members
- **Redirect on login**: Dashboard home page

### 2. **Coordinator**
- **Team Members**: View only (read-only)
- **Guests**: View all guests (read-only)
- **Inventory**: View and edit items (cannot delete)
- **Events**: No access
- **Redirect on login**: Guests page

### 3. **Volunteer**
- **Team Members**: View only (read-only)
- **Guests**: No access
- **Inventory**: View and edit items (cannot delete)
- **Events**: No access
- **Redirect on login**: Inventory page

### 4. **Event Head**
- **Team Members**: No access
- **Guests**: Can create, view, and edit only their own guest records
- **Inventory**: No access
- **Events**: No access
- **Redirect on login**: Guests page

## Database Schema

### Tables Required

#### team_members
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- name: VARCHAR
- email: VARCHAR
- role: ENUM(superadmin, coordinator, volunteer, event_head)
- phone: VARCHAR (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### guests
```sql
- id: UUID (primary key)
- event_head_id: UUID (foreign key to team_members)
- event_name: VARCHAR
- guest_name: VARCHAR
- guest_email: VARCHAR (optional)
- guest_phone: VARCHAR (optional)
- check_in_date: DATE (optional)
- check_out_date: DATE (optional)
- room_number: VARCHAR (optional)
- special_requests: TEXT (optional)
- status: ENUM(pending, confirmed, checked_in, checked_out)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### inventory_items
```sql
- id: UUID (primary key)
- name: VARCHAR
- category: VARCHAR
- quantity: INTEGER
- unit: VARCHAR (pcs, kg, liters, etc.)
- location: VARCHAR (optional)
- status: ENUM(available, in_use, maintenance, out_of_stock)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### event_assignments
```sql
- id: UUID (primary key)
- event_name: VARCHAR
- event_head_id: UUID (foreign key to team_members)
- team_member_ids: UUID[] (array of team member IDs)
- start_date: DATE
- end_date: DATE
- description: TEXT (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## API Endpoints

### Team Management
- `GET /api/team` - List all team members (Superadmin only)
- `POST /api/team` - Create new team member (Superadmin only)
- `GET /api/team/[id]` - Get specific team member
- `PATCH /api/team/[id]` - Update team member (Superadmin only)
- `DELETE /api/team/[id]` - Delete team member (Superadmin only)

### Guest Management
- `GET /api/guests` - List guests (all guests for superadmin/coordinator, only own for event_head)
- `POST /api/guests` - Create guest (event_head, coordinator, superadmin)
- `GET /api/guests/[id]` - Get specific guest
- `PATCH /api/guests/[id]` - Update guest (event_head can only edit own, coordinator/superadmin can edit all)
- `DELETE /api/guests/[id]` - Delete guest (Superadmin only)

### Inventory Management
- `GET /api/inventory` - List all inventory (coordinator, volunteer, superadmin)
- `POST /api/inventory` - Create item (Superadmin only)
- `PATCH /api/inventory/[id]` - Update item (coordinator and superadmin)
- `DELETE /api/inventory/[id]` - Delete item (Superadmin only)

## Frontend Pages

### `/dashboard/home`
- **Accessible to**: Superadmin only
- **Features**: Dashboard overview with statistics and quick actions

### `/dashboard/team`
- **Accessible to**: Superadmin, Coordinator, Volunteer
- **Features**: 
  - View all team members
  - Superadmin can add, edit, delete
  - Others view-only

### `/dashboard/guests`
- **Accessible to**: Superadmin, Coordinator, Event Head
- **Features**:
  - Event heads see only their own guests
  - Coordinator/Superadmin see all guests
  - Event heads can create/edit own guests
  - Superadmin can delete any guest

### `/dashboard/inventory`
- **Accessible to**: Superadmin, Coordinator, Volunteer
- **Features**:
  - View all inventory
  - Superadmin can create/edit/delete
  - Coordinator/Volunteer can edit only

### `/dashboard/events`
- **Accessible to**: Superadmin only
- **Features**: Create and manage events

## Styling
All pages follow the landing page design:
- Dark theme (black background)
- Pink/Fuchsia gradient accents
- Glassmorphism effects with backdrop blur
- Framer Motion animations
- Responsive grid layouts
- Smooth transitions and hover effects

## Key Files

- `lib/roles.ts` - Role permissions and access control
- `lib/getUser.ts` - User authentication helpers
- `types/database.types.ts` - Database type definitions
- `app/api/team/route.ts` - Team API endpoints
- `app/api/guests/route.ts` - Guests API endpoints
- `app/api/inventory/route.ts` - Inventory API endpoints
- `app/dashboard/*/page.tsx` - Dashboard pages
- `app/dashboard/layout.tsx` - Dashboard layout with role-based navigation

## Setup Instructions

1. **Create Supabase Tables** - Use the schema defined above to create tables
2. **Enable Row Level Security** - Implement RLS policies for data protection
3. **Configure Authentication** - Set up Supabase auth with email/password
4. **Install Dependencies** - Ensure framer-motion is installed
5. **Environment Variables** - Configure Supabase URL and keys
6. **Test Flows** - Create test users with different roles and verify access

## Security Considerations

- All API endpoints check user role before returning data
- Event heads can only access their own guests
- Superadmin approvals required for sensitive operations
- RLS policies should enforce database-level access control
- Session-based authentication with Supabase

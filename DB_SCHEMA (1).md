# DB_SCHEMA.md — Paradox 2026 Hospitality Portal (Supabase / PostgreSQL)

> Copy-paste each SQL block into **Supabase → SQL Editor → New Query** and click **Run**.
> Run them **in order** — later blocks have foreign key dependencies on earlier ones.

---

## Step 1 — Enable UUID Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Step 2 — Create ENUM Types

```sql
-- User roles
CREATE TYPE user_role AS ENUM (
  'owner',
  'admin',
  'event_head',
  'event_poc',
  'inventory',
  'guest'
);

-- Accommodation options
CREATE TYPE accommodation_type AS ENUM (
  'Yes - Guest House',
  'Yes - Hotel',
  'No',
  'TBD'
);

-- Food preferences
CREATE TYPE food_preference AS ENUM (
  'Veg',
  'Non-Veg',
  'Vegan',
  'Jain',
  'No Preference'
);

-- Task status
CREATE TYPE task_status AS ENUM (
  'todo',
  'in_progress',
  'done'
);

-- Task priority
CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high'
);

-- Inventory status
CREATE TYPE inventory_status AS ENUM (
  'Available',
  'In Use',
  'Reserved',
  'Depleted'
);

-- File types for uploaded documents
CREATE TYPE document_file_type AS ENUM (
  'pdf',
  'xlsx',
  'xls',
  'png',
  'jpg'
);

-- Audit log actions
CREATE TYPE log_action AS ENUM (
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'FAILED_LOGIN',
  'UPLOAD',
  'BROADCAST',
  'CHECKIN'
);

-- Audit log entity types
CREATE TYPE log_entity AS ENUM (
  'User',
  'Guest',
  'Inventory',
  'Task',
  'Document',
  'Auth',
  'Emergency'
);

-- Token types
CREATE TYPE token_type AS ENUM (
  'refresh',
  'password_reset',
  'qr_checkin'
);

-- Notification channel
CREATE TYPE notification_channel AS ENUM (
  'email',
  'sms'
);

-- Notification status
CREATE TYPE notification_status AS ENUM (
  'pending',
  'sent',
  'failed'
);
```

---

## Step 3 — `users` Table

```sql
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL UNIQUE,
  password_hash         TEXT NOT NULL,
  role                  user_role NOT NULL DEFAULT 'guest',
  phone                 TEXT,
  assigned_event_id     UUID,                        -- FK added after events table
  assigned_team         TEXT,                        -- e.g. "Reception", "F&B", "Logistics"
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  lock_until            TIMESTAMPTZ,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
```

---

## Step 4 — `events` Table

```sql
CREATE TABLE events (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  department           TEXT,                         -- "Technical", "Cultural", "Management"
  event_head_name      TEXT,
  event_head_contact   TEXT,
  event_head_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  poc_user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  start_date           TIMESTAMPTZ,
  end_date             TIMESTAMPTZ,
  venue                TEXT,
  description          TEXT,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_name ON events(name);
```

---

## Step 5 — Add FK from `users` → `events`

```sql
ALTER TABLE users
  ADD CONSTRAINT fk_users_assigned_event
  FOREIGN KEY (assigned_event_id)
  REFERENCES events(id)
  ON DELETE SET NULL;

CREATE INDEX idx_users_assigned_event ON users(assigned_event_id);
```

---

## Step 6 — `guests` Table

```sql
CREATE TABLE guests (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event linkage
  event_id                UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_name              TEXT NOT NULL,             -- denormalized for quick display
  event_department        TEXT,

  -- Event head info (snapshot at time of entry)
  event_head_name         TEXT,
  event_head_contact      TEXT,

  -- Guest identity
  guest_name              TEXT NOT NULL,
  guest_email             TEXT,
  guest_phone             TEXT,

  -- Logistics
  accommodation_required  accommodation_type NOT NULL DEFAULT 'TBD',
  food_preferences        food_preference NOT NULL DEFAULT 'No Preference',
  arrival_datetime        TIMESTAMPTZ,
  departure_datetime      TIMESTAMPTZ,
  pickup_point            TEXT,
  dropoff_point           TEXT,
  health_issues           TEXT,
  notes                   TEXT,

  -- Check-in
  checked_in              BOOLEAN NOT NULL DEFAULT FALSE,
  check_in_at             TIMESTAMPTZ,
  qr_code_url             TEXT,
  qr_token                TEXT UNIQUE,

  -- Soft delete
  deleted_at              TIMESTAMPTZ DEFAULT NULL,

  -- Tracking
  created_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_guest_email ON guests(guest_email);
CREATE INDEX idx_guests_arrival ON guests(arrival_datetime);
CREATE INDEX idx_guests_deleted_at ON guests(deleted_at);
CREATE INDEX idx_guests_qr_token ON guests(qr_token);
```

---

## Step 7 — `tasks` Table

```sql
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  assigned_to   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id      UUID REFERENCES events(id) ON DELETE SET NULL,
  status        task_status NOT NULL DEFAULT 'todo',
  priority      task_priority NOT NULL DEFAULT 'medium',
  due_date      TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  deleted_at    TIMESTAMPTZ DEFAULT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to, status);
CREATE INDEX idx_tasks_event_id ON tasks(event_id);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at);
```

---

## Step 8 — `inventory` Table

```sql
CREATE TABLE inventory (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name           TEXT NOT NULL,
  category            TEXT,                          -- "Stationery","F&B","Electronics","Decor","Logistics"
  quantity            INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit                TEXT NOT NULL DEFAULT 'pcs',   -- "pcs", "boxes", "kg", "litres"
  status              inventory_status NOT NULL DEFAULT 'Available',
  assigned_to         TEXT,                          -- which event or team is using it
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  notes               TEXT,
  deleted_at          TIMESTAMPTZ DEFAULT NULL,
  updated_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_deleted_at ON inventory(deleted_at);
CREATE INDEX idx_inventory_item_name_fts ON inventory USING gin(to_tsvector('english', item_name));
```

---

## Step 9 — `documents` Table

```sql
CREATE TABLE documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  file_type     document_file_type,
  original_name TEXT,
  stored_path   TEXT,                                -- relative path on disk or S3 key
  file_url      TEXT,                                -- publicly accessible URL
  file_size     INTEGER,                             -- in bytes
  description   TEXT,
  uploaded_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deleted_at    TIMESTAMPTZ DEFAULT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_deleted_at ON documents(deleted_at);
```

---

## Step 10 — `logs` Table (Audit Trail — Immutable)

```sql
CREATE TABLE logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action         log_action NOT NULL,
  entity         log_entity NOT NULL,
  entity_id      UUID,                               -- ID of the affected row in any table
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  changed_fields JSONB DEFAULT '{}',                 -- { "field": { "from": x, "to": y } }
  ip_address     TEXT,
  user_agent     TEXT,
  timestamp      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at — logs are append-only
);

CREATE INDEX idx_logs_entity ON logs(entity, entity_id);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_timestamp ON logs(timestamp DESC);
```

---

## Step 11 — `tokens` Table

```sql
CREATE TABLE tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  type        token_type NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ DEFAULT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tokens_token ON tokens(token);
CREATE INDEX idx_tokens_user_id_type ON tokens(user_id, type);
CREATE INDEX idx_tokens_expires_at ON tokens(expires_at);
```

---

## Step 12 — `notifications` Table

```sql
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel       notification_channel,
  subject       TEXT,
  body          TEXT,
  status        notification_status NOT NULL DEFAULT 'pending',
  sent_at       TIMESTAMPTZ,
  error         TEXT,
  triggered_by  TEXT,                                -- "task_assigned", "emergency_broadcast", etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, status);
```

---

## Step 13 — Auto-update `updated_at` Trigger

```sql
-- Create the trigger function once
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to every table that has updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Step 14 — Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory     ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ── Helper functions (read role + id + event from JWT claims) ──

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb->>'role',
    'guest'
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb->>'sub')::UUID;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_event()
RETURNS UUID AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb->>'assigned_event_id')::UUID;
$$ LANGUAGE sql STABLE;

-- ── USERS ──
CREATE POLICY "owners full access on users"
  ON users FOR ALL
  USING (current_user_role() = 'owner');

CREATE POLICY "any user can view own profile"
  ON users FOR SELECT
  USING (id = current_user_id());

CREATE POLICY "admins can view all users"
  ON users FOR SELECT
  USING (current_user_role() = 'admin');

-- ── EVENTS ──
CREATE POLICY "owners and admins manage events"
  ON events FOR ALL
  USING (current_user_role() IN ('owner', 'admin'));

CREATE POLICY "event roles can view events"
  ON events FOR SELECT
  USING (current_user_role() IN ('event_head', 'event_poc', 'inventory'));

-- ── GUESTS ──
CREATE POLICY "owners and admins full access on guests"
  ON guests FOR ALL
  USING (current_user_role() IN ('owner', 'admin'));

CREATE POLICY "event_head and poc manage their event guests"
  ON guests FOR ALL
  USING (
    current_user_role() IN ('event_head', 'event_poc')
    AND event_id = current_user_event()
  );

CREATE POLICY "guest role views own record"
  ON guests FOR SELECT
  USING (
    current_user_role() = 'guest'
    AND guest_email = (SELECT email FROM users WHERE id = current_user_id())
  );

-- ── TASKS ──
CREATE POLICY "owners and admins full access on tasks"
  ON tasks FOR ALL
  USING (current_user_role() IN ('owner', 'admin'));

CREATE POLICY "users view own tasks"
  ON tasks FOR SELECT
  USING (assigned_to = current_user_id());

CREATE POLICY "users update status of own tasks"
  ON tasks FOR UPDATE
  USING (assigned_to = current_user_id());

-- ── INVENTORY ──
CREATE POLICY "owners and inventory team full access"
  ON inventory FOR ALL
  USING (current_user_role() IN ('owner', 'inventory'));

-- ── DOCUMENTS ──
CREATE POLICY "owners and admins manage documents"
  ON documents FOR ALL
  USING (current_user_role() IN ('owner', 'admin'));

CREATE POLICY "event roles view documents"
  ON documents FOR SELECT
  USING (current_user_role() IN ('event_head', 'event_poc', 'inventory'));

-- ── LOGS ──
CREATE POLICY "only owners view logs"
  ON logs FOR SELECT
  USING (current_user_role() = 'owner');
-- Inserts to logs happen via service_role key only (bypasses RLS)

-- ── TOKENS ──
CREATE POLICY "users view own tokens"
  ON tokens FOR SELECT
  USING (user_id = current_user_id());

-- ── NOTIFICATIONS ──
CREATE POLICY "users view own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = current_user_id());

CREATE POLICY "owners and admins view all notifications"
  ON notifications FOR SELECT
  USING (current_user_role() IN ('owner', 'admin'));
```

---

## Step 15 — Seed Data (Dev / Testing)

```sql
-- Owner user
-- password_hash below = bcrypt of "password123" (12 rounds) — CHANGE IN PROD
INSERT INTO users (name, email, password_hash, role, phone) VALUES
  ('Ayush SK', 'ayush@iitmparadox.org',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TdxCm0fQmbDhWyS9dVz6sKl3JXae',
   'owner', '9322949492');

-- Events
INSERT INTO events (name, department, event_head_name, venue) VALUES
  ('Technical Quiz',  'Technical', 'Ravi Kumar',  'CLT Auditorium'),
  ('Cultural Night',  'Cultural',  'Priya Menon', 'Open Air Theatre'),
  ('Hackathon 2026',  'Technical', 'Arjun Nair',  'CLT Labs');

-- Guests (run after events exist)
INSERT INTO guests (
  event_id, event_name, event_department,
  guest_name, guest_email, guest_phone,
  accommodation_required, food_preferences,
  arrival_datetime, departure_datetime,
  pickup_point, dropoff_point
)
SELECT
  e.id, e.name, e.department,
  g.guest_name, g.guest_email, g.guest_phone,
  g.accommodation_required::accommodation_type,
  g.food_preferences::food_preference,
  g.arrival_datetime::TIMESTAMPTZ,
  g.departure_datetime::TIMESTAMPTZ,
  g.pickup_point, g.dropoff_point
FROM events e
JOIN (VALUES
  ('Technical Quiz', 'Dr. Ramesh Iyer',  'ramesh@mit.edu',      '9876543210', 'Yes - Guest House', 'Veg',          '2026-03-15 10:00:00+05:30', '2026-03-17 18:00:00+05:30', 'Chennai Airport',  'IIT Madras Gate'),
  ('Technical Quiz', 'Prof. Ananya Roy', 'ananya@iitb.ac.in',   '9123456789', 'Yes - Hotel',       'No Preference','2026-03-15 14:00:00+05:30', '2026-03-16 20:00:00+05:30', 'Chennai Central',  'IIT Madras Gate'),
  ('Cultural Night', 'Kiran Raj',        'kiran@artist.com',    '9001234567', 'Yes - Hotel',       'Vegan',        '2026-03-16 09:00:00+05:30', '2026-03-17 12:00:00+05:30', 'Chennai Airport',  'Hotel Drop'),
  ('Cultural Night', 'Meena Iyer',       'meena@dance.org',     '9988776655', 'No',                'Jain',         '2026-03-16 11:00:00+05:30', '2026-03-17 15:00:00+05:30', 'Chennai Airport',  'Hotel Drop'),
  ('Hackathon 2026', 'Mr. Vikram Shah',  'vikram@startup.io',   '9112233445', 'Yes - Guest House', 'Non-Veg',      '2026-03-14 08:00:00+05:30', '2026-03-18 10:00:00+05:30', 'Chennai Airport',  'IIT Madras Gate'),
  ('Hackathon 2026', 'Dr. Sunita Patel', 'sunita@google.com',   '9223344556', 'Yes - Hotel',       'Veg',          '2026-03-14 16:00:00+05:30', '2026-03-17 20:00:00+05:30', 'Chennai Airport',  'Hotel Drop')
) AS g(event_name, guest_name, guest_email, guest_phone, accommodation_required, food_preferences, arrival_datetime, departure_datetime, pickup_point, dropoff_point)
ON e.name = g.event_name;

-- Inventory items
INSERT INTO inventory (item_name, category, quantity, unit, status, low_stock_threshold) VALUES
  ('A4 Paper Reams',      'Stationery',  20,  'reams', 'Available', 5),
  ('Water Bottles (1L)',  'F&B',         200, 'pcs',   'Available', 20),
  ('Extension Cords',     'Electronics', 10,  'pcs',   'Available', 2),
  ('Welcome Banners',     'Decor',       6,   'pcs',   'Reserved',  1),
  ('Name Badge Holders',  'Stationery',  150, 'pcs',   'In Use',    10);
```

---

## Table Relationships Summary

```
users
  └── assigned_event_id ──────────────────────► events.id

events
  ├── event_head_user_id ──────────────────────► users.id
  └── poc_user_id ─────────────────────────────► users.id

guests
  ├── event_id ────────────────────────────────► events.id
  ├── created_by ──────────────────────────────► users.id
  └── updated_by ──────────────────────────────► users.id

tasks
  ├── assigned_to ─────────────────────────────► users.id
  ├── assigned_by ─────────────────────────────► users.id
  └── event_id ────────────────────────────────► events.id

inventory
  └── updated_by ──────────────────────────────► users.id

documents
  └── uploaded_by ─────────────────────────────► users.id

logs
  └── user_id ─────────────────────────────────► users.id
     (entity_id is untyped — enforced in app layer)

tokens
  └── user_id ─────────────────────────────────► users.id

notifications
  └── recipient_id ────────────────────────────► users.id
```

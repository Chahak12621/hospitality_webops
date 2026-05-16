# FUNCTIONALITY.md — Paradox 2026 Hospitality Portal

> Feed this file to GitHub Copilot alongside `DB_SCHEMA.md` and `ARCHITECTURE.md` to scaffold the full application.

---

## 1. Authentication & Session Management

### 1.1 Login
- Single login page at `/login`
- Email + password fields
- On submit → POST `/api/auth/login` → returns JWT access token (15 min) + refresh token (7 days) in httpOnly cookie
- Failed login: show inline error, lock account after 5 consecutive failures for 15 min

### 1.2 JWT Middleware
- Every protected API route validates Bearer token from `Authorization` header
- Decoded payload shape: `{ userId, role, assignedEvent, iat, exp }`
- Refresh flow: if access token expired, client hits POST `/api/auth/refresh` with cookie → gets new access token

### 1.3 Logout
- DELETE `/api/auth/logout` → clears refresh token cookie + server-side token blacklist entry

### 1.4 Password Reset
- POST `/api/auth/forgot-password` → sends reset link via email (valid 1 hour)
- POST `/api/auth/reset-password` → validates token, updates passwordHash

---

## 2. Role-Based Access Control (RBAC)

Roles (stored in `users.role`):

| Role | Slug |
|------|------|
| Owner (Hospi Head + Super Cods) | `owner` |
| Admin (Cods + Volunteers) | `admin` |
| Event Head | `event_head` |
| Event POC (Hospitality) | `event_poc` |
| Inventory Team | `inventory` |
| Judge / Guest | `guest` |

### Permission Matrix

| Feature | owner | admin | event_head | event_poc | inventory | guest |
|---------|-------|-------|------------|-----------|-----------|-------|
| View Home | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Team Contacts | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Assign Tasks | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Guest Info | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| CRUD Own Event Guests | ✅ | ✅ | ✅ (own event) | ✅ (own event) | ❌ | ❌ |
| View Own Guest Schedule | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| CRUD Inventory | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Audit Logs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send Emergency Broadcast | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Upload SOP Docs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Implementation
- `roleMiddleware(allowedRoles[])` — Express middleware that reads `req.user.role` and aborts with 403 if not in allowed list
- For event-scoped routes: additional check `req.user.assignedEvent === req.params.eventId` (bypassed for `owner`/`admin`)

---

## 3. Home Page (Public within portal)

### 3.1 Static Content
- Render department title, taglines, sub-headline, vision, mission, "What We Handle" cards, step-by-step workflow, and contact section
- All text content is hardcoded in a `homeContent.ts` constants file (not CMS-driven)

### 3.2 SOP Document Management
- GET `/api/documents` → list all uploaded SOP/workflow PDFs (title, uploadedBy, uploadedAt, fileUrl)
- POST `/api/documents` (owner/admin only) → upload PDF/Excel via multipart; store file in `/uploads/documents/`; save metadata to DB
- DELETE `/api/documents/:id` (owner only) → soft-delete (sets `deletedAt`)
- Frontend: card grid showing doc thumbnails; click → opens in new tab

---

## 4. Section 1 — Team Communication

### 4.1 Team Contacts Directory
- GET `/api/users?role=&team=&event=` → paginated, filterable list of team members
- Fields shown: Name, Phone, Assigned Team, Assigned Event/POC role
- Search bar: debounced client-side filter across name + event fields
- Visible to: owner, admin, event_head, event_poc, inventory

### 4.2 Task Assignment Dashboard
- GET `/api/tasks` → list tasks; query params: `?assignedTo=&status=&event=`
- POST `/api/tasks` (owner/admin only) → create task `{ title, description, assignedTo: userId, dueDate, priority }`
- PATCH `/api/tasks/:id` → update status (`todo | in_progress | done`) — assignee can update their own task status
- DELETE `/api/tasks/:id` (owner/admin only)
- GET `/api/tasks/:id` → single task detail
- Frontend: Kanban board with three columns (To Do / In Progress / Done); drag-and-drop via `@dnd-kit`

### 4.3 Notifications (Task-related)
- On task creation → send email to assigned user
- On task status change → notify task creator

---

## 5. Section 2 — Guest Information

### 5.1 Guest CRUD
- GET `/api/guests` → all guests (owner/admin); filtered by `assignedEvent` for event_head/event_poc
- GET `/api/guests/:id` → single guest record
- POST `/api/guests` (owner/admin/event_head/event_poc) → create guest with full form fields
- PATCH `/api/guests/:id` → update; event-scoped roles can only edit guests in their event
- DELETE `/api/guests/:id` (owner/admin only) → soft delete

### 5.2 Guest Form Fields
```
eventId              (ref → events collection)
eventName            (string, auto-filled from eventId)
eventHeadName        (string)
eventHeadContact     (string, phone)
eventDepartment      (string)
guestName            (string, required)
guestEmail           (string, required)
guestPhone           (string)
accommodationRequired (enum: "Yes - Guest House" | "Yes - Hotel" | "No" | "TBD")
foodPreferences      (enum: "Veg" | "Non-Veg" | "Vegan" | "Jain" | "No Preference")
arrivalDateTime      (datetime)
departureDateTime    (datetime)
pickupPoint          (string)
dropoffPoint         (string)
healthIssues         (string, textarea)
notes                (string, textarea)
```

### 5.3 Event-wise Segregation
- Frontend: tabs or accordion grouped by event name
- event_head/event_poc: only see their own event tab
- owner/admin: see all events with a global filter dropdown

### 5.4 Guest Portal (role: guest)
- Read-only view scoped to their own record (matched by email from JWT)
- Shows: event schedule, arrival/departure info, pickup/drop-off, contact person

---

## 6. Section 3 — Inventory Management

### 6.1 Inventory CRUD
- GET `/api/inventory` (owner/inventory) → list all items with filters `?status=&search=`
- GET `/api/inventory/:id` → single item
- POST `/api/inventory` (owner/inventory) → create item `{ itemName, category, quantity, status, notes }`
- PATCH `/api/inventory/:id` (owner/inventory) → update fields
- DELETE `/api/inventory/:id` (owner only) → soft delete

### 6.2 Inventory Fields
```
itemName     (string, required)
category     (string, e.g. "Stationery", "F&B", "Electronics", "Decor")
quantity     (number)
unit         (string, e.g. "pcs", "boxes", "kg")
status       (enum: "Available" | "In Use" | "Reserved" | "Depleted")
assignedTo   (string — which event/team is using it)
notes        (string)
```

### 6.3 Bulk Upload
- POST `/api/inventory/bulk` → accepts Excel (.xlsx) upload; parse with `xlsx` library; validate rows; insert batch

### 6.4 Inventory Alerts
- When `quantity` falls below a configurable threshold (`lowStockThreshold`), trigger email alert to inventory team and owners

---

## 7. File Uploads

- All file uploads handled via `multer` middleware
- Allowed types: PDF, Excel (.xlsx, .xls), images (PNG, JPG)
- Max file size: 10 MB
- Storage: local `/uploads/` directory in dev; swap to S3 bucket in prod via env flag `STORAGE=s3`
- File metadata stored in `documents` collection with `uploadedBy`, `uploadedAt`, `originalName`, `storedPath`

---

## 8. Audit Logs

- Every mutating API call (POST/PATCH/DELETE) on guests, inventory, tasks, and users triggers an audit log entry
- Log shape: `{ action, entity, entityId, userId, changedFields, timestamp, ipAddress }`
- GET `/api/logs` (owner only) → paginated audit log with filters `?entity=&userId=&from=&to=`
- Logs are immutable — no DELETE endpoint

---

## 9. Emergency Communication

### 9.1 Broadcast
- POST `/api/emergency/broadcast` (owner only)
- Body: `{ message, channels: ["email", "sms"] }`
- Sends to all `event_head` and `event_poc` users simultaneously
- Uses Nodemailer (email) + Twilio / Fast2SMS (SMS)
- Response includes delivery report

### 9.2 SOS Button
- Frontend floating button (visible only to owners)
- Opens modal to type message → one click sends broadcast

---

## 10. Dashboard Analytics (Owner/Admin)

- GET `/api/analytics/summary` → returns:
  - Total guests, guests arriving today, guests departing today
  - Guests by accommodation type (pie chart data)
  - Guests by food preference (bar chart data)
  - Task completion rate (% done vs total)
  - Inventory items by status (donut chart data)
  - Arrivals timeline (next 7 days, per-day counts)
- Frontend: `/dashboard` page with `recharts` components

---

## 11. QR Code Check-in (Optional / Phase 2)

- POST `/api/guests/:id/qr` (owner/admin) → generate QR code linking to guest check-in page; store qrCodeUrl in guest record
- GET `/api/guests/checkin/:token` → public endpoint; validates token → returns guest name + event; marks `checkedIn: true`, timestamps `checkInAt`
- Frontend: scannable QR page usable on volunteer mobile devices

---

## 12. Search & Filter (Global)

- GET `/api/search?q=&type=guest|user|inventory` → cross-entity search
- Returns top 5 results per entity type with entity type label
- Frontend: global search bar in navbar, results in dropdown overlay

---

## 13. Notifications (Email)

All email via Nodemailer with SMTP config from env vars:
| Trigger | Recipients |
|---------|-----------|
| New task assigned | Assignee |
| Task status changed | Creator |
| Guest record created | Event Head of that event |
| Guest arrival within 24h | Assigned POC |
| Inventory item low stock | Inventory team + owners |
| Emergency broadcast | All event heads + POCs |
| Password reset | Requesting user |

---

## 14. Error Handling Standards

- All API errors return: `{ success: false, error: { code, message } }`
- HTTP status codes: 400 (validation), 401 (unauthenticated), 403 (unauthorized), 404 (not found), 422 (unprocessable), 500 (server)
- Global Express error handler catches unhandled errors and logs to console + optional Sentry
- Frontend: Axios interceptor shows toast notifications for API errors

---

## 15. Environment Variables Required

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/paradox-hospi

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@iitmparadox.org

# SMS (optional)
TWILIO_SID=
TWILIO_AUTH=
TWILIO_FROM=

# File Storage
STORAGE=local   # or 's3'
AWS_BUCKET=
AWS_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=

# App
FRONTEND_URL=http://localhost:3000
```

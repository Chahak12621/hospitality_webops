# ARCHITECTURE.md — Paradox 2026 Hospitality Portal

> This document defines the tech stack, folder structure, API design, component tree, and deployment setup.  
> Use alongside `FUNCTIONALITY.md` and `DB_SCHEMA.md` to build the complete application.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR, file-based routing, API routes |
| Styling | Tailwind CSS + shadcn/ui | Rapid, accessible UI components |
| State | Zustand (client) + TanStack Query (server) | Clean server-state caching |
| Charts | Recharts | Lightweight, React-native |
| Drag & Drop | @dnd-kit/core | Kanban task board |
| Backend | Express.js + TypeScript | REST API, middleware flexibility |
| Auth | JWT (access) + httpOnly cookie (refresh) | Secure, stateless |
| Database | MongoDB + Mongoose | Flexible schema, fast queries |
| File Upload | Multer | Handles multipart; swappable to S3 |
| Email | Nodemailer | SMTP-based transactional email |
| SMS | Fast2SMS (or Twilio) | Indian SMS gateway |
| Validation | Zod (frontend) + express-validator (backend) | End-to-end type-safe validation |
| Testing | Jest + Supertest (backend), Playwright (E2E) | Standard Node.js testing |
| Deployment | Vercel (frontend) + Railway / Render (backend) + MongoDB Atlas | Free-tier friendly |

---

## Folder Structure

```
paradox-hospi/
├── frontend/                          # Next.js App Router
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (Navbar, Footer, AuthProvider)
│   │   ├── page.tsx                   # Home page (/)
│   │   ├── login/
│   │   │   └── page.tsx               # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Analytics dashboard (owner/admin)
│   │   ├── team/
│   │   │   ├── page.tsx               # Team contacts directory
│   │   │   └── tasks/
│   │   │       └── page.tsx           # Task kanban board
│   │   ├── guests/
│   │   │   ├── page.tsx               # Guest list (event-scoped)
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Create guest form
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Guest detail view
│   │   │       └── edit/
│   │   │           └── page.tsx       # Edit guest form
│   │   ├── inventory/
│   │   │   ├── page.tsx               # Inventory list
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Add inventory item
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx       # Edit inventory item
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   └── page.tsx           # User management (owner only)
│   │   │   └── logs/
│   │   │       └── page.tsx           # Audit logs (owner only)
│   │   └── guest-portal/
│   │       └── page.tsx               # Read-only view for judge/guest role
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RoleGuard.tsx          # Wraps pages; redirects if role unauthorized
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── WhatWeHandle.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── SopDocuments.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── team/
│   │   │   ├── ContactCard.tsx
│   │   │   ├── ContactsTable.tsx
│   │   │   ├── TaskBoard.tsx          # Kanban (uses @dnd-kit)
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── guests/
│   │   │   ├── GuestTable.tsx
│   │   │   ├── GuestForm.tsx
│   │   │   ├── GuestCard.tsx
│   │   │   └── EventTabs.tsx          # Groups guests by event
│   │   ├── inventory/
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── InventoryForm.tsx
│   │   │   └── BulkUpload.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ArrivalTimeline.tsx
│   │   │   ├── GuestByAccommodation.tsx
│   │   │   └── TaskCompletionRate.tsx
│   │   └── shared/
│   │       ├── DataTable.tsx          # Reusable sortable/filterable table
│   │       ├── SearchBar.tsx
│   │       ├── FileUpload.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── EmergencySOSButton.tsx
│   │       └── Toast.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # Reads auth context, provides user + role
│   │   ├── useGuests.ts               # TanStack Query hooks for /api/guests
│   │   ├── useInventory.ts
│   │   ├── useTasks.ts
│   │   └── useUsers.ts
│   │
│   ├── lib/
│   │   ├── api.ts                     # Axios instance with interceptors
│   │   ├── auth.ts                    # Token storage helpers
│   │   └── utils.ts                   # cn(), formatDate(), etc.
│   │
│   ├── store/
│   │   └── authStore.ts               # Zustand: { user, role, setUser, logout }
│   │
│   ├── constants/
│   │   ├── homeContent.ts             # All home page static text
│   │   ├── roles.ts                   # Role slugs + display names
│   │   └── enums.ts                   # Accommodation types, food prefs, etc.
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── guest.ts
│   │   ├── inventory.ts
│   │   ├── task.ts
│   │   └── api.ts                     # ApiResponse<T> wrapper type
│   │
│   ├── middleware.ts                  # Next.js route protection (checks cookie)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                           # Express.js API
│   ├── src/
│   │   ├── app.ts                     # Express app setup (middleware, routes)
│   │   ├── server.ts                  # HTTP server entry point
│   │   │
│   │   ├── config/
│   │   │   ├── db.ts                  # Mongoose connect()
│   │   │   ├── jwt.ts                 # sign / verify helpers
│   │   │   ├── mailer.ts              # Nodemailer transporter
│   │   │   └── env.ts                 # Validated env vars (via zod)
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Event.ts
│   │   │   ├── Guest.ts
│   │   │   ├── Task.ts
│   │   │   ├── Inventory.ts
│   │   │   ├── Document.ts
│   │   │   ├── Log.ts
│   │   │   ├── Token.ts
│   │   │   └── Notification.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts         # /api/auth/*
│   │   │   ├── user.routes.ts         # /api/users/*
│   │   │   ├── event.routes.ts        # /api/events/*
│   │   │   ├── guest.routes.ts        # /api/guests/*
│   │   │   ├── task.routes.ts         # /api/tasks/*
│   │   │   ├── inventory.routes.ts    # /api/inventory/*
│   │   │   ├── document.routes.ts     # /api/documents/*
│   │   │   ├── log.routes.ts          # /api/logs/*
│   │   │   ├── analytics.routes.ts    # /api/analytics/*
│   │   │   ├── emergency.routes.ts    # /api/emergency/*
│   │   │   └── search.routes.ts       # /api/search
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── event.controller.ts
│   │   │   ├── guest.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── document.controller.ts
│   │   │   ├── log.controller.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── emergency.controller.ts
│   │   │   └── search.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.ts        # Verifies JWT, attaches req.user
│   │   │   ├── authorize.ts           # roleMiddleware(allowedRoles[])
│   │   │   ├── auditLog.ts            # Auto-logs mutations to Log collection
│   │   │   ├── upload.ts              # Multer config
│   │   │   ├── validate.ts            # express-validator wrapper
│   │   │   └── errorHandler.ts        # Global error handler
│   │   │
│   │   ├── services/
│   │   │   ├── email.service.ts       # sendEmail(), sendBroadcast()
│   │   │   ├── sms.service.ts         # sendSMS()
│   │   │   ├── qr.service.ts          # generateQR(), validateQRToken()
│   │   │   └── analytics.service.ts   # Aggregation pipeline helpers
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validators.ts
│   │   │   ├── guest.validators.ts
│   │   │   ├── task.validators.ts
│   │   │   └── inventory.validators.ts
│   │   │
│   │   └── utils/
│   │       ├── asyncHandler.ts        # Wraps async controllers; catches errors
│   │       ├── ApiError.ts            # Custom error class
│   │       ├── ApiResponse.ts         # Standard response wrapper
│   │       └── paginate.ts            # Mongoose pagination helper
│   │
│   ├── uploads/                       # Local file storage (gitignored)
│   ├── seed.js                        # Dev seed script
│   ├── package.json
│   └── tsconfig.json
│
├── .env                               # Root env (copy to frontend/.env.local & backend/.env)
├── .gitignore
└── README.md
```

---

## API Route Reference

All routes prefixed with `/api`. Auth required on all except `/api/auth/login`, `/api/auth/refresh`, `/api/guests/checkin/:token`.

### Auth
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/auth/login` | public | Login, returns JWT |
| POST | `/auth/refresh` | public | Refresh access token |
| DELETE | `/auth/logout` | any | Clear session |
| POST | `/auth/forgot-password` | public | Send reset email |
| POST | `/auth/reset-password` | public | Reset with token |

### Users
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/users` | owner, admin | List users with filters |
| POST | `/users` | owner | Create user |
| GET | `/users/:id` | owner, admin | Get user detail |
| PATCH | `/users/:id` | owner | Update user |
| DELETE | `/users/:id` | owner | Deactivate user |
| GET | `/users/me` | any | Get own profile |

### Events
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/events` | owner, admin, event_head, event_poc | List events |
| POST | `/events` | owner | Create event |
| GET | `/events/:id` | owner, admin, event_head, event_poc | Get event |
| PATCH | `/events/:id` | owner, admin | Update event |

### Guests
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/guests` | owner, admin (all); event_head, event_poc (scoped) | List guests |
| POST | `/guests` | owner, admin, event_head, event_poc | Create guest |
| GET | `/guests/:id` | owner, admin, event_head, event_poc, guest (own) | Get guest |
| PATCH | `/guests/:id` | owner, admin, event_head (scoped), event_poc (scoped) | Update guest |
| DELETE | `/guests/:id` | owner, admin | Soft delete |
| POST | `/guests/:id/qr` | owner, admin | Generate QR code |
| GET | `/guests/checkin/:token` | public | QR check-in |

### Tasks
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/tasks` | owner, admin (all); others (own) | List tasks |
| POST | `/tasks` | owner, admin | Create task |
| GET | `/tasks/:id` | owner, admin, assignee | Get task |
| PATCH | `/tasks/:id` | owner, admin (any field); assignee (status only) | Update task |
| DELETE | `/tasks/:id` | owner, admin | Delete task |

### Inventory
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/inventory` | owner, inventory | List items |
| POST | `/inventory` | owner, inventory | Create item |
| GET | `/inventory/:id` | owner, inventory | Get item |
| PATCH | `/inventory/:id` | owner, inventory | Update item |
| DELETE | `/inventory/:id` | owner | Soft delete |
| POST | `/inventory/bulk` | owner, inventory | Bulk Excel upload |

### Documents
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/documents` | owner, admin, event_head, event_poc | List docs |
| POST | `/documents` | owner, admin | Upload doc |
| DELETE | `/documents/:id` | owner | Soft delete |

### Analytics
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/analytics/summary` | owner, admin | Dashboard KPIs |

### Emergency
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | `/emergency/broadcast` | owner | Send broadcast |

### Search
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/search?q=&type=` | owner, admin | Cross-entity search |

### Logs
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/logs` | owner | Audit log |

---

## Standard API Response Format

```ts
// Success
{
  "success": true,
  "data": <T>,
  "message": "Optional message",
  "pagination": {           // Only on list endpoints
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",    // Machine-readable
    "message": "You do not have permission to perform this action."
  }
}
```

---

## Frontend Route Protection

`middleware.ts` (Next.js) intercepts all routes:

```ts
// Route → required roles
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard':        ['owner', 'admin'],
  '/team':             ['owner', 'admin', 'event_head', 'event_poc', 'inventory'],
  '/team/tasks':       ['owner', 'admin', 'event_head', 'event_poc'],
  '/guests':           ['owner', 'admin', 'event_head', 'event_poc'],
  '/inventory':        ['owner', 'inventory'],
  '/admin/users':      ['owner'],
  '/admin/logs':       ['owner'],
  '/guest-portal':     ['guest'],
};
// Unmatched authenticated routes → 403 page
// Unauthenticated → redirect /login
```

---

## Key Design Patterns

### 1. asyncHandler wrapper
All Express controllers wrapped to avoid try/catch boilerplate:
```ts
export const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

### 2. Audit log middleware
Attach to every mutating route after the controller runs:
```ts
// middleware/auditLog.ts
// Reads req.user, req.method, req.originalUrl, res.locals.entityId
// Writes to Log collection automatically
```

### 3. Event-scoped authorization
```ts
// In guest controller, after fetching guest:
if (!['owner','admin'].includes(req.user.role)) {
  if (guest.eventId.toString() !== req.user.assignedEvent?.toString()) {
    throw new ApiError(403, 'Access restricted to your assigned event');
  }
}
```

### 4. Soft deletes
All destructive operations set `deletedAt: new Date()`.  
All list queries include `{ deletedAt: null }` filter automatically via Mongoose pre-find hook:
```ts
GuestSchema.pre(/^find/, function(next) {
  this.where({ deletedAt: null });
  next();
});
```

---

## Data Flow Diagrams

### Login Flow
```
User → POST /api/auth/login
  → validate credentials
  → compare bcrypt hash
  → issue accessToken (JWT, 15m) + refreshToken (JWT, 7d)
  → store refreshToken in DB (tokens collection)
  → set refreshToken in httpOnly cookie
  → return accessToken in response body
Frontend stores accessToken in memory (Zustand)
On 401 → POST /api/auth/refresh → new accessToken
```

### Guest Creation Flow
```
Event Head fills form → POST /api/guests
  → authenticate middleware (verify JWT)
  → authorize middleware (role: event_head, event_poc, admin, owner)
  → validate body (express-validator)
  → eventScope check (if not owner/admin, verify assignedEvent matches)
  → create Guest document
  → auditLog middleware writes Log entry
  → email notification to Hospitality POC of that event
  → return created guest
```

### Emergency Broadcast Flow
```
Owner clicks SOS → POST /api/emergency/broadcast { message, channels }
  → authenticate + authorize (owner only)
  → fetch all event_head + event_poc users from DB
  → for each user:
      → email.service.sendEmail(user.email, message)
      → sms.service.sendSMS(user.phone, message) [if channels includes sms]
      → create Notification record
  → write single Log entry (action: BROADCAST)
  → return delivery summary
```

---

## Deployment Setup

### Development
```bash
# Start MongoDB locally
mongod --dbpath ./data/db

# Backend
cd backend && npm install && npm run dev   # nodemon, port 5000

# Frontend
cd frontend && npm install && npm run dev  # Next.js, port 3000
```

### Production

**Frontend → Vercel**
- Connect GitHub repo, set root to `frontend/`
- Env vars: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

**Backend → Railway**
- Connect GitHub repo, set root to `backend/`
- Add all env vars from `.env`
- Auto-deploy on push to `main`

**Database → MongoDB Atlas**
- Free M0 cluster (512 MB) sufficient for event scale
- Whitelist Railway IP or use `0.0.0.0/0` for dev

**Files → Cloudinary or AWS S3** (swap `STORAGE=s3` in env)

---

## Security Checklist

- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] JWT secrets stored in env, never hardcoded
- [x] Refresh tokens in httpOnly, Secure, SameSite=Strict cookie
- [x] Rate limiting on `/api/auth/*` (express-rate-limit: 10 req/15min)
- [x] Helmet.js for HTTP security headers
- [x] CORS restricted to `FRONTEND_URL` env var
- [x] Input validation on all POST/PATCH routes
- [x] Soft deletes (no hard data loss)
- [x] File type + size validation on all uploads
- [x] Audit logs for all mutations
- [x] Account lockout after 5 failed logins

---

## Getting Started (Copilot Instructions)

When using GitHub Copilot to scaffold this project, feed files in this order:

1. `DB_SCHEMA.md` → generate all Mongoose models in `backend/src/models/`
2. `ARCHITECTURE.md` (API Route Reference section) → generate route + controller stubs
3. `FUNCTIONALITY.md` → fill in controller logic section by section
4. `ARCHITECTURE.md` (Folder Structure) → generate remaining component and hook files
5. `FUNCTIONALITY.md` (Environment Variables) → generate `.env.example`

**Suggested first Copilot prompt:**
> "Based on DB_SCHEMA.md, create all Mongoose models with TypeScript interfaces in `backend/src/models/`. Use timestamps: true on all schemas and add the indexes specified in the schema file."

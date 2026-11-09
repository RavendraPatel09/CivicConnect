# CivicConnect AI — API Integration & Architecture Plan

## 1. Executive Summary

CivicConnect AI is a smart-city civic grievance management platform connecting citizens, municipal staff, and city administrators. This document defines the interface contracts between the existing React/TypeScript frontend and the FastAPI + PostgreSQL + pgvector backend, ensuring zero disruption to existing UI components while establishing full-stack data persistence, authentication, AI triage, and real-time WebSocket communication.

---

## 2. Existing Frontend Architecture Review

### 2.1 Technology Stack & Structure
* **Core Framework**: React 18, TypeScript, Vite 5, Tailwind CSS
* **Routing**: React Router v6 with lazy-loaded route chunks
* **State & Query Management**: TanStack React Query v5 + Context API (`AuthContext`, `ThemeContext`, `NotificationContext`)
* **Form Handling & Validation**: React Hook Form with Zod schemas ([`frontend/src/schemas/index.ts`](../frontend/src/schemas/index.ts))
* **Visualizations & Maps**: Recharts (Monthly Trends, Category Bar Charts, Severity Donut) and Leaflet with custom SVG markers
* **HTTP Client**: Axios instance in [`src/services/api/client.ts`](file:///Users/ravendrapatel/Documents/CivicConnect/src/services/api/client.ts) configured with `VITE_API_BASE_URL` and Bearer token interceptor

### 2.2 Existing User Personas & Roles
1. **Citizen** (`role: "citizen"`):
   - Access to `/citizen`, `/citizen/complaints`, `/report`, `/citizen/nearby`, `/citizen/map`, `/citizen/notifications`, `/citizen/profile`, `/citizen/settings`
   - Actions: Submit complaints with photos & geolocations, track timeline progress, upvote community issues.
2. **Municipal Staff** (`role: "staff"`):
   - Access to `/admin/queue`, `/tickets/:id`, `/citizen/notifications`
   - Actions: Review assigned tickets, update status (Acknowledged → In Progress → Resolved), dispatch work orders.
3. **Administrator** (`role: "admin"`):
   - Access to `/admin`, `/admin/queue`, `/admin/triage`, `/admin/staff`, `/admin/map`, `/admin/analytics`, `/admin/audit-logs`, `/admin/settings`
   - Actions: Full administrative oversight, AI triage overrides, staff assignments, SLA auditing.

---

## 3. Database Entity Relationship Model

```
+--------------------+       1:N       +----------------------------+
|       USERS        |----------------<|          TICKETS           |
+--------------------+                 +----------------------------+
| id: UUID (PK)      |                 | id: VARCHAR (PK, e.g. CC-..)
| name: VARCHAR      |                 | user_id: UUID (FK -> users)|
| email: VARCHAR (UQ)|                 | title: VARCHAR             |
| password_hash: TEXT|                 | description: TEXT          |
| role: user_role    |                 | category: complaint_cat    |
| department_id: UUID|                 | severity: complaint_sev    |
| is_active: BOOLEAN |                 | priority_score: INT (0-100)|
| profile_image: TEXT|                 | status: complaint_status   |
| created_at: TIMESTP|                 | latitude: FLOAT            |
+--------------------+                 | longitude: FLOAT           |
          |                            | address: TEXT              |
          | 1:N                        | landmark: VARCHAR          |
          v                            | images: JSONB / TEXT[]     |
+--------------------+                 | ai_summary: TEXT           |
|   REFRESH_TOKENS   |                 | ai_response: TEXT          |
+--------------------+                 | department_id: UUID (FK)   |
| id: UUID (PK)      |                 | assigned_staff_id: UUID(FK)|
| user_id: UUID (FK) |                 | duplicate_of_id: VARCHAR   |
| token_hash: VARCHAR|                 | upvotes_count: INT DEFAULT 0
| expires_at: TIMESTP|                 | created_at / updated_at    |
| revoked_at: TIMESTP|                 | resolved_at: TIMESTP NULL  |
+--------------------+                 +----------------------------+
                                                    |
          +-----------------------------------------+-----------------------------------------+
          | 1:N                                     | 1:N                                     | 1:N
          v                                         v                                         v
+--------------------+                    +--------------------+                    +--------------------+
|   TICKET_EVENTS    |                    |      UPVOTES       |                    | TICKET_EMBEDDINGS  |
+--------------------+                    +--------------------+                    +--------------------+
| id: UUID (PK)      |                    | id: UUID (PK)      |                    | id: UUID (PK)      |
| ticket_id: VARCHAR |                    | ticket_id: VARCHAR |                    | ticket_id: VARCHAR |
| actor_id: UUID     |                    | user_id: UUID      |                    | embedding: VECTOR  |
| actor_type: VARCHAR|                    | created_at: TIMESTP|                    | model_name: VARCHAR|
| event_type: VARCHAR|                    +--------------------+                    | created_at: TIMESTP|
| prev_status / new  |                    UQ: (ticket_id,user)                      +--------------------+
| note: TEXT         |
| created_at: TIMESTP|
+--------------------+

+--------------------+                    +--------------------+                    +--------------------+
|   NOTIFICATIONS    |                    |    DEPARTMENTS     |                    |     DOCUMENTS      |
+--------------------+                    +--------------------+                    +--------------------+
| id: UUID (PK)      |                    | id: UUID (PK)      |                    | id: UUID (PK)      |
| user_id: UUID (FK) |                    | name: VARCHAR (UQ) |                    | title: VARCHAR     |
| ticket_id: VARCHAR |                    | description: TEXT  |                    | content: TEXT      |
| title: VARCHAR     |                    | created_at: TIMESTP|                    | document_type: STR |
| message: TEXT      |                    +--------------------+                    | embedding: VECTOR  |
| type: notif_type   |                                                              | source: VARCHAR    |
| is_read: BOOLEAN   |                                                              | created_at: TIMESTP|
| created_at: TIMESTP|                                                              +--------------------+
+--------------------+
```

---

## 4. API Endpoints Specification & Frontend Mapping

### 4.1 Authentication Endpoints (`/api/v1/auth`)

| Endpoint | Method | Role | Request Body | Response Body | Frontend Mapping |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | Public | `{ name, email, password, role, department? }` | `{ user: UserResponse, tokens: TokenPair }` | Replaces `authApi.register()` |
| `/api/v1/auth/login` | `POST` | Public | `{ username (email), password }` | `{ user: UserResponse, tokens: TokenPair }` | Replaces `authApi.login()` |
| `/api/v1/auth/refresh` | `POST` | Public | `{ refresh_token }` | `{ access_token, refresh_token }` | Axios Interceptor refresh flow |
| `/api/v1/auth/logout` | `POST` | Auth | `{ refresh_token? }` | `{ message: "Logged out successfully" }` | Replaces `authApi.logout()` |
| `/api/v1/auth/me` | `GET` | Auth | Headers: `Bearer <token>` | `UserResponse` | Used on App initialization |
| `/api/v1/auth/forgot-password`| `POST` | Public | `{ email }` | `{ message: "Reset email dispatched" }` | Forgot Password UI |
| `/api/v1/auth/reset-password` | `POST` | Public | `{ token, new_password }` | `{ message: "Password updated" }` | Reset Password UI |

### 4.2 Complaints Management Endpoints (`/api/v1/tickets`)

| Endpoint | Method | Role | Request / Params | Response Body | Frontend Mapping |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `/api/v1/tickets` | `GET` | Public/Auth | `?search=&category=&status=&severity=&sort_by=&page=&limit=` | `PaginatedTicketsResponse` | `ticketsApi.getTickets()` |
| `/api/v1/tickets` | `POST` | Citizen | `{ title, description, category, severity, address, landmark?, lat, lng, images[] }` | `TicketResponse` | `ticketsApi.createTicket()` |
| `/api/v1/tickets/{id}` | `GET` | Public/Auth | Path: `id` | `TicketDetailResponse` (with timeline & AI triage) | `ticketsApi.getTicketById()` |
| `/api/v1/tickets/my` | `GET` | Citizen | `?status=&page=` | `TicketResponse[]` | Used in My Complaints |
| `/api/v1/tickets/nearby` | `GET` | Public/Auth | `?lat=&lng=&radius_km=` | `NearbyTicketResponse[]` (with distanceKm) | `NearbyIssuesPage.tsx` |
| `/api/v1/tickets/{id}/status` | `PATCH`| Staff/Admin | `{ status: ComplaintStatus, notes?: string }` | `TicketResponse` | Staff status modal |
| `/api/v1/tickets/{id}/triage-override` | `POST` | Admin | `{ category, severity, assigned_department, priority_score, override_notes }` | `TicketResponse` | AI Triage Workbench |
| `/api/v1/tickets/{id}/upvote` | `POST` | Auth | Path: `id` | `{ upvotes: number, is_upvoted: boolean }` | Upvote buttons |
| `/api/v1/tickets/{id}/upvote` | `DELETE`| Auth | Path: `id` | `{ upvotes: number, is_upvoted: boolean }` | Upvote removal |

### 4.3 Analytics Endpoints (`/api/v1/analytics`)

| Endpoint | Method | Role | Params | Response Body | Frontend Mapping |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `/api/v1/analytics/summary` | `GET` | Staff/Admin | `?start_date=&end_date=` | `AnalyticsSummary` | `analyticsApi.getSummary()` |
| `/api/v1/analytics/monthly-trends` | `GET` | Staff/Admin | `?months=6` | `MonthlyTrend[]` | Area chart in overview |
| `/api/v1/analytics/departments` | `GET` | Staff/Admin | - | `DepartmentPerformance[]` | Table in overview |

### 4.4 Notifications Endpoints (`/api/v1/notifications`)

| Endpoint | Method | Role | Params | Response Body | Frontend Mapping |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `/api/v1/notifications` | `GET` | Auth | `?unread_only=` | `NotificationItem[]` | `notificationsApi.getNotifications()` |
| `/api/v1/notifications/{id}/read` | `PATCH`| Auth | Path: `id` | `{ success: true }` | `notificationsApi.markAsRead()` |
| `/api/v1/notifications/read-all` | `POST` | Auth | - | `{ updated_count: number }` | `notificationsApi.markAllAsRead()` |

### 4.5 Document & RAG Management Endpoints (`/api/v1/documents`)

| Endpoint | Method | Role | Request Body | Response Body |
| :--- | :---: | :---: | :--- | :--- |
| `/api/v1/documents` | `GET` | Admin | `?type=` | `MunicipalDocument[]` |
| `/api/v1/documents` | `POST` | Admin | `{ title, content, document_type, source }` | `MunicipalDocument` |
| `/api/v1/documents/query` | `POST` | Staff/Admin | `{ query, top_k }` | `{ results: ChunkResult[], synthesis: string }` |

---

## 5. WebSocket Protocol & Event Schema

### 5.1 Endpoint: `/ws/tickets/{ticket_id}?token=<jwt_access_token>`
* **Handshake Authentication**: The access token is verified upon connection; user permissions against the ticket are evaluated.
* **Subscription Model**: Clients subscribe to updates for a ticket room (or `/ws/notifications` for user personal channel).

### 5.2 Outgoing Server Events

#### `ticket.status_updated`
```json
{
  "event": "ticket.status_updated",
  "ticket_id": "CC-2025-0841",
  "status": "in_progress",
  "previous_status": "acknowledged",
  "actor": {
    "name": "Marcus Vance",
    "role": "Municipal Staff"
  },
  "note": "Crew dispatched to Market Street.",
  "timestamp": "2025-02-19T10:15:00Z"
}
```

#### `ticket.triaged`
```json
{
  "event": "ticket.triaged",
  "ticket_id": "CC-2025-0841",
  "priority_score": 88,
  "severity": "high",
  "suggested_department": "Department of Transportation & Roads",
  "summary": "High-risk road surface degradation...",
  "timestamp": "2025-02-19T10:16:00Z"
}
```

#### `notification.created`
```json
{
  "event": "notification.created",
  "notification": {
    "id": "notif-uuid",
    "title": "Work Crew Dispatched",
    "message": "Field Inspector Marcus Vance assigned to CC-2025-0841.",
    "type": "staff_assigned",
    "ticket_id": "CC-2025-0841",
    "created_at": "2025-02-19T10:15:00Z"
  }
}
```

---

## 6. Mock Service Replacement Strategy

1. **Keep Component Signatures Identical**: Frontend UI components call `authApi`, `ticketsApi`, `analyticsApi`, and `notificationsApi`. The methods and return types will remain strictly matched.
2. **Transparent Adaptation**: The API services (`frontend/src/services/api/*.ts`) will call real backend REST endpoints when `VITE_API_BASE_URL` is configured or fallback gracefully when in demo mode.
3. **Data Normalization Layer**: Backend snake_case JSON fields (e.g. `priority_score`, `assigned_staff_name`) will be mapped transparently to the camelCase models (`priorityScore`, `assignedStaffName`) expected by React components.
4. **WebSocket Service**: Introduce `frontend/src/services/websocket/socketService.ts` to attach to existing tickets and invalidate TanStack Query cache automatically.

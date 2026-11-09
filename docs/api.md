# SCIP — REST API Specification

All endpoints are mounted under `/api/*` and use JSON request/response formats. Authenticated endpoints require a standard `Authorization: Bearer <token>` header with a cryptographically signed JWT.

---

## 1. Authentication (`/api/auth`)

- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `role`, `phone`).
- `POST /api/auth/login` — Sign in with credentials and receive a JWT session token.
- `POST /api/auth/demo-login` — Evaluator role switcher (`role: citizen | officer | authority | admin`).
- `GET /api/auth/me` — Return the currently authenticated user session.
- `POST /api/auth/change-password` — Change password (`oldPassword`, `newPassword`).
- `PUT /api/auth/profile` — Update user profile details (`name`, `phone`).
- `POST /api/auth/logout` — Invalidate user session and emit audit log.

---

## 2. Community Reports (`/api/reports`)

- `GET /api/reports` — List observations with optional filters (`category`, `status`, `urgency`, `myOnly`).
- `POST /api/reports` — Submit observation with automated real-time NLP classification and similarity analysis.
- `GET /api/reports/:id` — Retrieve full report details with stored AI findings and similarity matches.
- `PUT /api/reports/:id` — Update report description or category (citizens can update before review).
- `DELETE /api/reports/:id` — Withdraw citizen report (soft delete / status set to `closed`).
- `POST /api/reports/:id/reanalyze` — Re-execute TF-IDF vector pipeline on demand.

---

## 3. Incident Lifecycle (`/api/incidents`)

- `GET /api/incidents` — List municipal incidents (`status`, `category`, `priority`).
- `GET /api/incidents/:id` — Retrieve incident dossier and all linked citizen ground observations.
- `POST /api/incidents/from-cluster` — Transform DBSCAN cluster hypothesis into a potential incident.
- `POST /api/incidents/:id/review` — **Human-in-the-Loop Gateway:** Officer confirmation or dismissal with accountable notes.
- `POST /api/incidents/:id/resolve` — Submit field remediation notes, actions taken, and cost estimate.

---

## 4. Intelligence & Decision Support (`/api/intelligence`)

- `POST /api/intelligence/agent` — Execute multi-tool intelligence agent with natural language queries.
- `GET /api/intelligence/clusters` — Spatio-temporal DBSCAN cluster detection ($Eps = 550\text{m}$, $T = 48\text{h}$).
- `GET /api/intelligence/hotspots` — Geospatial density binning and recurrent hotspot identification.
- `GET /api/intelligence/trends` — Longitudinal incident volumes, category shifts, and municipal resolution velocity.

---

## 5. Governance & System (`/api/admin`, `/api/health`, `/api/tests`)

- `GET /api/admin/users` — List platform users and role designations.
- `PUT /api/admin/users/:id/role` — Update user role (Admin only).
- `PUT /api/admin/users/:id/status` — Suspend or reactivate user accounts.
- `GET /api/admin/departments` — List departments and active work orders.
- `GET /api/admin/audit-logs` — Query immutable audit trail by module, user, and action.
- `GET /api/admin/system-stats` — Server uptime, memory, and database diagnostics.
- `GET /api/health` — API health and service status check.
- `POST /api/tests/run` — Run automated technical audit suite.

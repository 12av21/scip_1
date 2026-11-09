# SCIP — Persistence Architecture & Data Integrity Specification

> **Smart Community Intelligence Platform (SCIP)**  
> Technical blueprint for data survivability, indexing, and MongoDB ODM integration.

---

## 1. Dual-Mode Storage Topology

SCIP implements an enterprise dual-mode persistence architecture:

```
                          [ Client Mutation Request ]
                                      │
                                      ▼
                         [ Express Route Controller ]
                                      │
                                      ▼
                         [ SCIPDatabase Engine ]
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Atomic Disk File Engine ]             [ Mongoose ODM Layer ]
        - Path: `.scip_database.json`           - Models: User, Report,
        - In-Memory Maps + Serializer                     Incident, AuditLog...
        - Survives Node process restarts        - Indexes: Geospatial,
        - Zero external daemon required                   Compound, Unique
        - Immediate Consistency                 - Activated via MONGODB_URI
```

### Mode 1: Atomic File-Backed Engine (Active by default)
- High-performance, zero-latency state stored in memory and immediately persisted to `.scip_database.json`.
- State survives application restarts, node crashes, and development server reloads.
- Automatically initializes with realistic municipal seed data if `.scip_database.json` is missing.
- Zero external database installation required for standard development and preview containers.

### Mode 2: Mongoose & MongoDB Enterprise Cluster
- Activated automatically when `MONGODB_URI` is supplied in environment variables.
- Models defined in `src/database/models/`:
  - `User.ts` (Unique email, indexed role & status)
  - `Report.ts` (Compound 2dsphere index on `[latitude, longitude]`, index on `citizenId`, `status`, `createdAt`)
  - `Incident.ts` (Index on `status`, `priority`, `assignedDepartmentId`, `humanReviewed`)
  - `AuxiliaryModels.ts` (`AuditLog`, `Department`, `Notification`, `Feedback`)
- Connection lifecycle handled via `src/database/mongoConnection.ts` with `bufferCommands: false` to ensure non-blocking, resilient failover.

---

## 2. Referential Integrity & Invariant Rules

1. **Immutable Audit Trails:** Audit events (`AuditLog`) are append-only and cannot be updated or deleted through standard API endpoints.
2. **Human-in-the-Loop Gateway:** No incident marked `isAIGenerated: true` can transition to `in_progress` or dispatch a work order until `humanReviewed: true` is verified and recorded with the reviewing officer's credentials.
3. **Report-to-Incident Linkage:** When an incident is confirmed, linked reports automatically transition to `under_review`. When the incident is marked `resolved`, all linked reports transition to `resolved` and citizens receive automated notifications.
4. **Citizen Withdrawal:** Citizens can withdraw reports only while status is `submitted` or `analyzed`.

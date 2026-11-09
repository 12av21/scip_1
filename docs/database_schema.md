# SCIP — Database Schema & Data Models

> **Smart Community Intelligence Platform (SCIP)**  
> Entity Relationship Specifications & Indexing Strategy

---

## 1. Relational Entity Overview

| Collection / Entity | Key Attributes | Indexes & Uniqueness |
|---|---|---|
| `users` | `id`, `name`, `email`, `passwordHash`, `role`, `departmentId`, `phone`, `status`, `createdAt`, `updatedAt` | Unique `email`, index `role` |
| `departments` | `id`, `code`, `name`, `description`, `headName`, `email`, `phone`, `activeIncidentsCount` | Unique `code`, index `name` |
| `reports` | `id`, `title`, `description`, `category`, `subcategory`, `locationName`, `latitude`, `longitude`, `citizenId`, `status`, `urgency`, `incidentId`, `images`, `createdAt`, `updatedAt` | Indexes on `citizenId`, `status`, `category`, `createdAt`, geo-coordinates |
| `ai_analyses` | `reportId`, `categoryPredicted`, `categoryConfidence`, `keywords`, `entities`, `sentiment`, `riskScore`, `severityIndicator`, `topSimilarReports`, `possibleIncident`, `analyzedAt` | Unique `reportId`, index `riskScore` |
| `incidents` | `id`, `title`, `category`, `description`, `locationName`, `latitude`, `longitude`, `radiusMeters`, `reportIds`, `severity`, `priority`, `confidence`, `status`, `isAIGenerated`, `humanReviewed`, `reviewedBy`, `assignedDepartmentId`, `assignedOfficerId`, `resolutionNotes`, `createdAt`, `updatedAt` | Indexes on `status`, `priority`, `category`, `assignedDepartmentId` |
| `assignments` | `id`, `incidentId`, `departmentId`, `officerId`, `status`, `notes`, `assignedAt` | Indexes on `incidentId`, `officerId` |
| `resolutions` | `id`, `incidentId`, `officerId`, `actionTaken`, `preventiveMeasures`, `costEstimate`, `resolvedAt` | Unique `incidentId` |
| `notifications` | `id`, `userId`, `title`, `message`, `link`, `read`, `type`, `createdAt` | Index on `(userId, read)` |
| `feedback` | `id`, `reportId`, `incidentId`, `userId`, `userName`, `rating`, `comments`, `createdAt` | Indexes on `reportId`, `userId` |
| `audit_logs` | `id`, `timestamp`, `action`, `module`, `userId`, `userEmail`, `userRole`, `ipAddress`, `details` | Indexes on `timestamp`, `userId`, `module`, `action` |

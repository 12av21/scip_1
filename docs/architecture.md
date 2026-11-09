# SCIP — System Architecture & Technical Specification

> **Smart Community Intelligence Platform (SCIP)**  
> *Transforming citizen ground observations into structured municipal intelligence with Responsible AI governance.*

---

## 1. High-Level Architectural Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  React 19 SPA · Vite 8 · Tailwind CSS v4 · Leaflet Geospatial GIS      │
│  Citizen Dashboard · Incident Queue · Multi-Tool Agent · Admin Panel   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST APIs (Bearer JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS APPLICATION CORE                        │
│  Security Headers · Rate Limiter · RBAC Middleware · Request Validator │
├─────────────────┬───────────────────┬─────────────────┬────────────────┤
│  /api/auth      │  /api/reports     │  /api/incidents │  /api/intel    │
└────────┬────────┴─────────┬─────────┴────────┬────────┴────────┬───────┘
         │                  │                  │                 │
         ▼                  ▼                  ▼                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SCIP INTELLIGENCE ENGINE                         │
│  - Stage 1: NLP Normalization, Stopwords Pruning & Porter Stemming     │
│  - Stage 2: Supervised TF-IDF Vectorizer (L2 Normalized Feature Space) │
│  - Stage 3: Cosine Similarity & Lexical Overlap Matrix                 │
│  - Stage 4: Great-Circle Haversine Geospatial Metric (Distance in m)   │
│  - Stage 5: Spatio-Temporal DBSCAN Clustering (550m / 48h Window)      │
│  - Stage 6: Multi-Factor Explainable Risk Scoring (P1-P4 Hierarchy)    │
│  - Stage 7: Responsible AI Gatekeeper (Hypothesis vs Confirmation)     │
│  - Stage 8: 10-Tool SCIP Intelligence Decision Support Agent           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     DUAL PERSISTENCE & DATA LAYER                      │
│  - Primary: Atomic Disk Storage (`.scip_database.json`)                │
│  - Enterprise: Mongoose ODM & MongoDB Models with Indexes & Hooks      │
│  - Immutable Audit Logging for Security and Governance Events          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Responsible AI Separation Charter

1. **A Community Report is an Observation:**  
   Raw ground signal reported by citizens (e.g. *"Water accumulation near market entrance"*).
2. **An AI Incident is an Analytical Interpretation:**  
   Machine learning algorithms correlate proximate observations and hypothesize potential underlying infrastructure failures (e.g. *"Potential Incident: Concentrated Drainage Failure at Sector 4"*).
3. **An AI Recommendation is NOT an Administrative Decision:**  
   Municipal authority officers must review evidence, corroborate physical ground reality, and formally confirm or dismiss incidents before municipal work orders are executed.

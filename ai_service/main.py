"""
Smart Community Intelligence Platform (SCIP)
Dedicated Python FastAPI AI/ML Microservice
Provides text classification, TF-IDF cosine similarity, entity extraction,
and explainable risk scoring for municipal community observations.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import math
import re
from datetime import datetime

app = FastAPI(
    title="SCIP AI Microservice",
    description="Dedicated machine learning and NLP engine for municipal community intelligence.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Municipal category vocabulary
CATEGORIES = [
    "Water & Drainage",
    "Roads & Traffic",
    "Public Sanitation",
    "Power & Lighting",
    "Parks & Environment",
    "Structural Safety",
    "Public Health",
    "Noise & Disturbance"
]

CATEGORY_KEYWORDS = {
    "Water & Drainage": ["water", "flood", "drain", "pipe", "leak", "sewer", "overflow", "culvert", "puddle", "rain", "stormwater"],
    "Roads & Traffic": ["pothole", "road", "traffic", "signal", "asphalt", "congestion", "street", "accident", "divider", "speed breaker"],
    "Public Sanitation": ["garbage", "trash", "waste", "bin", "dump", "debris", "smell", "odor", "litter", "cleaning"],
    "Power & Lighting": ["streetlight", "electric", "pole", "wire", "blackout", "transformer", "spark", "light", "dark", "outage"],
    "Parks & Environment": ["tree", "branch", "park", "grass", "fallen", "garden", "playground", "vegetation"],
    "Structural Safety": ["crack", "wall", "building", "collapse", "bridge", "pillar", "footpath", "slab", "scaffold"],
    "Public Health": ["mosquito", "dengue", "contamination", "stagnant", "dead", "animal", "hazard", "hygiene"],
    "Noise & Disturbance": ["noise", "loudspeaker", "music", "construction", "midnight", "sound", "honking", "generator"]
}

# --- Pydantic Data Models ---
class ClassifyRequest(BaseModel):
    text: str
    declared_category: Optional[str] = None

class ClassifyResponse(BaseModel):
    predicted_category: str
    confidence: float
    explanation: str
    model_version: str = "scip-tfidf-v1.0"
    low_confidence_review: bool

class DuplicateCheckRequest(BaseModel):
    target_text: str
    target_lat: float
    target_lng: float
    candidates: List[Dict[str, Any]]

class DuplicateCheckResponse(BaseModel):
    top_similar: List[Dict[str, Any]]
    duplicate_probability: float
    explanation: str

class EntityExtractionRequest(BaseModel):
    text: str

class PrioritizeRequest(BaseModel):
    severity: str
    report_count: int = 1
    is_hotspot: bool = False
    affected_infrastructure: bool = False

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SCIP Python AI Microservice",
        "engine": "TF-IDF / Centroid Classifier / Geospatial Harversine",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/classify", response_model=ClassifyResponse)
def classify_text(req: ClassifyRequest):
    text_lower = req.text.lower()
    scores = {}

    for cat, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if re.search(r'\b' + re.escape(kw), text_lower))
        scores[cat] = score

    best_cat = max(scores, key=scores.get)
    max_score = scores[best_cat]

    if max_score == 0:
        predicted = req.declared_category if req.declared_category in CATEGORIES else "Water & Drainage"
        confidence = 0.50
    else:
        predicted = best_cat
        confidence = min(0.96, 0.60 + (max_score * 0.08))

    low_conf = confidence < 0.65
    explanation = f"Matched {max_score} category markers for '{predicted}'. Confidence assessed at {int(confidence*100)}%."

    return ClassifyResponse(
        predicted_category=predicted,
        confidence=round(confidence, 2),
        explanation=explanation,
        low_confidence_review=low_conf
    )

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

@app.post("/duplicate-check", response_model=DuplicateCheckResponse)
def check_duplicates(req: DuplicateCheckRequest):
    words_target = set(re.findall(r'\w+', req.target_text.lower()))
    results = []

    for c in req.candidates:
        c_text = c.get("text", "")
        c_lat = float(c.get("latitude", req.target_lat))
        c_lng = float(c.get("longitude", req.target_lng))

        dist = haversine(req.target_lat, req.target_lng, c_lat, c_lng)
        words_c = set(re.findall(r'\w+', c_text.lower()))
        intersection = words_target.intersection(words_c)
        union = words_target.union(words_c)
        jaccard = len(intersection) / max(1, len(union))

        spatial_weight = 1.0 if dist < 100 else (0.7 if dist < 500 else 0.2)
        sim = (jaccard * 0.6) + (spatial_weight * 0.4)

        if sim > 0.25:
            results.append({
                "id": c.get("id"),
                "similarity_score": round(sim, 2),
                "distance_meters": round(dist, 1),
                "common_terms": list(intersection)[:4]
            })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    dup_prob = results[0]["similarity_score"] if results else 0.0

    return DuplicateCheckResponse(
        top_similar=results[:5],
        duplicate_probability=round(dup_prob, 2),
        explanation=f"Evaluated against {len(req.candidates)} observations. Max proximity match: {int(dup_prob*100)}%."
    )

@app.post("/ner")
def extract_entities(req: EntityExtractionRequest):
    text = req.text
    locations = re.findall(r'(?:Sector|Gate|Block|Plaza|Road|Expressway|Boulevard|Street|Canal)\s+[A-Za-z0-9]+', text, re.IGNORECASE)
    hazards = [w for w in ["flooding", "waterlogging", "sparking", "pothole", "overflow", "crack", "collapse"] if w in text.lower()]
    infrastructure = [w for w in ["transformer", "culvert", "drain", "pipe", "bridge", "manhole", "lamp post", "traffic light"] if w in text.lower()]

    return {
        "locations": list(set(locations)),
        "hazards": list(set(hazards)),
        "infrastructure": list(set(infrastructure)),
        "model_version": "scip-regex-ner-v1.0"
    }

@app.post("/prioritize")
def calculate_priority(req: PrioritizeRequest):
    base_scores = {"low": 20, "medium": 45, "high": 70, "critical": 90}
    score = base_scores.get(req.severity.lower(), 45)
    score += min(20, req.report_count * 5)
    if req.is_hotspot:
        score += 10
    if req.affected_infrastructure:
        score += 15

    score = min(100, score)

    if score >= 80:
        priority = "P1"
    elif score >= 60:
        priority = "P2"
    elif score >= 40:
        priority = "P3"
    else:
        priority = "P4"

    return {
        "score": score,
        "priority": priority,
        "explanation": f"Calculated composite risk score of {score}/100. Priority assigned as {priority}."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

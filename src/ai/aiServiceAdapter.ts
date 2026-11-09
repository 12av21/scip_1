// SCIP AI Adapter - Bridges Python FastAPI Service & Local TypeScript ML Engine
// Ensures seamless fallover to high-performance local algorithms when external service is offline

import { classifyReport } from './classifier.js';
import { findSimilarAndDuplicateReports } from './duplicateDetector.js';
import { extractEntities } from './classifier.js';
import { computeExplainableRisk } from './riskScorer.js';
import { Report, ReportCategory } from '../types/scip.js';

export interface AIClassificationResult {
  predictedCategory: ReportCategory;
  confidence: number;
  explanation: string;
  lowConfidenceReview: boolean;
  modelVersion: string;
}

export class AIServiceAdapter {
  private serviceUrl: string | undefined;

  constructor() {
    this.serviceUrl = process.env.AI_SERVICE_URL;
  }

  public async classify(text: string, declaredCategory?: ReportCategory): Promise<AIClassificationResult> {
    if (this.serviceUrl) {
      try {
        const res = await fetch(`${this.serviceUrl}/classify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, declared_category: declaredCategory })
        });
        if (res.ok) {
          const data = await res.json();
          return {
            predictedCategory: data.predicted_category,
            confidence: data.confidence,
            explanation: data.explanation,
            lowConfidenceReview: data.low_confidence_review,
            modelVersion: data.model_version
          };
        }
      } catch {
        // Fall back to local engine
      }
    }

    // Local deterministic engine
    const local = classifyReport(text, declaredCategory);
    return {
      predictedCategory: local.predictedCategory,
      confidence: local.confidence,
      explanation: `Locally classified by supervised centroid vectorizer with ${(local.confidence * 100).toFixed(0)}% confidence.`,
      lowConfidenceReview: local.confidence < 0.65,
      modelVersion: 'scip-local-ts-centroid-v1.0'
    };
  }

  public async checkDuplicates(target: Report, corpus: Report[]) {
    if (this.serviceUrl) {
      try {
        const candidates = corpus
          .filter(c => c.id !== target.id)
          .map(c => ({
            id: c.id,
            text: `${c.title} ${c.description}`,
            latitude: c.latitude,
            longitude: c.longitude
          }));

        const res = await fetch(`${this.serviceUrl}/duplicate-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target_text: `${target.title} ${target.description}`,
            target_lat: target.latitude,
            target_lng: target.longitude,
            candidates
          })
        });

        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Fall back to local engine
      }
    }

    return findSimilarAndDuplicateReports(target, corpus);
  }
}

export const aiAdapter = new AIServiceAdapter();

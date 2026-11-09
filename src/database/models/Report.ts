// Mongoose Schema for Report Entity
import mongoose, { Schema, Document } from 'mongoose';
import { ReportCategory, ReportStatus, UrgencyLevel } from '../../types/scip.js';

export interface IReportDocument extends Document {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  subcategory?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  status: ReportStatus;
  urgency: UrgencyLevel;
  incidentId?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

const ReportSchema = new Schema<IReportDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Water & Drainage',
        'Roads & Traffic',
        'Public Sanitation',
        'Power & Lighting',
        'Parks & Environment',
        'Structural Safety',
        'Public Health',
        'Noise & Disturbance'
      ],
      required: true,
      index: true
    },
    subcategory: { type: String },
    locationName: { type: String, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    citizenId: { type: String, required: true, index: true },
    citizenName: { type: String, required: true },
    citizenEmail: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'submitted',
        'processing',
        'analyzed',
        'linked',
        'under_review',
        'assigned',
        'resolved',
        'closed'
      ],
      default: 'submitted',
      index: true
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    incidentId: { type: String, index: true },
    images: [{ type: String }]
  },
  {
    timestamps: true
  }
);

ReportSchema.index({ latitude: 1, longitude: 1 });
ReportSchema.index({ createdAt: -1 });

export const ReportModel = mongoose.models.Report || mongoose.model<IReportDocument>('Report', ReportSchema);

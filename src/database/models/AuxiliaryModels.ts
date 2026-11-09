// Mongoose Schema for AuditLog, Department, Notification, and Feedback Entities
import mongoose, { Schema, Document } from 'mongoose';

// --- AuditLog ---
export interface IAuditLogDocument extends Document {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  recordId?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  ipAddress: string;
  details: string;
}

const AuditLogSchema = new Schema<IAuditLogDocument>({
  id: { type: String, required: true, unique: true, index: true },
  timestamp: { type: String, required: true, index: true },
  action: { type: String, required: true, index: true },
  module: { type: String, required: true, index: true },
  recordId: { type: String },
  userId: { type: String, index: true },
  userEmail: { type: String },
  userRole: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' },
  details: { type: String, required: true }
});

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);

// --- Department ---
export interface IDepartmentDocument extends Document {
  id: string;
  code: string;
  name: string;
  description: string;
  headName: string;
  email: string;
  phone: string;
  activeIncidentsCount: number;
}

const DepartmentSchema = new Schema<IDepartmentDocument>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  headName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  activeIncidentsCount: { type: Number, default: 0 }
});

export const DepartmentModel = mongoose.models.Department || mongoose.model<IDepartmentDocument>('Department', DepartmentSchema);

// --- Notification ---
export interface INotificationDocument extends Document {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const NotificationSchema = new Schema<INotificationDocument>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'general' },
  link: { type: String },
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: String, required: true }
});

NotificationSchema.index({ userId: 1, read: 1 });

export const NotificationModel = mongoose.models.Notification || mongoose.model<INotificationDocument>('Notification', NotificationSchema);

// --- Feedback ---
export interface IFeedbackDocument extends Document {
  id: string;
  reportId?: string;
  incidentId?: string;
  userId: string;
  userName: string;
  rating: number;
  comments: string;
  createdAt: string;
}

const FeedbackSchema = new Schema<IFeedbackDocument>({
  id: { type: String, required: true, unique: true, index: true },
  reportId: { type: String, index: true },
  incidentId: { type: String, index: true },
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String },
  createdAt: { type: String, required: true }
});

export const FeedbackModel = mongoose.models.Feedback || mongoose.model<IFeedbackDocument>('Feedback', FeedbackSchema);

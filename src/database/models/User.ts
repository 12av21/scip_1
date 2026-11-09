// Mongoose Schema for User Entity
import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../types/scip.js';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  phone?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ['citizen', 'officer', 'authority', 'admin'],
      default: 'citizen',
      index: true
    },
    departmentId: { type: String },
    departmentName: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['active', 'suspended'], default: 'active', index: true }
  },
  {
    timestamps: true
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

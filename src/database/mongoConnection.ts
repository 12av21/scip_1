// SCIP MongoDB & Mongoose Lifecycle Manager
import mongoose from 'mongoose';

export async function initMongoConnection(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  mongoose.set('bufferCommands', false); // Fail fast, never hang server

  if (!mongoUri) {
    console.log('[SCIP Database] MONGODB_URI not specified. Using active disk-persisted database engine.');
    return false;
  }

  try {
    console.log('[SCIP Database] Attempting connection to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[SCIP Database] MongoDB connected successfully.');
    return true;
  } catch (err: any) {
    console.warn(`[SCIP Database] MongoDB connection skipped (${err.message}). Active disk-persisted database engine operational.`);
    return false;
  }
}

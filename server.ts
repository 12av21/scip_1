// Smart Community Intelligence Platform (SCIP) - Full Stack Server Entry
import { startServer } from './src/server/app.ts';

startServer().catch((err) => {
  console.error('[SCIP Server] Fatal startup error:', err);
  process.exit(1);
});


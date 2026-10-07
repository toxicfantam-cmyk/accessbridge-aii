import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import transformRoutes from './routes/transformRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import commRoutes from './routes/commRoutes.js';

dotenv.config();

// Disable buffering so queries fail fast or use in-memory store when MongoDB is not connected
mongoose.set('bufferCommands', false);

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev & evaluation
    },
    credentials: true
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    name: 'AccessBridge AI Server',
    version: '1.0.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transform', transformRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/communicate', commRoutes);

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend build if it exists (for single-URL cloud deployment)
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[AccessBridge Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB Connection with Graceful Fallback
const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/accessbridge';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (err) {
    console.warn(`[Database Warning] Could not connect to MongoDB: ${err.message}`);
    console.warn('[Database Warning] Continuing in resilient memory/demo mode. Endpoints remain functional.');
  }
};

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 AccessBridge AI Server is running!`);
    console.log(`📍 Port: http://localhost:${PORT}`);
    console.log(`🛡️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Gemini API Status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Fallback Simulation Mode'}`);
    console.log(`===============================================`);
  });
});

export default app;

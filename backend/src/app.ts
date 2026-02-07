import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import healthRoutes from './routes/health.routes';

import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger, securityHeaders } from './middleware/common.middleware';
import { runMigrations } from './config/migrate';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use(securityHeaders);

// Request logging middleware
if (NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication API - Sprint 1',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        refresh: 'POST /api/auth/refresh',
      },
      users: {
        me: {
          get: 'GET /api/users/me',
          update: 'PUT /api/users/me',
        },
      },
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Run database migrations
    console.log('Running database migrations...');
    await runMigrations();
    console.log('Migrations completed successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║          Authentication API - Sprint 1                 ║
╠════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(38)} ║
║  Server running on port: ${PORT.toString().padEnd(27)} ║
║  Health check: http://localhost:${PORT}/api/health ${''.padEnd(14)} ║
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;
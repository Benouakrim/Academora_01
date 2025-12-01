import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

// Load environment variables
dotenv.config();

// Validate environment variables
const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),
  DATABASE_URL: str({ desc: 'Database connection string' }),
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to AcademOra API' });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 Server is running on port ${env.PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

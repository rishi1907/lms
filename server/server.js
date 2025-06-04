import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';

import { clerkWebhook, stripeWebhook } from './controllers/webhooks.js';
import { clerkMiddleware } from '@clerk/express';

import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

// Initialize express app
const app = express();

// Connect to MongoDB and Cloudinary
await connectDB();
await connectCloudinary();

// Enable CORS
app.use(cors());

// ✅ Stripe Webhook route — must come BEFORE any express.json() or Clerk middleware
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// Clerk Middleware (uses express.json internally — placed after raw body route)
app.use(clerkMiddleware());

// Parse JSON for other routes
app.use(express.json());

// Test route
app.get('/', (req, res) => res.send('API is working'));

// Clerk webhook (can use JSON body)
app.post('/clerk', clerkWebhook);

// Main API routes
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import sonRoutes from './routes/son.js';
import doctorRoutes from './routes/doctor.js';
import wifeRoutes from './routes/wife.js';
import coordinatorRoutes from './routes/coordinator.js';
import webhookRoutes from './routes/webhook.js';
import whatsappRoutes from './routes/whatsapp.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/son', sonRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/wife', wifeRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', whatsappRoutes);
app.use('/webhook', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Project Pulse backend running on port ${PORT}`);
  });
}

export default app;

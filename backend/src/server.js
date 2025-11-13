import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { initDatabase, cleanupExpiredReservations } from './db.js';
import adminRouter from './routes/admin.js';
import starostaRouter from './routes/starosta.js';
import exportRouter from './routes/export.js';
import authRouter from './routes/auth.js';

const app = express();
const upload = multer({ dest: 'backend/uploads/' });

app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

// Public routes
app.get('/api/groups', (req, res) => {
  const data = getDb().data;
  const groups = data.groups.map(g => g.name).sort();
  res.json(groups);
});

// Routers
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/starosta', starostaRouter);
app.use('/api/export', exportRouter);

// Init DB
await initDatabase();

// Cleanup reservations every 1 minute
setInterval(() => {
    try {
        cleanupExpiredReservations();
    } catch (e) {
        // swallow to avoid crashing
    }
}, 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`);
});



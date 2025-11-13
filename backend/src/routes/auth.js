import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, nextId } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'topics-secret';
const TOKEN_TTL_HOURS = 12;

function sanitizeUser(user) {
    const { password_hash, ...safe } = user;
    return safe;
}

router.post('/register', async (req, res) => {
    const { full_name, email, login, password, role, groups = [] } = req.body;
    if (!full_name || !login || !password || !role) {
        return res.status(400).json({ error: 'missing_fields' });
    }
    const data = getDb().data;
    const existing = data.users.find((u) => u.login === login);
    if (existing) return res.status(409).json({ error: 'login_taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = nextId('users');
    const user = {
        id,
        full_name,
        email: email || null,
        login,
        role,
        groups,
        password_hash: passwordHash
    };
    data.users.push(user);
    await getDb().write();
    const token = jwt.sign({ sub: id, role }, JWT_SECRET, { expiresIn: `${TOKEN_TTL_HOURS}h` });
    res.json({
        token,
        user: sanitizeUser(user)
    });
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: 'missing_credentials' });
    const data = getDb().data;
    const user = data.users.find((u) => u.login === login);
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'invalid_credentials' });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: `${TOKEN_TTL_HOURS}h` });
    res.json({
        token,
        user: sanitizeUser(user)
    });
});

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const data = getDb().data;
        const user = data.users.find((u) => u.id === payload.sub);
        if (!user) return res.status(401).json({ error: 'unauthorized' });
        res.json({ user: sanitizeUser(user) });
    } catch (e) {
        return res.status(401).json({ error: 'unauthorized' });
    }
});

export default router;



import express from 'express';
import { getDb, addHistoryEntry } from '../db.js';
import { assignTopicToStudent, reserveTopicForGroup } from '../services/assign.js';

const router = express.Router();

// View lists
router.get('/topics', (req, res) => {
    const data = getDb().data;
    const rows = data.topics.map((t) => ({
        ...t,
        commission_name: t.commission_id ? data.commissions.find((c) => c.id === t.commission_id)?.name || null : null,
        subject_name: t.subject_id ? data.subjects.find((s) => s.id === t.subject_id)?.name || null : null,
        supervisor_full_name: t.supervisor_id ? data.supervisors.find((s) => s.id === t.supervisor_id)?.full_name || null : null,
        assigned_student_full_name: t.assigned_student_id ? data.students.find((s) => s.id === t.assigned_student_id)?.full_name || null : null,
        reserved_by_group_name: t.reserved_by_group_id ? data.groups.find((g) => g.id === t.reserved_by_group_id)?.name || null : null
    })).sort((a, b) => b.id - a.id);
    const mapped = rows.map(r => ({ ...r, status: r.assigned_student_id ? 'занята' : 'свободна' }));
    res.json(mapped);
});

router.get('/students', (req, res) => {
    const { group_id } = req.query;
    if (!group_id) return res.status(400).json({ error: 'group_id_required' });
    const data = getDb().data;
    const rows = data.students.filter((s) => s.group_id === Number(group_id)).sort((a, b) => a.full_name.localeCompare(b.full_name));
    res.json(rows);
});

// Reserve a topic for a group (locks for 30 minutes)
router.post('/topics/:id/reserve', (req, res) => {
    const { id } = req.params;
    const { group_id } = req.body;
    if (!group_id) return res.status(400).json({ error: 'group_id_required' });
    reserveTopicForGroup(Number(id), Number(group_id)).then(async (result) => {
        if (!result.ok) return res.status(409).json({ error: result.reason });
        await addHistoryEntry({
            action: `Тема зарезервирована группой ${group_id}`,
            entityType: 'topic',
            entityId: Number(id),
            newValue: { reserved_by_group_id: Number(group_id) }
        });
        res.json({ ok: true });
    });
});

// Assign a reserved/free topic to a student (within the same group)
router.post('/topics/:id/assign', (req, res) => {
    const { id } = req.params;
    const { student_id } = req.body;
    if (!student_id) return res.status(400).json({ error: 'student_id_required' });
    const data = getDb().data;
    const student = data.students.find((s) => s.id === Number(student_id));
    if (!student) return res.status(404).json({ error: 'student_not_found' });
    const topic = data.topics.find((t) => t.id === Number(id));
    if (!topic) return res.status(404).json({ error: 'topic_not_found' });
    if (topic.assigned_student_id) return res.status(409).json({ error: 'already_assigned' });
    if (topic.reserved_by_group_id && topic.reserved_by_group_id !== student.group_id) {
        return res.status(409).json({ error: 'reserved_by_other' });
    }
    assignTopicToStudent(Number(id), Number(student_id)).then(async (result) => {
        if (!result.ok) return res.status(409).json({ error: result.reason });
        await addHistoryEntry({
            action: 'Тема закреплена старостой',
            entityType: 'topic',
            entityId: Number(id),
            newValue: { assigned_student_id: Number(student_id) }
        });
        res.json({ ok: true });
    });
});

export default router;



import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { getDb, upsertByName, nextId, addHistoryEntry } from '../db.js';
import { parseFile } from '../utils/csv.js';
import { randomAssignByGroup } from '../services/assign.js';

const upload = multer({ dest: 'backend/uploads/' });

const router = express.Router();

// Lowdb имеет свой upsertByName в db.js

// Clear all students
router.delete('/students', async (req, res) => {
    console.log('DELETE /admin/students called - clearing all students');
    const data = getDb().data;
    // Unassign students from topics
    for (const topic of data.topics) {
        if (topic.assigned_student_id) {
            topic.assigned_student_id = null;
            topic.reserved_by_group_id = null;
            topic.reserved_at = null;
        }
    }
    data.students = [];
    await getDb().write();
    await addHistoryEntry({
        action: 'Очищены все студенты',
        entityType: 'student',
        newValue: { cleared: true }
    });
    res.json({ ok: true });
});

// CRUD: Groups
router.get('/groups', (_req, res) => {
    const data = getDb().data;
    res.json([...data.groups].sort((a, b) => a.name.localeCompare(b.name)));
});
router.post('/groups', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name_required' });
    try {
        upsertByName('groups', name).then((id) => res.json({ id, name })).catch(() => {
            res.status(400).json({ error: 'duplicate_or_invalid' });
        });
    } catch (e) {
        res.status(400).json({ error: 'duplicate_or_invalid' });
    }
});

// CRUD: Supervisors (list/add)
router.get('/supervisors', (_req, res) => {
    const data = getDb().data;
    res.json([...data.supervisors].sort((a, b) => a.full_name.localeCompare(b.full_name)));
});
router.post('/supervisors', (req, res) => {
    const { full_name, phone } = req.body;
    if (!full_name) return res.status(400).json({ error: 'full_name_required' });
    const data = getDb().data;
    const id = nextId('supervisors');
    data.supervisors.push({ id, full_name, phone: phone || null });
    getDb().write().then(() => {
        res.json({ id, full_name, phone: phone || null });
    });
});

// Upload CSV/Excel: Students
// Expected headers: full_name, phone, group
router.post('/upload/students', upload.single('file'), async (req, res) => {
    console.log('POST /upload/students called, file:', req.file?.originalname, 'mimetype:', req.file?.mimetype);
    if (!req.file) {
        console.log('No file provided');
        return res.status(400).json({ error: 'file_required' });
    }
    try {
        console.log('Starting to parse file');
        const rows = await parseFile(req.file.path, req.file.mimetype);
        console.log('Parsed rows:', rows.length);
        const data = getDb().data;
        let count = 0;
        for (const r of rows) {
            const fullName = r.full_name || r['ФИО'] || r['fio'] || r['FIO'];
            const phone = r.phone || r['телефон'] || r['Телефон'] || r['ТЕЛЕФОН'] || r['phone_number'] || null;
            const groupName = r.group || r['группа'] || r['Группа'] || r['ГРУППА'] || r['group_name'];
            console.log('Processing row:', { fullName, phone, groupName });
            if (!fullName || !groupName) {
                console.log('Skipping row due to missing data');
                continue;
            }
            const groupId = await upsertByName('groups', String(groupName).trim());
            const id = nextId('students');
            data.students.push({ id, full_name: String(fullName).trim(), phone: phone ? String(phone).trim() : null, group_id: groupId, group_name: String(groupName).trim() });
            count += 1;
        }
        console.log('Processed students:', count);
        await getDb().write();
        if (count > 0) {
            await addHistoryEntry({
                action: `Загружено студентов: ${count}`,
                entityType: 'student',
                newValue: { imported: count }
            });
        }
        res.json({ ok: true, imported: count });
    } catch (e) {
        console.error('Error in upload students:', e);
        res.status(400).json({ error: 'parse_error' });
    } finally {
        fs.unlink(req.file.path, () => { });
    }
});

// Upload CSV/Excel: Topics
// Expected headers: title, description, commission, subject, supervisor_full_name
router.post('/upload/topics', upload.single('file'), async (req, res) => {
    console.log('POST /upload/topics called, file:', req.file?.originalname, 'mimetype:', req.file?.mimetype);
    console.log('Form data:', req.body);
    if (!req.file) {
        console.log('No file provided');
        return res.status(400).json({ error: 'file_required' });
    }
    try {
        console.log('Starting to parse file');
        const rows = await parseFile(req.file.path, req.file.mimetype);
        console.log('Parsed rows:', rows.length);
        const data = getDb().data;
        let count = 0;
        for (const r of rows) {
            const title = r.title || r['тема'] || r['name'] || r['НАЗВАНИЕ'] || r['название'];
            if (!title) {
                console.log('Skipping row due to missing title');
                continue;
            }
            const description = r.description || r['описание'] || null;
            const commissionName = r.commission || r['цмк'] || r['ЦМК'] || null;
            const subjectName = r.subject || r['предмет'] || r['ПРЕДМЕТ'] || null;
            const supervisorFullName = r.supervisor_full_name || r['руководитель'] || r['РУКОВОДИТЕЛЬ'] || null;
            const workType = r.work_type || r['вид работы'] || r['ВИД РАБОТЫ'] || null;
            console.log('Processing topic row:', { title, description, commissionName, subjectName, supervisorFullName, workType });
            const commissionId = commissionName ? await upsertByName('commissions', String(commissionName).trim()) : null;
            const subjectId = subjectName ? await upsertByName('subjects', String(subjectName).trim()) : null;
            let supervisorId = null;
            if (supervisorFullName) {
                const existing = data.supervisors.find((s) => s.full_name === String(supervisorFullName).trim());
                if (existing) supervisorId = existing.id;
                else {
                    supervisorId = nextId('supervisors');
                    data.supervisors.push({ id: supervisorId, full_name: String(supervisorFullName).trim(), phone: null });
                }
            }
            const id = nextId('topics');
            data.topics.push({
                id,
                title: String(title).trim(),
                description: description ? String(description).trim() : null,
                commission_id: commissionId,
                subject_id: subjectId,
                supervisor_id: supervisorId,
                work_type: workType ? String(workType).trim() : null,
                reserved_by_group_id: null,
                reserved_at: null,
                assigned_student_id: null
            });
            count += 1;
        }
        await getDb().write();
        if (count > 0) {
            await addHistoryEntry({
                action: `Загружено тем: ${count}`,
                entityType: 'topic',
                newValue: { imported: count }
            });
        }
        res.json({ ok: true, imported: count });
    } catch (e) {
        res.status(400).json({ error: 'parse_error' });
    } finally {
        fs.unlink(req.file.path, () => { });
    }
});

// Upload CSV/Excel: Supervisors directory
// Expected headers: full_name, phone
router.post('/upload/supervisors', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'file_required' });
    try {
        const rows = await parseFile(req.file.path, req.file.mimetype);
        const data = getDb().data;
        let count = 0;
        for (const r of rows) {
            const name = r.full_name || r['ФИО'] || r['name'];
            if (!name) continue;
            const phone = r.phone ? String(r.phone).trim() : null;
            const existing = data.supervisors.find((s) => s.full_name === String(name).trim());
            if (existing) {
                existing.phone = phone;
            } else {
                const id = nextId('supervisors');
                data.supervisors.push({ id, full_name: String(name).trim(), phone });
            }
            count += 1;
        }
        await getDb().write();
        if (count > 0) {
            await addHistoryEntry({
                action: `Обновлён справочник руководителей (±${count})`,
                entityType: 'supervisor',
                newValue: { imported: count }
            });
        }
        res.json({ ok: true, imported: count });
    } catch (e) {
        res.status(400).json({ error: 'parse_error' });
    } finally {
        fs.unlink(req.file.path, () => { });
    }
});

// Lists for admin
router.get('/students', (req, res) => {
    const { group_id } = req.query;
    const data = getDb().data;
    let rows = data.students.map((s) => s);
    if (group_id) {
        rows = rows.filter((s) => s.group_id === Number(group_id));
    }
    rows.sort((a, b) => (a.group_name + a.full_name).localeCompare(b.group_name + b.full_name));
    res.json(rows);
});

router.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    console.log('DELETE /students/:id called with id:', id);
    const data = getDb().data;
    const index = data.students.findIndex((s) => s.id === Number(id));
    if (index === -1) {
        console.log('Student not found');
        return res.status(404).json({ error: 'student_not_found' });
    }
    const student = data.students[index];
    console.log('Found student:', student);

    // If student is assigned to any topic, unassign them
    const assignedTopics = data.topics.filter((t) => t.assigned_student_id === Number(id));
    if (assignedTopics.length > 0) {
        console.log('Student is assigned to topics:', assignedTopics.map(t => t.id));
        assignedTopics.forEach((topic) => {
            topic.assigned_student_id = null;
            topic.reserved_by_group_id = null;
            topic.reserved_at = null;
        });
    }

    data.students.splice(index, 1);
    console.log('Student removed from array');
    getDb().write().then(async () => {
        // Add history entries
        for (const topic of assignedTopics) {
            await addHistoryEntry({
                action: 'Назначение темы снято (удаление студента)',
                entityType: 'topic',
                entityId: topic.id,
                newValue: { assigned_student_id: null }
            });
        }
        await addHistoryEntry({
            action: 'Студент удалён',
            entityType: 'student',
            entityId: Number(id),
            newValue: { full_name: student.full_name, group_name: student.group_name }
        });
        console.log('Student deleted successfully');
        res.json({ ok: true });
    }).catch((err) => {
        console.error('Error writing to DB:', err);
        res.status(500).json({ error: 'db_write_error' });
    });
});

router.get('/topics', (req, res) => {
    const { only_free } = req.query;
    const data = getDb().data;
    let rows = data.topics.map((t) => {
        const student = t.assigned_student_id ? data.students.find((s) => s.id === t.assigned_student_id) : null;
        const isReserved = t.reserved_by_group_id && t.reserved_at && (Date.now() - new Date(t.reserved_at).getTime() < 30 * 60 * 1000);
        return {
            ...t,
            commission_name: t.commission_id ? data.commissions.find((c) => c.id === t.commission_id)?.name || null : null,
            subject_name: t.subject_id ? data.subjects.find((s) => s.id === t.subject_id)?.name || null : null,
            supervisor_full_name: t.supervisor_id ? data.supervisors.find((s) => s.id === t.supervisor_id)?.full_name || null : null,
            student_name: student?.full_name || null,
            student_group: student ? data.groups.find((g) => g.id === student.group_id)?.name || null : null,
            status: t.assigned_student_id ? 'occupied' : (isReserved ? 'reserved' : 'free'),
            cmk: t.commission_id ? data.commissions.find((c) => c.id === t.commission_id)?.name || null : null
        };
    });
    if (only_free === '1') rows = rows.filter((r) => r.status === 'free');
    // Сортируем: занятые внизу, свободные сверху, затем по ID
    rows.sort((a, b) => {
        if (a.status === 'occupied' && b.status !== 'occupied') return 1;
        if (a.status !== 'occupied' && b.status === 'occupied') return -1;
        return b.id - a.id;
    });
    res.json(rows);
});

// Admin can reassign/change supervisor/topic
router.post('/topics/:id/reassign', (req, res) => {
    const { id } = req.params;
    const { student_id } = req.body;
    const data = getDb().data;
    const topic = data.topics.find((t) => t.id === Number(id));
    if (!topic) return res.status(404).json({ error: 'not_found' });
    topic.assigned_student_id = student_id || null;
    topic.reserved_by_group_id = null;
    topic.reserved_at = null;
    getDb().write().then(async () => {
        await addHistoryEntry({
            action: student_id ? 'Тема назначена студенту' : 'Назначение темы снято',
            entityType: 'topic',
            entityId: topic.id,
            newValue: { assigned_student_id: student_id || null }
        });
        res.json({ ok: true });
    });
});

router.post('/topics/:id/supervisor', (req, res) => {
    const { id } = req.params;
    const { supervisor_id } = req.body;
    const data = getDb().data;
    const topic = data.topics.find((t) => t.id === Number(id));
    if (!topic) return res.status(404).json({ error: 'not_found' });
    topic.supervisor_id = supervisor_id || null;
    getDb().write().then(async () => {
        await addHistoryEntry({
            action: 'Изменён руководитель темы',
            entityType: 'topic',
            entityId: topic.id,
            newValue: { supervisor_id: supervisor_id || null }
        });
        res.json({ ok: true });
    });
});

// Auto-assign random for a group
router.post('/auto-assign', (req, res) => {
    const { group_id } = req.body;
    if (!group_id) return res.status(400).json({ error: 'group_id_required' });
    randomAssignByGroup(Number(group_id)).then(async (result) => {
        await addHistoryEntry({
            action: `Авто-распределение для группы ${group_id}`,
            entityType: 'distribution',
            entityId: Number(group_id),
            newValue: { assigned: result.assigned || 0 }
        });
        res.json({ ok: true, ...result });
    });
});

router.get('/stats', (_req, res) => {
    const data = getDb().data;
    const students = data.students || [];
    const topics = data.topics || [];
    res.json({
        students: {
            total: students.length
        },
        topics: {
            total: topics.length,
            free: topics.filter((t) => !t.assigned_student_id).length,
            occupied: topics.filter((t) => t.assigned_student_id).length,
            reserved: topics.filter((t) => !t.assigned_student_id && t.reserved_by_group_id).length
        }
    });
});

router.get('/history', (_req, res) => {
    const data = getDb().data;
    res.json(data.history || []);
});

export default router;



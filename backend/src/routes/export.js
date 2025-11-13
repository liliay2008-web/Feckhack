import express from 'express';
import { Parser as Json2CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { getDb } from '../db.js';

const router = express.Router();

function buildRows(filters) {
    console.log('buildRows called with filters:', filters);
    const data = getDb().data;
    console.log('Total topics:', data.topics.length, 'Total students:', data.students.length);
    let rows = data.topics.map((t) => {
        const student = t.assigned_student_id ? data.students.find((s) => s.id === t.assigned_student_id) : null;
        const group = student ? data.groups.find((g) => g.id === student.group_id) : (t.reserved_by_group_id ? data.groups.find((g) => g.id === t.reserved_by_group_id) : null);
        const commission = t.commission_id ? data.commissions.find((c) => c.id === t.commission_id) : null;
        const subject = t.subject_id ? data.subjects.find((s) => s.id === t.subject_id) : null;
        const supervisor = t.supervisor_id ? data.supervisors.find((s) => s.id === t.supervisor_id) : null;
        return {
            topic_id: t.id,
            title: t.title,
            description: t.description || '',
            commission: commission?.name || '',
            subject: subject?.name || '',
            supervisor: supervisor?.full_name || '',
            student: student?.full_name || '',
            student_phone: student?.phone || '',
            group_name: group?.name || '',
            status: t.assigned_student_id ? 'занята' : 'свободна',
            work_type: t.work_type || ''
        };
    });
    console.log('Rows before filters:', rows.length);
    // Фильтры по имени (не по ID)
    if (filters.group) {
        rows = rows.filter((r) => r.group_name === filters.group);
        console.log('After group filter:', rows.length);
    }
    if (filters.supervisor) {
        rows = rows.filter((r) => r.supervisor === filters.supervisor);
        console.log('After supervisor filter:', rows.length);
    }
    if (filters.cmk) {
        rows = rows.filter((r) => r.commission === filters.cmk);
        console.log('After cmk filter:', rows.length);
    }
    rows.sort((a, b) => (a.group_name + a.supervisor + a.title).localeCompare(b.group_name + b.supervisor + b.title));
    console.log('Final rows:', rows.length);
    return rows;
}

// Endpoint для получения опций фильтров
router.get('/filters', (_req, res) => {
    const data = getDb().data;
    const groups = [...new Set(data.students.map(s => {
        const g = data.groups.find(gr => gr.id === s.group_id);
        return g?.name;
    }).filter(Boolean))].sort();
    const supervisors = data.supervisors.map(s => s.full_name).sort();
    const cmks = data.commissions.map(c => c.name).sort();
    res.json({ groups, supervisors, cmks });
});

router.get('/csv', (req, res) => {
    console.log('GET /csv called with query:', req.query);
    const rows = buildRows(req.query);
    console.log('CSV rows count:', rows.length);
    const parser = new Json2CsvParser({ fields: Object.keys(rows[0] || { title: '', status: '' }) });
    const csv = parser.parse(rows);
    console.log('CSV generated, length:', csv.length);
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('export.csv');
    res.send(csv);
});

router.get('/csv/free', (req, res) => {
    const allRows = buildRows(req.query);
    const rows = allRows.filter(r => r.status === 'свободна');
    const parser = new Json2CsvParser({ fields: Object.keys(rows[0] || { title: '', status: '' }) });
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('free_topics.csv');
    res.send(csv);
});

router.get('/pdf', (req, res) => {
    console.log('GET /pdf called with query:', req.query);
    const rows = buildRows(req.query);
    console.log('PDF rows count:', rows.length);
    res.header('Content-Type', 'application/pdf');
    res.attachment('export.pdf');
    const doc = new PDFDocument({ margin: 36 });
    doc.pipe(res);
    doc.fontSize(16).text('Выгрузка тем', { underline: true });
    doc.moveDown();
    rows.forEach((r) => {
        doc.fontSize(12).text(`Тема: ${r.title}`);
        if (r.description) doc.fontSize(10).text(`Описание: ${r.description}`);
        doc.fontSize(10).text(`Статус: ${r.status} | Группа: ${r.group_name || '-'} | Ст. ${r.student || '-'}`);
        doc.fontSize(10).text(`Руководитель: ${r.supervisor || '-'} | ЦМК: ${r.commission || '-'} | Предмет: ${r.subject || '-'}`);
        doc.moveDown();
    });
    doc.end();
});

// Роут для Excel (пока что то же, что CSV)
router.get('/excel', (req, res) => {
    console.log('GET /excel called with query:', req.query);
    const rows = buildRows(req.query);
    console.log('Excel rows count:', rows.length);
    const parser = new Json2CsvParser({ fields: Object.keys(rows[0] || { title: '', status: '' }) });
    const csv = parser.parse(rows);
    console.log('Excel CSV generated, length:', csv.length);
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('export.xlsx'); // Хотя это CSV, но для совместимости
    res.send(csv);
});

// Роут для экспорта студентов
router.get('/students/csv', (req, res) => {
    console.log('GET /students/csv called with query:', req.query);
    const data = getDb().data;
    let students = data.students.map((s) => {
        const group = data.groups.find((g) => g.id === s.group_id);
        return {
            id: s.id,
            full_name: s.full_name,
            phone: s.phone || '',
            group_name: group?.name || '',
            group_id: s.group_id
        };
    });
    if (req.query.group) {
        students = students.filter((s) => s.group_name === req.query.group);
    }
    console.log('Students rows count:', students.length);
    const parser = new Json2CsvParser({ fields: Object.keys(students[0] || { full_name: '', group_name: '' }) });
    const csv = parser.parse(students);
    console.log('Students CSV generated, length:', csv.length);
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('students_export.csv');
    res.send(csv);
});

export default router;



import { getDb, nowIso } from '../db.js';

export async function randomAssignByGroup(groupId) {
    const data = getDb().data;
    const freeStudents = data.students
        .filter((s) => s.group_id === groupId && !data.topics.some((t) => t.assigned_student_id === s.id))
        .map((s) => s.id);
    const freeTopics = data.topics.filter((t) => !t.assigned_student_id).map((t) => t.id);
    const shuffledStudents = [...freeStudents].sort(() => Math.random() - 0.5);
    const shuffledTopics = [...freeTopics].sort(() => Math.random() - 0.5);
    const count = Math.min(shuffledStudents.length, shuffledTopics.length);
    for (let i = 0; i < count; i += 1) {
        const topic = data.topics.find((t) => t.id === shuffledTopics[i]);
        topic.assigned_student_id = shuffledStudents[i];
        topic.reserved_by_group_id = null;
        topic.reserved_at = null;
    }
    await getDb().write();
    return { assigned: count };
}

export async function reserveTopicForGroup(topicId, groupId) {
    const data = getDb().data;
    const topic = data.topics.find((t) => t.id === topicId);
    if (!topic) return { ok: false, reason: 'not_found' };
    if (topic.assigned_student_id) return { ok: false, reason: 'already_assigned' };
    if (topic.reserved_by_group_id && topic.reserved_by_group_id !== groupId) return { ok: false, reason: 'reserved_by_other' };
    topic.reserved_by_group_id = groupId;
    topic.reserved_at = nowIso();
    await getDb().write();
    return { ok: true };
}

export async function assignTopicToStudent(topicId, studentId) {
    const data = getDb().data;
    const topic = data.topics.find((t) => t.id === topicId);
    if (!topic) return { ok: false, reason: 'not_found' };
    if (topic.assigned_student_id) return { ok: false, reason: 'already_assigned' };
    topic.assigned_student_id = studentId;
    topic.reserved_by_group_id = null;
    topic.reserved_at = null;
    await getDb().write();
    return { ok: true };
}



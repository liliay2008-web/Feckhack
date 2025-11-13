import dayjs from 'dayjs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, '..', 'data.json');

let db;

const defaultData = {
  groups: [],
  commissions: [],
  subjects: [],
  supervisors: [],
  history: [],
  users: [],
  students: [],
  topics: [],
  nextIds: {
    groups: 1,
    commissions: 1,
    subjects: 1,
    supervisors: 1,
    history: 1,
    users: 1,
    students: 1,
    topics: 1
  }
};

export async function initDatabase() {
  db = new Low(new JSONFile(dbFile), defaultData);
  await db.read();
  if (!db.data) {
    db.data = structuredClone(defaultData);
  } else {
    for (const key of Object.keys(defaultData)) {
      if (db.data[key] === undefined) {
        db.data[key] = structuredClone(defaultData[key]);
      }
    }
    if (!db.data.nextIds) {
      db.data.nextIds = { ...defaultData.nextIds };
    } else {
      for (const key of Object.keys(defaultData.nextIds)) {
        if (typeof db.data.nextIds[key] !== 'number') {
          db.data.nextIds[key] = defaultData.nextIds[key];
        }
      }
    }
  }
  await db.write();
}

export function getDb() {
  if (!db) {
    throw new Error('DB not initialized. Call initDatabase() first.');
  }
  return db;
}

export function nowIso() {
  return dayjs().toISOString();
}

export async function cleanupExpiredReservations() {
  const threshold = dayjs().subtract(30, 'minute').toISOString();
  const data = getDb().data;
  let changed = false;
  for (const t of data.topics) {
    if (!t.assigned_student_id && t.reserved_at && t.reserved_at < threshold) {
      t.reserved_at = null;
      t.reserved_by_group_id = null;
      changed = true;
    }
  }
  if (changed) {
    await db.write();
  }
}

export function nextId(collectionName) {
  const data = getDb().data;
  const id = data.nextIds[collectionName]++;
  return id;
}

export async function addHistoryEntry({
  action,
  entityType,
  entityId = null,
  user = null,
  oldValue = null,
  newValue = null
}) {
  const data = getDb().data;
  if (!data.history) data.history = [];
  const entryId = data.nextIds?.history ? nextId('history') : Date.now();
  data.history.unshift({
    id: entryId,
    created_at: nowIso(),
    action,
    entity_type: entityType,
    entity_id: entityId,
    user_id: user?.id || null,
    user_name: user?.full_name || 'Система',
    user_role: user?.role || null,
    old_value: oldValue || null,
    new_value: newValue || null
  });
  data.history = data.history.slice(0, 200);
  await db.write();
}

export async function upsertByName(table, name) {
  const data = getDb().data;
  const list = data[table];
  const existing = list.find((i) => i.name?.toLowerCase() === String(name).trim().toLowerCase());
  if (existing) return existing.id;
  const id = nextId(table);
  list.push({ id, name: String(name).trim() });
  await db.write();
  return id;
}



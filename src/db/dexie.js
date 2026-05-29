import Dexie from 'dexie'

const db = new Dexie('KetoTrack')

db.version(1).stores({
  userProfile: 'id',
  fastingSessions: 'id, start_time, status',
  foodEntries: 'id, date, meal',
  foodItems: 'id, category, is_custom',
  ketoneReadings: 'id, date',
  waterEntries: 'id, date',
  weightEntries: 'id, date',
  achievements: 'id, badge_id',
  articles: 'id, category',
  readingProgress: '[article_id+read_at]',
})

// ── Fasting Session Helpers ─────────────────────────────────────────────

export async function getFastingSessions(limit = 7) {
  const arr = await db.fastingSessions
    .where('status')
    .equals('completed')
    .toArray()
  return arr
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
    .slice(0, limit)
}

export async function getActiveFast() {
  return db.fastingSessions
    .where('status')
    .equals('active')
    .first()
}

export async function createFastingSession(data) {
  const id = crypto.randomUUID()
  const session = {
    id,
    protocol: data.protocol,
    startTime: data.startTime || new Date().toISOString(),
    endTime: null,
    targetDurationHours: data.targetDurationHours,
    actualDurationHours: null,
    status: 'active',
    notes: data.notes || '',
  }
  await db.fastingSessions.add(session)
  return session
}

export async function updateFastingSession(id, changes) {
  await db.fastingSessions.update(id, changes)
}

// ── Water Entry Helpers ─────────────────────────────────────────────────

export async function addWaterEntry(ml) {
  const today = new Date().toISOString().slice(0, 10)
  const entry = {
    id: crypto.randomUUID(),
    date: today,
    time: new Date().toISOString(),
    ml,
  }
  await db.waterEntries.add(entry)
  return entry
}

export async function getTodayWater() {
  const today = new Date().toISOString().slice(0, 10)
  return db.waterEntries.where('date').equals(today).toArray()
}

export async function deleteWaterEntry(id) {
  await db.waterEntries.delete(id)
}

// ── Ketone Reading Helpers ──────────────────────────────────────────────

export async function addKetoneReading(mmol) {
  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mmol,
  }
  await db.ketoneReadings.add(entry)
  return entry
}

export async function getLast7Ketone() {
  const all = await db.ketoneReadings.toArray()
  return all
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)
}

// ── Weight Entry Helpers ────────────────────────────────────────────────

export async function addWeightEntry(kg) {
  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    kg,
  }
  await db.weightEntries.add(entry)
  return entry
}

export async function getLast30Weight() {
  const all = await db.weightEntries.toArray()
  return all
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30)
}

// ── Food Entry Helpers ─────────────────────────────────────────────────

export async function addFoodEntry({ meal, food_item_id, name_bn, portion_g, net_carbs_g, fat_g, protein_g, kcal }) {
  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    meal,
    food_item_id: food_item_id || null,
    name_bn,
    portion_g,
    net_carbs_g,
    fat_g,
    protein_g,
    kcal,
  }
  await db.foodEntries.add(entry)
  return entry
}

export async function getTodayFoodEntries() {
  const today = new Date().toISOString().slice(0, 10)
  const entries = await db.foodEntries.where('date').equals(today).toArray()
  const order = ['সকাল', 'দুপুর', 'রাত']
  return entries.sort((a, b) => order.indexOf(a.meal) - order.indexOf(b.meal))
}

export async function deleteFoodEntry(id) {
  await db.foodEntries.delete(id)
}

export async function searchFoodItems(query) {
  if (!query || query.trim() === '') return []
  const q = query.trim().toLowerCase()
  const all = await db.foodItems.toArray()
  return all
    .filter((item) => {
      const bn = (item.name_bn || '').toLowerCase()
      const en = (item.name_en || '').toLowerCase()
      const cat = (item.category || '').toLowerCase()
      return bn.includes(q) || en.includes(q) || cat.includes(q)
    })
    .slice(0, 30)
}

export default db

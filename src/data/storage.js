import AsyncStorage from '@react-native-async-storage/async-storage';

const ratesKey = (userId) => `stavelectric.rates.${userId}.v2`;
const quotesKey = (userId) => `stavelectric.quotes.${userId}.v2`;
const clientsKey = (userId) => `stavelectric.clients.${userId}.v1`;
const eventsKey = (userId) => `stavelectric.events.${userId}.v1`;
const customItemsKey = (userId) => `stavelectric.customItems.${userId}.v1`;

const CONDUIT_MIGRATION = {
  conduit16: 'conduitMarichef_16',
  conduit20: 'conduitMarichef_20',
  mcb16: 'mcb1ph_16',
  mcb25: 'mcb1ph_25',
  mcb32: 'mcb1ph_32',
  panel1ph12: 'panel1ph_12',
  panel1ph24: 'panel1ph_24',
  panel3ph24: 'panel3ph_24',
  panel3ph36: 'panel3ph_36',
  panel3ph48: 'panel3ph_48',
  wallBox2: 'concreteBox_2',
  wallBox3: 'concreteBox_3',
  wallBox4: 'concreteBox_4',
  wallBox5: 'concreteBox_5',
};

function migrateRates(rates) {
  if (!rates) return { rates: {}, changed: false };
  let changed = false;
  const next = { ...rates };
  for (const [oldKey, newKey] of Object.entries(CONDUIT_MIGRATION)) {
    if (next[oldKey] != null && next[newKey] == null) {
      next[newKey] = next[oldKey];
      changed = true;
    }
  }
  return { rates: next, changed };
}

export async function loadRates(userId) {
  if (!userId) return {};
  try {
    const raw = await AsyncStorage.getItem(ratesKey(userId));
    const parsed = raw ? JSON.parse(raw) : {};
    const { rates, changed } = migrateRates(parsed);
    if (changed) {
      await AsyncStorage.setItem(ratesKey(userId), JSON.stringify(rates));
    }
    return rates;
  } catch (e) {
    return {};
  }
}

export async function saveRates(userId, rates) {
  if (!userId) return;
  await AsyncStorage.setItem(ratesKey(userId), JSON.stringify(rates));
}

export function hasAnyRate(rates) {
  if (!rates) return false;
  return Object.values(rates).some((v) => Number(v) > 0);
}

export async function loadQuotes(userId) {
  if (!userId) return [];
  try {
    const raw = await AsyncStorage.getItem(quotesKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((q) => ({ ...q, createdAt: new Date(q.createdAt) }));
  } catch (e) {
    return [];
  }
}

export async function saveQuote(userId, quote) {
  if (!userId) return [];
  const all = await loadQuotes(userId);
  const next = [quote, ...all];
  await persistQuotes(userId, next);
  return next;
}

export async function updateQuote(userId, quoteId, patch) {
  if (!userId) return [];
  const all = await loadQuotes(userId);
  const next = all.map((q) => (q.id === quoteId ? { ...q, ...patch, id: quoteId } : q));
  await persistQuotes(userId, next);
  return next;
}

export async function getQuoteById(userId, quoteId) {
  if (!userId || !quoteId) return null;
  const all = await loadQuotes(userId);
  return all.find((q) => q.id === quoteId) || null;
}

export async function deleteQuote(userId, quoteId) {
  if (!userId) return [];
  const all = await loadQuotes(userId);
  const next = all.filter((q) => q.id !== quoteId);
  await persistQuotes(userId, next);
  return next;
}

async function persistQuotes(userId, quotes) {
  await AsyncStorage.setItem(
    quotesKey(userId),
    JSON.stringify(quotes.map((q) => ({ ...q, createdAt: q.createdAt.toISOString() }))),
  );
}

// ---- Clients ----

export async function loadClients(userId) {
  if (!userId) return [];
  try {
    const raw = await AsyncStorage.getItem(clientsKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c) => ({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      lastUsedAt: c.lastUsedAt ? new Date(c.lastUsedAt) : null,
    }));
  } catch (e) {
    return [];
  }
}

export async function saveClient(userId, client) {
  if (!userId || !client) return [];
  const all = await loadClients(userId);
  const id = client.id || String(Date.now());
  const existing = all.find((c) => c.id === id);
  const next = existing
    ? all.map((c) => (c.id === id ? { ...c, ...client, id } : c))
    : [{ ...client, id, createdAt: new Date() }, ...all];
  await persistClients(userId, next);
  return next;
}

export async function deleteClient(userId, clientId) {
  if (!userId) return [];
  const all = await loadClients(userId);
  const next = all.filter((c) => c.id !== clientId);
  await persistClients(userId, next);
  return next;
}

export async function upsertClientFromQuote(userId, { name, phone, address }) {
  if (!userId || !name) return [];
  const trimmedName = name.trim();
  const trimmedPhone = (phone || '').trim();
  const trimmedAddress = (address || '').trim();
  if (!trimmedName) return [];
  const all = await loadClients(userId);
  const match = all.find(
    (c) => c.name.trim() === trimmedName || (trimmedPhone && c.phone && c.phone.trim() === trimmedPhone),
  );
  if (match) {
    const next = all.map((c) =>
      c.id === match.id ? {
        ...c,
        name: trimmedName,
        phone: trimmedPhone || c.phone || null,
        address: trimmedAddress || c.address || null,
        lastUsedAt: new Date(),
      } : c,
    );
    await persistClients(userId, next);
    return next;
  }
  const fresh = {
    id: String(Date.now()),
    name: trimmedName,
    phone: trimmedPhone || null,
    address: trimmedAddress || null,
    email: null,
    createdAt: new Date(),
    lastUsedAt: new Date(),
  };
  const next = [fresh, ...all];
  await persistClients(userId, next);
  return next;
}

// ---- Schedule events (jobs + reminders) ----

export async function loadEvents(userId) {
  if (!userId) return [];
  try {
    const raw = await AsyncStorage.getItem(eventsKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function saveEvent(userId, event) {
  if (!userId || !event) return [];
  const all = await loadEvents(userId);
  const id = event.id || String(Date.now());
  const existing = all.find((e) => e.id === id);
  const next = existing
    ? all.map((e) => (e.id === id ? { ...e, ...event, id } : e))
    : [...all, { ...event, id, createdAt: Date.now() }];
  await AsyncStorage.setItem(eventsKey(userId), JSON.stringify(next));
  return next;
}

export async function deleteEvent(userId, eventId) {
  if (!userId) return [];
  const all = await loadEvents(userId);
  const next = all.filter((e) => e.id !== eventId);
  await AsyncStorage.setItem(eventsKey(userId), JSON.stringify(next));
  return next;
}

// ---- Custom items (user-defined catalog entries) ----

export async function loadCustomItems(userId) {
  if (!userId) return [];
  try {
    const raw = await AsyncStorage.getItem(customItemsKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function saveCustomItem(userId, item) {
  if (!userId || !item) return [];
  const all = await loadCustomItems(userId);
  const id = item.id || `custom_${Date.now()}`;
  const existing = all.find((i) => i.id === id);
  const next = existing
    ? all.map((i) => (i.id === id ? { ...i, ...item, id } : i))
    : [{ ...item, id, createdAt: item.createdAt || Date.now() }, ...all];
  await AsyncStorage.setItem(customItemsKey(userId), JSON.stringify(next));
  return next;
}

export async function deleteCustomItem(userId, itemId) {
  if (!userId) return [];
  const all = await loadCustomItems(userId);
  const next = all.filter((i) => i.id !== itemId);
  await AsyncStorage.setItem(customItemsKey(userId), JSON.stringify(next));
  return next;
}

async function persistClients(userId, clients) {
  await AsyncStorage.setItem(
    clientsKey(userId),
    JSON.stringify(
      clients.map((c) => ({
        ...c,
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
        lastUsedAt: c.lastUsedAt instanceof Date ? c.lastUsedAt.toISOString() : c.lastUsedAt,
      })),
    ),
  );
}

export async function exportAllUserData(userId) {
  const [ratesRaw, quotesRaw, clientsRaw, eventsRaw, customItemsRaw] = await Promise.all([
    AsyncStorage.getItem(ratesKey(userId)),
    AsyncStorage.getItem(quotesKey(userId)),
    AsyncStorage.getItem(clientsKey(userId)),
    AsyncStorage.getItem(eventsKey(userId)),
    AsyncStorage.getItem(customItemsKey(userId)),
  ]);
  return {
    schema: 'proquote.backup',
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    userId,
    rates: ratesRaw ? JSON.parse(ratesRaw) : {},
    quotes: quotesRaw ? JSON.parse(quotesRaw) : [],
    clients: clientsRaw ? JSON.parse(clientsRaw) : [],
    events: eventsRaw ? JSON.parse(eventsRaw) : [],
    customItems: customItemsRaw ? JSON.parse(customItemsRaw) : [],
  };
}

export async function importAllUserData(userId, backup) {
  if (!backup || backup.schema !== 'proquote.backup') {
    throw new Error('קובץ הגיבוי לא תקין');
  }
  const ops = [];
  if (backup.rates) ops.push(AsyncStorage.setItem(ratesKey(userId), JSON.stringify(backup.rates)));
  if (backup.quotes) ops.push(AsyncStorage.setItem(quotesKey(userId), JSON.stringify(backup.quotes)));
  if (backup.clients) ops.push(AsyncStorage.setItem(clientsKey(userId), JSON.stringify(backup.clients)));
  if (backup.events) ops.push(AsyncStorage.setItem(eventsKey(userId), JSON.stringify(backup.events)));
  if (backup.customItems) ops.push(AsyncStorage.setItem(customItemsKey(userId), JSON.stringify(backup.customItems)));
  await Promise.all(ops);
  return {
    rates: backup.rates ? Object.keys(backup.rates).length : 0,
    quotes: backup.quotes ? backup.quotes.length : 0,
    clients: backup.clients ? backup.clients.length : 0,
    events: backup.events ? backup.events.length : 0,
    customItems: backup.customItems ? backup.customItems.length : 0,
  };
}

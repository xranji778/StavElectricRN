import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc,
} from '@firebase/firestore';
import { db } from '../firebase/firebaseConfig';

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

function userDoc(userId, ...segments) {
  return doc(db, 'users', userId, ...segments);
}

function userCollection(userId, name) {
  return collection(db, 'users', userId, name);
}

// ---- Rates ----

export async function loadRates(userId) {
  if (!userId) return {};
  try {
    const snap = await getDoc(userDoc(userId, 'meta', 'rates'));
    const parsed = snap.exists() ? (snap.data().values || {}) : {};
    const { rates, changed } = migrateRates(parsed);
    if (changed) {
      await setDoc(userDoc(userId, 'meta', 'rates'), { values: rates });
    }
    return rates;
  } catch (e) {
    return {};
  }
}

export async function saveRates(userId, rates) {
  if (!userId) return;
  await setDoc(userDoc(userId, 'meta', 'rates'), { values: rates });
}

export function hasAnyRate(rates) {
  if (!rates) return false;
  return Object.values(rates).some((v) => Number(v) > 0);
}

// ---- Quotes ----

export async function loadQuotes(userId) {
  if (!userId) return [];
  try {
    const snap = await getDocs(userCollection(userId, 'quotes'));
    const list = snap.docs.map((d) => {
      const data = d.data();
      return { ...data, id: d.id, createdAt: new Date(data.createdAt) };
    });
    list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  } catch (e) {
    return [];
  }
}

export async function saveQuote(userId, quote) {
  if (!userId) return [];
  const { id, createdAt, ...rest } = quote;
  await setDoc(userDoc(userId, 'quotes', id), {
    ...rest,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
  });
  return loadQuotes(userId);
}

export async function updateQuote(userId, quoteId, patch) {
  if (!userId) return [];
  const patchData = { ...patch };
  if (patchData.createdAt instanceof Date) patchData.createdAt = patchData.createdAt.toISOString();
  await setDoc(userDoc(userId, 'quotes', quoteId), patchData, { merge: true });
  return loadQuotes(userId);
}

export async function getQuoteById(userId, quoteId) {
  if (!userId || !quoteId) return null;
  try {
    const snap = await getDoc(userDoc(userId, 'quotes', quoteId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return { ...data, id: snap.id, createdAt: new Date(data.createdAt) };
  } catch (e) {
    return null;
  }
}

export async function deleteQuote(userId, quoteId) {
  if (!userId) return [];
  await deleteDoc(userDoc(userId, 'quotes', quoteId));
  return loadQuotes(userId);
}

// ---- Clients ----

export async function loadClients(userId) {
  if (!userId) return [];
  try {
    const snap = await getDocs(userCollection(userId, 'clients'));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        lastUsedAt: data.lastUsedAt ? new Date(data.lastUsedAt) : null,
      };
    });
  } catch (e) {
    return [];
  }
}

export async function saveClient(userId, client) {
  if (!userId || !client) return [];
  const id = client.id || String(Date.now());
  const existingSnap = await getDoc(userDoc(userId, 'clients', id));
  const createdAt = existingSnap.exists()
    ? existingSnap.data().createdAt
    : new Date().toISOString();
  const { id: _drop, createdAt: _dropCA, lastUsedAt, ...rest } = client;
  await setDoc(userDoc(userId, 'clients', id), {
    ...rest,
    createdAt,
    lastUsedAt: lastUsedAt instanceof Date ? lastUsedAt.toISOString() : (lastUsedAt || null),
  });
  return loadClients(userId);
}

export async function deleteClient(userId, clientId) {
  if (!userId) return [];
  await deleteDoc(userDoc(userId, 'clients', clientId));
  return loadClients(userId);
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
    await setDoc(userDoc(userId, 'clients', match.id), {
      name: trimmedName,
      phone: trimmedPhone || match.phone || null,
      address: trimmedAddress || match.address || null,
      email: match.email || null,
      createdAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
      lastUsedAt: new Date().toISOString(),
    });
  } else {
    const id = String(Date.now());
    await setDoc(userDoc(userId, 'clients', id), {
      name: trimmedName,
      phone: trimmedPhone || null,
      address: trimmedAddress || null,
      email: null,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    });
  }
  return loadClients(userId);
}

// ---- Schedule events (jobs + reminders) ----

export async function loadEvents(userId) {
  if (!userId) return [];
  try {
    const snap = await getDocs(userCollection(userId, 'events'));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (e) {
    return [];
  }
}

export async function saveEvent(userId, event) {
  if (!userId || !event) return [];
  const id = event.id || String(Date.now());
  const existingSnap = await getDoc(userDoc(userId, 'events', id));
  const createdAt = existingSnap.exists() ? existingSnap.data().createdAt : Date.now();
  const { id: _drop, ...rest } = event;
  await setDoc(userDoc(userId, 'events', id), { ...rest, createdAt });
  return loadEvents(userId);
}

export async function deleteEvent(userId, eventId) {
  if (!userId) return [];
  await deleteDoc(userDoc(userId, 'events', eventId));
  return loadEvents(userId);
}

// ---- Custom items (user-defined catalog entries) ----

export async function loadCustomItems(userId) {
  if (!userId) return [];
  try {
    const snap = await getDocs(userCollection(userId, 'customItems'));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (e) {
    return [];
  }
}

export async function saveCustomItem(userId, item) {
  if (!userId || !item) return [];
  const id = item.id || `custom_${Date.now()}`;
  const existingSnap = await getDoc(userDoc(userId, 'customItems', id));
  const createdAt = existingSnap.exists() ? existingSnap.data().createdAt : (item.createdAt || Date.now());
  const { id: _drop, ...rest } = item;
  await setDoc(userDoc(userId, 'customItems', id), { ...rest, createdAt });
  return loadCustomItems(userId);
}

export async function deleteCustomItem(userId, itemId) {
  if (!userId) return [];
  await deleteDoc(userDoc(userId, 'customItems', itemId));
  return loadCustomItems(userId);
}

// ---- Backup / restore (JSON file export-import, reads/writes the live cloud data) ----

export async function exportAllUserData(userId) {
  const [ratesSnap, quotesSnap, clientsSnap, eventsSnap, customItemsSnap] = await Promise.all([
    getDoc(userDoc(userId, 'meta', 'rates')),
    getDocs(userCollection(userId, 'quotes')),
    getDocs(userCollection(userId, 'clients')),
    getDocs(userCollection(userId, 'events')),
    getDocs(userCollection(userId, 'customItems')),
  ]);
  return {
    schema: 'proquote.backup',
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    userId,
    rates: ratesSnap.exists() ? (ratesSnap.data().values || {}) : {},
    quotes: quotesSnap.docs.map((d) => ({ ...d.data(), id: d.id })),
    clients: clientsSnap.docs.map((d) => ({ ...d.data(), id: d.id })),
    events: eventsSnap.docs.map((d) => ({ ...d.data(), id: d.id })),
    customItems: customItemsSnap.docs.map((d) => ({ ...d.data(), id: d.id })),
  };
}

export async function importAllUserData(userId, backup) {
  if (!backup || backup.schema !== 'proquote.backup') {
    throw new Error('קובץ הגיבוי לא תקין');
  }
  const ops = [];
  if (backup.rates) {
    ops.push(setDoc(userDoc(userId, 'meta', 'rates'), { values: backup.rates }));
  }
  const collections = [
    ['quotes', backup.quotes],
    ['clients', backup.clients],
    ['events', backup.events],
    ['customItems', backup.customItems],
  ];
  for (const [name, items] of collections) {
    if (!items) continue;
    for (const item of items) {
      const { id, ...rest } = item;
      const docId = id || `${name}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      ops.push(setDoc(userDoc(userId, name, docId), rest));
    }
  }
  await Promise.all(ops);
  return {
    rates: backup.rates ? Object.keys(backup.rates).length : 0,
    quotes: backup.quotes ? backup.quotes.length : 0,
    clients: backup.clients ? backup.clients.length : 0,
    events: backup.events ? backup.events.length : 0,
    customItems: backup.customItems ? backup.customItems.length : 0,
  };
}

// ---- One-time on-device -> cloud migration ----
// Before this Firestore migration, all data above lived only in AsyncStorage under
// these same key names. This copies whatever is already sitting on the device into
// Firestore exactly once per account (guarded by a flag), so nothing is lost when a
// user's data moves from local-only to cloud-backed storage.

const LOCAL_SYNCED_FLAG_PREFIX = 'stavelectric.firestoreSynced.';
const legacyRatesKey = (userId) => `stavelectric.rates.${userId}.v2`;
const legacyQuotesKey = (userId) => `stavelectric.quotes.${userId}.v2`;
const legacyClientsKey = (userId) => `stavelectric.clients.${userId}.v1`;
const legacyEventsKey = (userId) => `stavelectric.events.${userId}.v1`;
const legacyCustomItemsKey = (userId) => `stavelectric.customItems.${userId}.v1`;

// Pure AsyncStorage-to-AsyncStorage copy: carries a pre-Firebase local account's data
// (keyed by its old username) over to the new Firebase-uid keys, entirely on-device.
// Does not touch Firestore — migrateLocalDataToFirestore (below) handles that next.
export async function copyLegacyLocalData(oldUserId, newUserId) {
  const [ratesRaw, quotesRaw, clientsRaw, eventsRaw, customItemsRaw] = await Promise.all([
    AsyncStorage.getItem(legacyRatesKey(oldUserId)),
    AsyncStorage.getItem(legacyQuotesKey(oldUserId)),
    AsyncStorage.getItem(legacyClientsKey(oldUserId)),
    AsyncStorage.getItem(legacyEventsKey(oldUserId)),
    AsyncStorage.getItem(legacyCustomItemsKey(oldUserId)),
  ]);
  const ops = [];
  if (ratesRaw) ops.push(AsyncStorage.setItem(legacyRatesKey(newUserId), ratesRaw));
  if (quotesRaw) ops.push(AsyncStorage.setItem(legacyQuotesKey(newUserId), quotesRaw));
  if (clientsRaw) ops.push(AsyncStorage.setItem(legacyClientsKey(newUserId), clientsRaw));
  if (eventsRaw) ops.push(AsyncStorage.setItem(legacyEventsKey(newUserId), eventsRaw));
  if (customItemsRaw) ops.push(AsyncStorage.setItem(legacyCustomItemsKey(newUserId), customItemsRaw));
  await Promise.all(ops);
}

export async function migrateLocalDataToFirestore(userId) {
  if (!userId) return;
  try {
    const flagKey = LOCAL_SYNCED_FLAG_PREFIX + userId;
    if (await AsyncStorage.getItem(flagKey)) return;

    const [ratesRaw, quotesRaw, clientsRaw, eventsRaw, customItemsRaw] = await Promise.all([
      AsyncStorage.getItem(legacyRatesKey(userId)),
      AsyncStorage.getItem(legacyQuotesKey(userId)),
      AsyncStorage.getItem(legacyClientsKey(userId)),
      AsyncStorage.getItem(legacyEventsKey(userId)),
      AsyncStorage.getItem(legacyCustomItemsKey(userId)),
    ]);

    const ops = [];
    if (ratesRaw) {
      const { rates } = migrateRates(JSON.parse(ratesRaw));
      ops.push(setDoc(userDoc(userId, 'meta', 'rates'), { values: rates }));
    }
    const collectionRaws = [
      ['quotes', quotesRaw],
      ['clients', clientsRaw],
      ['events', eventsRaw],
      ['customItems', customItemsRaw],
    ];
    for (const [name, raw] of collectionRaws) {
      if (!raw) continue;
      for (const item of JSON.parse(raw)) {
        const { id, ...rest } = item;
        if (!id) continue;
        ops.push(setDoc(userDoc(userId, name, id), rest));
      }
    }
    await Promise.all(ops);
    await AsyncStorage.setItem(flagKey, '1');
  } catch (e) {
    // Best-effort; never block the app on this.
  }
}

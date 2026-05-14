import AsyncStorage from '@react-native-async-storage/async-storage';

const ratesKey = (userId) => `stavelectric.rates.${userId}.v2`;
const quotesKey = (userId) => `stavelectric.quotes.${userId}.v2`;

export async function loadRates(userId) {
  if (!userId) return {};
  try {
    const raw = await AsyncStorage.getItem(ratesKey(userId));
    return raw ? JSON.parse(raw) : {};
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

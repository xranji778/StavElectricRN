import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const USERS_KEY = 'stavelectric.users.v1';
const SESSION_KEY = 'stavelectric.session.v1';
const HASH_ITERATIONS = 1000;
const HASH_VERSION = 1;

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function generateSalt() {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return bytesToHex(bytes);
}

async function hashPassword(password, salt) {
  let current = `${salt}:${password}`;
  for (let i = 0; i < HASH_ITERATIONS; i += 1) {
    current = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      current,
    );
  }
  return current;
}

export const PROFESSION_IDS = ['electrician', 'plumber', 'comms', 'contractor'];

export const PROFESSIONS = [
  { id: 'electrician', label: 'חשמלאי', icon: 'electrical-services', emoji: '👷' },
  { id: 'plumber', label: 'אינסטלטור', icon: 'plumbing', emoji: '🔧' },
  { id: 'comms', label: 'איש תקשורת', icon: 'router', emoji: '📡' },
  { id: 'contractor', label: 'שיפוצניק', icon: 'construction', emoji: '🎨' },
];

async function readUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

async function writeUsers(users) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeUsername(u) {
  return String(u || '').trim().toLowerCase();
}

function validateEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  if (!phone) return true;
  return /^[\d\s\-+()]{6,20}$/.test(phone);
}

function sanitizeProfessions(list) {
  if (!Array.isArray(list)) return ['electrician'];
  const cleaned = list.filter((p) => PROFESSION_IDS.includes(p));
  return cleaned.length > 0 ? Array.from(new Set(cleaned)) : ['electrician'];
}

export async function register({ displayName, username, password, email, phone, professions }) {
  const name = String(displayName || '').trim();
  const u = normalizeUsername(username);
  const p = String(password || '');
  const em = String(email || '').trim();
  const ph = String(phone || '').trim();
  const profs = sanitizeProfessions(professions);

  if (!name) throw new Error('יש להזין שם תצוגה');
  if (u.length < 4) throw new Error('שם משתמש חייב להיות לפחות 4 תווים');
  if (!/^[a-z0-9_.-]+$/.test(u)) throw new Error('שם משתמש: רק אותיות באנגלית, ספרות, ונקודה/קו-תחתון');
  if (p.length < 8) throw new Error('סיסמה חייבת להיות לפחות 8 תווים');
  if (!/[A-Za-z]/.test(p)) throw new Error('הסיסמה חייבת לכלול לפחות אות אחת');
  if (!/[0-9]/.test(p)) throw new Error('הסיסמה חייבת לכלול לפחות ספרה אחת');
  if (em && !validateEmail(em)) throw new Error('אימייל לא תקין');
  if (ph && !validatePhone(ph)) throw new Error('מספר טלפון לא תקין');

  const users = await readUsers();
  if (users.some((x) => x.username === u)) {
    throw new Error('שם המשתמש כבר תפוס');
  }

  const passwordSalt = await generateSalt();
  const passwordHash = await hashPassword(p, passwordSalt);

  const user = {
    id: u,
    username: u,
    displayName: name,
    passwordHash,
    passwordSalt,
    hashVersion: HASH_VERSION,
    email: em || null,
    phone: ph || null,
    professions: profs,
    activeProfession: profs[0],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  await AsyncStorage.setItem(SESSION_KEY, u);
  return publicUser(user);
}

export async function login({ username, password }) {
  const u = normalizeUsername(username);
  const p = String(password || '');
  if (!u || !p) throw new Error('יש להזין שם משתמש וסיסמה');

  const users = await readUsers();
  const idx = users.findIndex((x) => x.username === u);
  if (idx < 0) {
    throw new Error('שם משתמש או סיסמה שגויים');
  }
  const match = users[idx];

  let ok = false;
  if (match.passwordHash && match.passwordSalt) {
    const candidate = await hashPassword(p, match.passwordSalt);
    ok = candidate === match.passwordHash;
  } else if (typeof match.password === 'string') {
    // Legacy plaintext user — verify, then upgrade to hashed on the fly.
    ok = match.password === p;
    if (ok) {
      const passwordSalt = await generateSalt();
      const passwordHash = await hashPassword(p, passwordSalt);
      const upgraded = { ...match, passwordHash, passwordSalt, hashVersion: HASH_VERSION };
      delete upgraded.password;
      users[idx] = upgraded;
      await writeUsers(users);
    }
  }

  if (!ok) {
    throw new Error('שם משתמש או סיסמה שגויים');
  }
  await AsyncStorage.setItem(SESSION_KEY, u);
  return publicUser(users[idx]);
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser() {
  const sessionId = await AsyncStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  const users = await readUsers();
  const match = users.find((x) => x.username === sessionId);
  return match ? publicUser(match) : null;
}

export async function updateProfile(userId, patch) {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) throw new Error('המשתמש לא נמצא');

  const current = users[idx];
  const name = patch.displayName !== undefined ? String(patch.displayName).trim() : current.displayName;
  const em = patch.email !== undefined ? String(patch.email).trim() : (current.email || '');
  const ph = patch.phone !== undefined ? String(patch.phone).trim() : (current.phone || '');
  const businessName = patch.businessName !== undefined
    ? String(patch.businessName).trim()
    : (current.businessName || '');
  const licenseNumber = patch.licenseNumber !== undefined
    ? String(patch.licenseNumber).trim()
    : (current.licenseNumber || '');
  const address = patch.address !== undefined
    ? String(patch.address).trim()
    : (current.address || '');
  const bitPhone = patch.bitPhone !== undefined
    ? String(patch.bitPhone).trim()
    : (current.bitPhone || '');

  if (patch.displayName !== undefined && !name) throw new Error('שם תצוגה לא יכול להיות ריק');
  if (em && !validateEmail(em)) throw new Error('אימייל לא תקין');
  if (ph && !validatePhone(ph)) throw new Error('מספר טלפון לא תקין');

  let professions = current.professions;
  let activeProfession = current.activeProfession;
  if (patch.professions !== undefined) {
    professions = sanitizeProfessions(patch.professions);
    if (!professions.includes(activeProfession)) {
      activeProfession = professions[0];
    }
  }
  if (patch.activeProfession !== undefined) {
    if (PROFESSION_IDS.includes(patch.activeProfession) && professions.includes(patch.activeProfession)) {
      activeProfession = patch.activeProfession;
    }
  }

  users[idx] = {
    ...current,
    displayName: name,
    email: em || null,
    phone: ph || null,
    businessName: businessName || null,
    licenseNumber: licenseNumber || null,
    address: address || null,
    bitPhone: bitPhone || null,
    professions,
    activeProfession,
  };
  await writeUsers(users);
  return publicUser(users[idx]);
}

export async function setActiveProfession(userId, professionId) {
  return updateProfile(userId, { activeProfession: professionId });
}

function publicUser(u) {
  // Migrate legacy users that don't have professions yet
  const professions = sanitizeProfessions(u.professions);
  const activeProfession = professions.includes(u.activeProfession)
    ? u.activeProfession
    : professions[0];
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    email: u.email || null,
    phone: u.phone || null,
    businessName: u.businessName || null,
    licenseNumber: u.licenseNumber || null,
    address: u.address || null,
    bitPhone: u.bitPhone || null,
    professions,
    activeProfession,
    createdAt: u.createdAt,
  };
}

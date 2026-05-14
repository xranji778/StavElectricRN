import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'stavelectric.users.v1';
const SESSION_KEY = 'stavelectric.session.v1';

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

export async function register({ displayName, username, password, email, phone }) {
  const name = String(displayName || '').trim();
  const u = normalizeUsername(username);
  const p = String(password || '');
  const em = String(email || '').trim();
  const ph = String(phone || '').trim();

  if (!name) throw new Error('יש להזין שם תצוגה');
  if (u.length < 4) throw new Error('שם משתמש חייב להיות לפחות 4 תווים');
  if (!/^[a-z0-9_.-]+$/.test(u)) throw new Error('שם משתמש: רק אותיות באנגלית, ספרות, ונקודה/קו-תחתון');
  if (p.length < 6) throw new Error('סיסמה חייבת להיות לפחות 6 תווים');
  if (em && !validateEmail(em)) throw new Error('אימייל לא תקין');
  if (ph && !validatePhone(ph)) throw new Error('מספר טלפון לא תקין');

  const users = await readUsers();
  if (users.some((x) => x.username === u)) {
    throw new Error('שם המשתמש כבר תפוס');
  }

  const user = {
    id: u,
    username: u,
    displayName: name,
    password: p,
    email: em || null,
    phone: ph || null,
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
  const match = users.find((x) => x.username === u);
  if (!match || match.password !== p) {
    throw new Error('שם משתמש או סיסמה שגויים');
  }
  await AsyncStorage.setItem(SESSION_KEY, u);
  return publicUser(match);
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

  const name = patch.displayName !== undefined ? String(patch.displayName).trim() : users[idx].displayName;
  const em = patch.email !== undefined ? String(patch.email).trim() : (users[idx].email || '');
  const ph = patch.phone !== undefined ? String(patch.phone).trim() : (users[idx].phone || '');

  if (patch.displayName !== undefined && !name) throw new Error('שם תצוגה לא יכול להיות ריק');
  if (em && !validateEmail(em)) throw new Error('אימייל לא תקין');
  if (ph && !validatePhone(ph)) throw new Error('מספר טלפון לא תקין');

  users[idx] = {
    ...users[idx],
    displayName: name,
    email: em || null,
    phone: ph || null,
  };
  await writeUsers(users);
  return publicUser(users[idx]);
}

function publicUser(u) {
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    email: u.email || null,
    phone: u.phone || null,
    createdAt: u.createdAt,
  };
}

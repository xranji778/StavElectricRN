import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
} from '@firebase/auth';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { copyLegacyLocalData, migrateLocalDataToFirestore } from './storage';

const LEGACY_USERS_KEY = 'stavelectric.users.v1';
const LEGACY_MIGRATED_PREFIX = 'stavelectric.legacyMigrated.';

export const PROFESSION_IDS = ['electrician', 'plumber', 'comms', 'contractor'];

export const PROFESSIONS = [
  { id: 'electrician', label: 'חשמלאי', icon: 'electrical-services', emoji: '👷' },
  { id: 'plumber', label: 'אינסטלטור', icon: 'plumbing', emoji: '🔧' },
  { id: 'comms', label: 'איש תקשורת', icon: 'router', emoji: '📡' },
  { id: 'contractor', label: 'שיפוצניק', icon: 'construction', emoji: '🎨' },
];

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
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

function mapAuthError(e) {
  const code = e?.code || '';
  const messages = {
    'auth/email-already-in-use': 'כתובת האימייל הזו כבר רשומה במערכת',
    'auth/invalid-email': 'כתובת אימייל לא תקינה',
    'auth/weak-password': 'הסיסמה חלשה מדי',
    'auth/invalid-credential': 'אימייל או סיסמה שגויים',
    'auth/user-not-found': 'אימייל או סיסמה שגויים',
    'auth/wrong-password': 'אימייל או סיסמה שגויים',
    'auth/too-many-requests': 'יותר מדי ניסיונות — נסה שוב בעוד כמה דקות',
    'auth/network-request-failed': 'בעיית תקשורת — בדוק את החיבור לאינטרנט',
  };
  return new Error(messages[code] || e?.message || 'אירעה שגיאה');
}

// One-time, best-effort copy of this device's pre-Firebase local data (rates/quotes/
// clients/events/customItems) from the old username-keyed storage into the new
// Firebase-uid-keyed storage, so nothing appears to vanish when switching accounts.
// Non-destructive: the old data is left untouched. Full Firestore cloud sync is a
// separate, later step — this only keeps the existing on-device data reachable.
async function migrateLegacyDataIfNeeded(firebaseUser) {
  try {
    const flagKey = LEGACY_MIGRATED_PREFIX + firebaseUser.uid;
    const already = await AsyncStorage.getItem(flagKey);
    if (already) return;

    const raw = await AsyncStorage.getItem(LEGACY_USERS_KEY);
    const legacyUsers = raw ? JSON.parse(raw) : [];
    if (legacyUsers.length > 0) {
      const email = (firebaseUser.email || '').toLowerCase();
      let match = email ? legacyUsers.find((u) => (u.email || '').toLowerCase() === email) : null;
      if (!match && legacyUsers.length === 1) {
        match = legacyUsers[0];
      }
      if (match) {
        await copyLegacyLocalData(match.id, firebaseUser.uid);
      }
    }
    await AsyncStorage.setItem(flagKey, '1');
  } catch (e) {
    // Never let this block login/registration.
  }
}

async function fetchProfileDoc(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    return null;
  }
}

function publicUser(fbUser, profileData) {
  const professions = sanitizeProfessions(profileData?.professions);
  const activeProfession = professions.includes(profileData?.activeProfession)
    ? profileData.activeProfession
    : professions[0];
  return {
    id: fbUser.uid,
    email: fbUser.email,
    emailVerified: !!fbUser.emailVerified,
    displayName: profileData?.displayName || fbUser.displayName || '',
    businessName: profileData?.businessName || null,
    phone: profileData?.phone || null,
    licenseNumber: profileData?.licenseNumber || null,
    address: profileData?.address || null,
    bitPhone: profileData?.bitPhone || null,
    professions,
    activeProfession,
    createdAt: profileData?.createdAt || null,
  };
}

export async function register({ displayName, email, password, phone, professions }) {
  const name = String(displayName || '').trim();
  const em = String(email || '').trim();
  const p = String(password || '');
  const ph = String(phone || '').trim();
  const profs = sanitizeProfessions(professions);

  if (!name) throw new Error('יש להזין שם תצוגה');
  if (!validateEmail(em)) throw new Error('כתובת אימייל לא תקינה');
  if (p.length < 8) throw new Error('סיסמה חייבת להיות לפחות 8 תווים');
  if (!/[A-Za-z]/.test(p)) throw new Error('הסיסמה חייבת לכלול לפחות אות אחת');
  if (!/[0-9]/.test(p)) throw new Error('הסיסמה חייבת לכלול לפחות ספרה אחת');
  if (ph && !validatePhone(ph)) throw new Error('מספר טלפון לא תקין');

  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, em, p);
  } catch (e) {
    throw mapAuthError(e);
  }

  const profileData = {
    displayName: name,
    phone: ph || null,
    businessName: null,
    licenseNumber: null,
    address: null,
    bitPhone: null,
    professions: profs,
    activeProfession: profs[0],
    createdAt: new Date().toISOString(),
  };

  await Promise.all([
    setDoc(doc(db, 'users', cred.user.uid), profileData),
    updateAuthProfile(cred.user, { displayName: name }).catch(() => {}),
    sendEmailVerification(cred.user).catch(() => {}),
  ]);

  await migrateLegacyDataIfNeeded(cred.user);
  await migrateLocalDataToFirestore(cred.user.uid);
  return publicUser(cred.user, profileData);
}

export async function login({ email, password }) {
  const em = String(email || '').trim();
  const p = String(password || '');
  if (!em || !p) throw new Error('יש להזין אימייל וסיסמה');

  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, em, p);
  } catch (e) {
    throw mapAuthError(e);
  }

  await migrateLegacyDataIfNeeded(cred.user);
  await migrateLocalDataToFirestore(cred.user.uid);
  const profileData = await fetchProfileDoc(cred.user.uid);
  return publicUser(cred.user, profileData);
}

export async function logout() {
  await signOut(auth);
}

export async function getCurrentUser() {
  const fbUser = auth.currentUser;
  if (!fbUser) return null;
  const profileData = await fetchProfileDoc(fbUser.uid);
  return publicUser(fbUser, profileData);
}

export async function resetPassword(email) {
  const em = String(email || '').trim();
  if (!validateEmail(em)) throw new Error('כתובת אימייל לא תקינה');
  try {
    await sendPasswordResetEmail(auth, em);
  } catch (e) {
    throw mapAuthError(e);
  }
}

export async function resendVerificationEmail() {
  if (!auth.currentUser) return;
  await sendEmailVerification(auth.currentUser).catch(() => {});
}

export async function updateProfile(userId, patch) {
  const current = (await fetchProfileDoc(userId)) || {};

  const name = patch.displayName !== undefined ? String(patch.displayName).trim() : current.displayName;
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
  if (ph && !validatePhone(ph)) throw new Error('מספר טלפון לא תקין');

  let professions = sanitizeProfessions(current.professions);
  let activeProfession = professions.includes(current.activeProfession)
    ? current.activeProfession
    : professions[0];
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

  const next = {
    ...current,
    displayName: name,
    phone: ph || null,
    businessName: businessName || null,
    licenseNumber: licenseNumber || null,
    address: address || null,
    bitPhone: bitPhone || null,
    professions,
    activeProfession,
  };

  await setDoc(doc(db, 'users', userId), next);
  if (patch.displayName !== undefined && auth.currentUser) {
    await updateAuthProfile(auth.currentUser, { displayName: name }).catch(() => {});
  }
  return publicUser(auth.currentUser, next);
}

export async function setActiveProfession(userId, professionId) {
  return updateProfile(userId, { activeProfession: professionId });
}

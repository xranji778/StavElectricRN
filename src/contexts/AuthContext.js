import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import * as authApi from '../data/auth';
import { migrateLocalDataToFirestore } from '../data/storage';

const AuthContext = createContext(null);

async function buildUserFromFirebase(fbUser) {
  if (!fbUser) return null;
  let profileData = null;
  try {
    const snap = await getDoc(doc(db, 'users', fbUser.uid));
    profileData = snap.exists() ? snap.data() : null;
  } catch (e) {
    profileData = null;
  }
  const professions = Array.isArray(profileData?.professions) && profileData.professions.length > 0
    ? profileData.professions
    : ['electrician'];
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Safety net for restored sessions (app restart) — a no-op if already synced.
        await migrateLocalDataToFirestore(fbUser.uid);
      }
      const u = await buildUserFromFirebase(fbUser);
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (credentials) => {
    const u = await authApi.login(credentials);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const u = await authApi.register(data);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateProfile = async (patch) => {
    if (!user) return null;
    const updated = await authApi.updateProfile(user.id, patch);
    setUser(updated);
    return updated;
  };

  const switchProfession = async (professionId) => {
    if (!user) return null;
    if (!user.professions?.includes(professionId)) return user;
    const updated = await authApi.setActiveProfession(user.id, professionId);
    setUser(updated);
    return updated;
  };

  const resetPassword = async (email) => {
    await authApi.resetPassword(email);
  };

  const resendVerificationEmail = async () => {
    await authApi.resendVerificationEmail();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        switchProfession,
        resetPassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

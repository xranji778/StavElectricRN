// NOTE: importing from the scoped @firebase/* packages, not the `firebase` wrapper —
// the wrapper's exports map doesn't route to the React Native builds for auth/firestore
// in this SDK version, so getReactNativePersistence / the RN Firestore cache would be missing.
import { initializeApp } from '@firebase/app';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { initializeFirestore, persistentLocalCache } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCL7FWD4eiz6_fnOZ8m8nH9fxlXRkxDrLM',
  authDomain: 'stavelectricrn.firebaseapp.com',
  projectId: 'stavelectricrn',
  storageBucket: 'stavelectricrn.firebasestorage.app',
  messagingSenderId: '352131220288',
  appId: '1:352131220288:web:bb9eb94599075023fa70a5',
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache(),
});

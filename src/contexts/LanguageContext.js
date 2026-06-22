import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES, translate, isRtl } from '../i18n/translations';

const LANG_KEY = 'stavelectric.lang.v1';
const DEFAULT_LANG = 'he';

// Multi-language UI paused 2026-05-17 — locked to Hebrew. To re-enable, see
// memory/stavelectric_i18n_paused.md (or restore the original implementation
// from git history of this file).
const LOCKED_LANG = 'he';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(LOCKED_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    applyRTL(LOCKED_LANG);
    setLangState(LOCKED_LANG);
    setReady(true);
  }, []);

  // No-op while feature is paused. Kept exported so callers don't break.
  const setLang = useCallback(async () => {}, []);

  const t = useCallback((key, params) => translate(lang, key, params), [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, isRTL: isRtl(lang), ready }),
    [lang, setLang, t, ready],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function applyRTL(code) {
  const shouldBeRTL = isRtl(code);
  try {
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
    }
  } catch (e) {}
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES, translate, isRtl } from '../i18n/translations';

const LANG_KEY = 'stavelectric.lang.v1';
const DEFAULT_LANG = 'he';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANG_KEY);
        const code = saved && LANGUAGES.some((l) => l.code === saved) ? saved : DEFAULT_LANG;
        applyRTL(code);
        setLangState(code);
      } catch (e) {
        applyRTL(DEFAULT_LANG);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLang = useCallback(async (code) => {
    if (!LANGUAGES.some((l) => l.code === code)) return;
    await AsyncStorage.setItem(LANG_KEY, code);
    applyRTL(code);
    setLangState(code);
  }, []);

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

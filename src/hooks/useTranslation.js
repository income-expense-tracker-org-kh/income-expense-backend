import { useState, useEffect, useCallback } from 'react';
import enTranslations from '../locales/en.json';
import kmTranslations from '../locales/km.json';
import zhTranslations from '../locales/zh.json';

const translations = {
  en: enTranslations,
  km: kmTranslations,
  zh: zhTranslations,
};

export const useTranslation = (currentLang = 'en') => {
  const [lang, setLang] = useState(currentLang);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Replace parameters in translation
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value || key;
  }, [lang]);

  const changeLanguage = useCallback((newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('app_language', newLang);
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  return { t, lang, changeLanguage };
};

export default useTranslation;

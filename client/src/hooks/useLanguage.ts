import { useState, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/translations';

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved === 'id' || saved === 'en') ? saved : 'id';
    }
    return 'id';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLang);
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const t = (key: TranslationKey): string => {
    return translations[currentLang]?.[key] || key;
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    setCurrentLang(newLang);
  };

  const flagIcon = currentLang === 'id' ? '🇮🇩' : '🇬🇧';
  const langText = currentLang === 'id' ? 'ID' : 'EN';

  return {
    currentLang,
    t,
    toggleLanguage,
    flagIcon,
    langText
  };
}

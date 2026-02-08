
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Check local storage first
    const stored = localStorage.getItem('codemaster_language');
    if (stored && ['en', 'de', 'es'].includes(stored)) {
      return stored;
    }
    // Fallback to browser language or default to 'en'
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'de', 'es'].includes(browserLang) ? browserLang : 'en';
  });

  useEffect(() => {
    localStorage.setItem('codemaster_language', language);
  }, [language]);

  const t = (path, params = {}) => {
    const keys = path.split('.');
    let value = translations[language];
    
    for (const key of keys) {
      value = value?.[key];
      if (!value) return path; // Return key if translation missing
    }

    if (typeof value === 'string') {
      Object.entries(params).forEach(([key, val]) => {
        value = value.replace(`{${key}}`, val);
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

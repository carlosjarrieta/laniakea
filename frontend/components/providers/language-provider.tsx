"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useTranslationStore } from '@/store/useTranslationStore';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale, setLocale, fetchTranslations } = useTranslationStore();

  // Sincronizar con localStorage al inicio y forzar una actualización
  // para capturar nuevas llaves que hayamos añadido en el backend
  useEffect(() => {
    fetchTranslations(locale, true);
  }, [locale, fetchTranslations]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import { useEffect } from 'react';
import { useTranslationStore } from '@/store/useTranslationStore';

export const useTranslations = (locale: string = 'es') => {
  const { translations, isLoading, fetchTranslations } = useTranslationStore();

  useEffect(() => {
    fetchTranslations(locale);
  }, [locale, fetchTranslations]);

  const t = (key: string, params?: Record<string, any>) => {
    const localeTranslations = translations[locale];
    
    // Si no hay traducciones cargadas aún, devolvemos un espacio en blanco para evitar ver la "key"
    if (!localeTranslations) return '';
    
    let value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : key, localeTranslations);
    
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        value = (value as string).replace(`%{${k}}`, String(v));
      });
    }
    
    return value;
  };

  return { t, isLoading };
};

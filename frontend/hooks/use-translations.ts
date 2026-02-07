import { useState, useEffect } from 'react';
import api from '@/lib/api';

export const useTranslations = (locale: string = 'es') => {
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await api.get(`/locales/${locale}`);
        setTranslations(response.data);
      } catch (error) {
        console.error('Error fetching translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [locale]);

  const t = (key: string, params?: Record<string, any>) => {
    if (!translations) return key;
    
    let value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : key, translations);
    
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        value = (value as string).replace(`%{${k}}`, String(v));
      });
    }
    
    return value;
  };

  return { t, isLoading };
};

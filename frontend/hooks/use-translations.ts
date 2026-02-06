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

  const t = (key: string) => {
    if (!translations) return key;
    
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : key, translations);
  };

  return { t, isLoading };
};

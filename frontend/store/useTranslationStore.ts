import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';

interface TranslationState {
  translations: Record<string, any>;
  isLoading: boolean;
  locale: string;
  fetchTranslations: (locale: string, force?: boolean) => Promise<void>;
  setLocale: (locale: string) => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      translations: {},
      isLoading: false,
      locale: 'es',
      setLocale: (locale) => set({ locale }),
      fetchTranslations: async (locale: string, force = false) => {
        // Si ya está cargando, no hacer nada
        if (get().isLoading) return;
        
        // Si ya tenemos las traducciones y no es forzado, no hacemos el fetch
        // Pero en desarrollo o cuando añadimos llaves, a veces queremos forzar
        if (get().translations[locale] && !force) {
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get(`/locales/${locale}`);
          set((state) => ({
            translations: { 
              ...state.translations, 
              [locale]: response.data 
            },
            isLoading: false
          }));
        } catch (error) {
          console.error('Error fetching translations:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'laniakea-translations',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ translations: state.translations, locale: state.locale }),
    }
  )
);

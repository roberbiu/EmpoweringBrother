/**
 * i18n Hook
 * Provides internationalization support throughout the app
 */

import { create } from 'zustand';
import {
  type Language,
  type Translations,
  getTranslations,
  loadLanguage,
  saveLanguage,
} from '../i18n';

interface I18nStore {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useI18n = create<I18nStore>()((set, get) => {
  const initialLang = loadLanguage();

  return {
    language: initialLang,
    t: getTranslations(initialLang),

    setLanguage: (lang: Language) => {
      saveLanguage(lang);
      set({
        language: lang,
        t: getTranslations(lang),
      });
    },

    toggleLanguage: () => {
      const current = get().language;
      const newLang: Language = current === 'zh' ? 'en' : 'zh';
      get().setLanguage(newLang);
    },
  };
});

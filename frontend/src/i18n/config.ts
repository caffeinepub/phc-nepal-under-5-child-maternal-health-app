import { en } from './translations/en';
import { hi } from './translations/hi';
import { ne } from './translations/ne';

export type Language = 'en' | 'hi' | 'ne';

const translations = { en, hi, ne };

const LANG_KEY = 'phc_language';

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'en' || stored === 'hi' || stored === 'ne') return stored;
  } catch {
    // ignore
  }
  return 'en';
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}

export function getTranslations(lang: Language) {
  return translations[lang] || translations.en;
}

export type Translations = typeof en;

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
}

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language if detection fails
    supportedLngs: ['en', 'fr', 'ar'],
    interpolation: {
      escapeValue: false, // React already safe against XSS
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    // Set text direction based on language
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      useSuspense: false,
    }
  })

// Add directional setting to HTML for RTL languages (Arabic)
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng)
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr')
})

export default i18n

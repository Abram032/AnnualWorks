import i18next from "i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationPL from './locales/pl.json';
import translationEN from './locales/en.json';

const resources = {
  pl: {
    translation: translationPL
  },
  en: {
    translation: translationEN
  }
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "pl",
    fallbackLng: "pl",
    resources
  });

export default i18n;

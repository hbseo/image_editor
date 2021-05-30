import i18n from "i18next"
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from './en/english'
import translationKo from './ko/korean'
const resource =  {
    en: {
        translation: translationEn
    },
    ko: {
        translation: translationKo
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)  // passes i18n down to react-i18next
    .init({
        resources: resource,
        lng: localStorage.getItem("i18nextLng") || "en",
        fallbackLng: 'en',
        useLocalStorage: true,
        localStorageExpirationTime: 86400000,
        // ns: ['translation'],
        // defaultNS: "translation",
        debug: false,
        // debug: true,
        // keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
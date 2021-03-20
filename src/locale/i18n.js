import i18n from "i18next"
import {initReactI18next} from "react-i18next";

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
    .use(initReactI18next)  // passes i18n down to react-i18next
    .init({
        resources: resource,
        lng: "ko",
        fallbackLng: 'ko',
        // ns: ['translation'],
        // defaultNS: "translation",
        debug: true,
        // keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
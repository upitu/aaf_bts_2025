import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// This is the configuration for i18next
i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // The resources object contains your translations
        resources: {
            en: {
                translation: {
                    // English content will go here
                    skip_video: "Skip Video"
                }
            },
            ar: {
                translation: {
                    // Arabic content will go here
                    skip_video: "تخطي الفيديو"
                }
            }
        },
        lng: "en", // default language
        fallbackLng: "en", // fallback language if a translation is missing
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;

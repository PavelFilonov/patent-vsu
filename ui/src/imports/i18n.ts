import i18n, {Resource} from 'i18next'
import {getResources} from '../assets/i18n'

export function initLocale(lang: string, customDictionary: Resource) {
    i18n
        // .use(initReactI18next)
        .init({
            resources: getResources(customDictionary),
            lng: lang,
            keySeparator: false,
            interpolation: {
                escapeValue: false
            }
        })
    return i18n
}

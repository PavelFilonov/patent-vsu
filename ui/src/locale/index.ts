export const lang = 'ru'
export const storageLocalName = 'ru'

/**
 * TODO: Connect with language picker
 */
export function getLocale() {
    return localStorage.getItem(storageLocalName) || lang
}

export function setLocale(str: string) {
    localStorage.setItem(storageLocalName, str)
}

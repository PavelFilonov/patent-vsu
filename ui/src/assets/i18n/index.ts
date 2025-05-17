import {Resource} from 'i18next'
import ru from './ru.json'

const smLanguageResources: Resource = {
    ru
}

export function getResources(customDictionary: Resource) {
    const result = {...smLanguageResources}
    if (!customDictionary) {
        return result
    }
    Object.keys(customDictionary).forEach(code => {
        const core = (smLanguageResources[code]?.translation || {}) as Record<string, string>
        const custom = customDictionary[code].translation as Record<string, string>
        result[code] = {
            translation: {
                ...core,
                ...custom
            }
        }
    })
    return result
}

export default smLanguageResources

import qs from 'query-string'
import {BcFilter, FilterType} from '@tesler-ui/core/interfaces/filters'

export function parseFilters(defaultFilters: string) {
    const result: BcFilter[] = []
    const urlParams = qs.parse(defaultFilters)
    Object.keys(urlParams).forEach(param => {
        const [fieldName, type] = param.split('.')
        if (fieldName && type && urlParams[param]) {
            let value = urlParams[param]
            if (type === FilterType.containsOneOf || type === FilterType.equalsOneOf) {
                try {
                    value = JSON.parse(value)
                } catch (e) {
                    console.warn(e)
                }
                value = Array.isArray(value) ? value : []
            }
            result.push({
                fieldName,
                type: type as FilterType,
                value
            })
        }
    })
    return result.length ? result : null
}

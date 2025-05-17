import qs from 'query-string'

type QueryParamsMap = Record<string, string | number>

function dropEmptyOrWrongParams(qso: QueryParamsMap) {
    const result: QueryParamsMap = {...qso}

    return Object.keys(result).reduce((prev, paramKey) => {
        if (!prev[paramKey] && typeof prev[paramKey] !== 'number') {
            delete prev[paramKey]
        }
        return prev
    }, result)
}

export function addTailControlSequences(url: string) {
    return !url.includes('?') ? `${url}?` : `${url}&`
}

export function applyRawParams(url: string, qso: Record<string, unknown>) {
    if (!qso) {
        return url
    }
    const result = qs.stringify(qso, {encode: true})
    return `${addTailControlSequences(url)}${result && `${result}`}`
}

export function applyParams(url: string, qso: QueryParamsMap) {
    if (!qso) {
        return url
    }
    return applyRawParams(url, dropEmptyOrWrongParams(qso))
}

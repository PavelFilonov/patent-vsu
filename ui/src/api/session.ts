import {$do, axiosGet, buildUrl, getStoreInstance} from '@tesler-ui/core'
import {LoginResponse} from '@tesler-ui/core/interfaces/session'
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {Observable} from 'rxjs/Observable'
import {getLocale} from '../locale'
import {TeslerSessionState, LanguagesResponse, LaLanguagesResponse} from '../interfaces/session'

import {AppState} from '../interfaces/reducers'

const __API__ = '/api/v1/'
const __API_SSO__ = '/api/'
const __AJAX_TIMEOUT__ = 900000
const __CLIENT_ID__: number = Date.now()

export const axiosInstanceSSO = createAxiosInstance({baseURL: __API_SSO__})

export const HEADERS = {Pragma: 'no-cache', 'Cache-Control': 'no-cache, no-store, must-revalidate'}

export function ssoAuth() {
    return Observable.fromPromise(axiosInstanceSSO.get<any>('login/oauth2/code/', {}))
        .takeWhile(redirectOccurred)
        .map(response => response.data)
}

export function getSwitchRoleRequest(role: string) {
    return axiosGet(buildUrl`login?role=${role}`)
}

export function getBasicAuthRequest(login?: string, password?: string) {
    const hash = new Buffer(`${login}:${password}`).toString('base64')
    const tzOffset = -new Date().getTimezoneOffset() * 60
    const entrypointUrl = `/${window.location.hash}`
    return axiosGet<LoginResponse>(buildUrl`login?_tzoffset=${tzOffset}&_entrypointUrl=${entrypointUrl}&_languageCd=${getLocale()}`, {
        headers: {Authorization: `Basic ${hash}`}
    })
}

export function getLanguagesList() {
    return axiosGet<LanguagesResponse>(buildUrl`languages`)
}

export function getLaLanguages(cursor: string) {
    return axiosGet<LaLanguagesResponse>(buildUrl`la-languages?id=${cursor}`)
}

export function logout() {
    return axiosGet(buildUrl`logout`)
}

function useLanguageCdInterceptor(rqConfig: AxiosRequestConfig) {
    const exceptUrls = ['login', 'languages', 'la-languages']
    const masterLangCodes = ['en', 'eng']
    const storeInstance = getStoreInstance().getState()
    const suitableForLanguageContext = !exceptUrls.some(i => rqConfig.url.startsWith(i))
    const notMasterLanguageContext = !masterLangCodes.includes((storeInstance.session as TeslerSessionState).languageCd)
    const languageContextCondition = suitableForLanguageContext && notMasterLanguageContext
    if (languageContextCondition) {
        rqConfig.params = rqConfig.params || {}
        rqConfig.params._languageCd = (storeInstance.session as TeslerSessionState).languageCd
    }
    return rqConfig
}

function useExtendedFiltersModeInterceptor(rqConfig: AxiosRequestConfig) {
    const storeInstance = getStoreInstance().getState() as AppState
    const isGetDataRequest =
        (rqConfig.url.startsWith('data') || rqConfig.url.startsWith('count/dashboard')) && rqConfig.method.toUpperCase() === 'GET'
    const isCustomActionRequest = rqConfig.url.startsWith('custom-action') && rqConfig.method.toUpperCase() === 'POST'
    let bcName: string = null

    if (isGetDataRequest) {
        const bcHierarchy = rqConfig.url.split('?')[0].split('/').slice(2)
        if (bcHierarchy.length % 2 !== 0) {
            bcName = bcHierarchy.pop()
        }
    }
    if (isCustomActionRequest) {
        const bcHierarchy = rqConfig.url.split('?')[0].split('/').slice(-2)
        bcName = bcHierarchy.shift()
    }

    const bcWidgetNames = bcName && storeInstance.view.widgets.filter(i => i.bcName === bcName).map(i => i.name)
    const extendedFiltersMode = storeInstance.view.smDrawerFilterExtendedMode
    const widgetIndex = bcWidgetNames?.findIndex(i => extendedFiltersMode[i])
    if (widgetIndex > -1) {
        rqConfig.params = rqConfig.params || {}
        rqConfig.params._extendedFiltersMode = extendedFiltersMode[bcWidgetNames[widgetIndex]]
    }
    return rqConfig
}
export function createAxiosInstance(config?: AxiosRequestConfig) {
    const instance = axios.create({
        baseURL: __API__,
        timeout: __AJAX_TIMEOUT__,
        responseType: 'json',
        headers: {
            ...HEADERS,
            ...{ClientId: __CLIENT_ID__}
        },
        ...config
    })
    instance.interceptors.request.use(useLanguageCdInterceptor)
    instance.interceptors.request.use(useExtendedFiltersModeInterceptor)
    return instance
}

function redirectOccurred(value: AxiosResponse<any>) {
    if (value.data?.redirectUrl === '/ui/#') {
        getStoreInstance().dispatch($do.login(null))
        return false
    }
    if (value.data?.redirectUrl) {
        let {redirectUrl} = value.data
        if (!redirectUrl.startsWith('/') && !redirectUrl.match('^http(.?)://')) {
            redirectUrl = `${window.location.pathname}#/${redirectUrl}`
        }
        if (redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
            redirectUrl = `${window.location.origin}${redirectUrl}`
        }
        window.location.replace(redirectUrl)
        return false
    }
    return true
}

export const axiosInstance = createAxiosInstance()

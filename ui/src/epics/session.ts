import {Epic as CustomEpic} from 'redux-observable'
import {$do, coreActions, historyObj} from '@tesler-ui/core'
import {AnyAction, Epic} from '@tesler-ui/core/actions/actions'
import {Observable} from 'rxjs/Observable'
import {AxiosError} from 'axios'
import {CustomEpicSlice} from '@tesler-ui/core/interfaces/customEpics'
import i18n from 'i18next'
import {getBasicAuthRequest, getLaLanguages, getLanguagesList, logout, ssoAuth} from '../api/session'
import {TeslerLoginResponse} from '../interfaces/store'
import {AppState} from '../interfaces/reducers'
import {$smDo, smActionTypes, SmEpic, SSO_AUTH} from '../actions/actions'
import {LaLanguagesResponse, LanguagesResponse} from '../interfaces/session'
import {openButtonWarningNotification} from '../utils/notifications'
import {getLocale} from '../locale'

const responseStatusMessages: Record<number, string> = {
    401: 'Invalid credentials',
    403: 'Access denied'
}

const ssoAuthEpic: CustomEpic<AnyAction, AppState> = (action$, store) =>
    action$.ofType(SSO_AUTH).switchMap(action => {
        return ssoAuth()
    })

const loginEpic: SmEpic = (action$, store) =>
    action$
        .ofType(coreActions.login)
        .filter(action => !action.payload?.role)
        .switchMap(action => {
            const login = action.payload?.login
            const password = action.payload?.password
            return getBasicAuthRequest(login, password)
                .mergeMap((data: TeslerLoginResponse) => {
                    return Observable.of(
                        $smDo.loginDone({
                            activeRole: data.activeRole,
                            roles: data.roles,
                            screens: data.screens,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            login: data.login
                        })
                    )
                })
                .catch((error: AxiosError) => {
                    console.error(error)
                    const errorMsg = error.response
                        ? responseStatusMessages[error.response.status] || 'Server application unavailable'
                        : 'Empty server response'
                    return Observable.of($do.loginFail({errorMsg}))
                })
        })

const getLanguagesListEpic: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.loginDone).mergeMap(action => {
        return getLanguagesList()
            .mergeMap((data: LanguagesResponse) => {
                if (data.data.length === 0) {
                    openButtonWarningNotification(i18n.t('The list of languages is empty!'), i18n.t('Refresh'), 0, () =>
                        window.location.reload()
                    )
                    return Observable.empty<never>()
                }
                return Observable.of($smDo.initLanguagesList({languages: data.data}))
            })
            .catch((error: AxiosError) => {
                console.error('Error while loading languages list', error)
                return Observable.empty()
            })
    })

const getLaLanguagesEpic: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.changeCursor).mergeMap(action => {
        const {cursor} = action.payload
        return getLaLanguages(cursor)
            .mergeMap((data: LaLanguagesResponse) => {
                if (data.data.length === 0) {
                    return Observable.empty<never>()
                }
                return Observable.of($smDo.initLaLanguagesList({laLanguages: data.data}))
            })
            .catch((error: AxiosError) => {
                console.error('Error while loading languages list', error)
                return Observable.empty()
            })
    })

const initLanguageContextEpic: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.initLanguagesList).mergeMap(action => {
        const state = store.getState()
        const langList = state.session.languages
        return Observable.of(
            $smDo.changeContext({
                contextField: 'languageCd',
                contextValue: langList.find(i => i.key === getLocale())?.key || langList.find(i => i.displayOrder === 1).key
            })
        )
    })

const logoutEpic: Epic = (action$, store) =>
    action$.ofType(coreActions.logout).switchMap(action =>
        logout().map(() => {
            const history = historyObj
            history.action = 'PUSH'
            history.push('')
            return $do.logoutDone(null)
        })
    )

const logoutDoneEpic: Epic = (action$, store) =>
    action$.ofType(coreActions.logoutDone).mergeMap(action => {
        sessionStorage.removeItem('auth')
        return Observable.empty()
    })

export const sessionEpics: CustomEpicSlice<'sessionEpics'> = {
    ssoAuthEpic,
    loginEpic,
    logoutEpic,
    logoutDoneEpic,
    getLanguagesListEpic,
    initLanguageContextEpic,
    getLaLanguagesEpic
}

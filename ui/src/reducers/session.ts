import {coreActions} from '@tesler-ui/core'
import {AppState} from '../interfaces/reducers'
import {smActionTypes, SmAnyAction} from '../actions/actions'
import {ChangeContext} from '../interfaces/context'
import {TeslerLoginResponse} from '../interfaces/store'
import {TeslerSessionState} from '../interfaces/session'

export const initialState: TeslerSessionState = {
    activeRole: null,
    roles: null,
    languageCd: null,
    active: false,
    loginSpin: false,
    screens: [],
    languages: [],
    laLanguages: [],
    firstName: '',
    lastName: '',
    login: '',
    signOut: false
}

export default function sessionReducer(
    state: TeslerSessionState = initialState,
    action: SmAnyAction,
    store: Readonly<AppState>
): TeslerSessionState {
    switch (action.type) {
        case smActionTypes.loginDone: {
            const loginResponse = action.payload as TeslerLoginResponse
            return {
                ...state,
                activeRole: loginResponse.activeRole,
                roles: loginResponse.roles,
                firstName: loginResponse.firstName,
                lastName: loginResponse.lastName,
                login: loginResponse.login,
                active: true
            }
        }
        case coreActions.switchRole: {
            return {...state, signOut: true}
        }
        case coreActions.logout: {
            return {...state, loginSpin: false, active: false, signOut: true}
        }
        case coreActions.logoutDone: {
            return {...state, loginSpin: false, active: false, screens: []}
        }
        case smActionTypes.initLanguagesList:
            return {...state, languages: action.payload.languages}
        case smActionTypes.initLaLanguagesList:
            return {...state, laLanguages: action.payload.laLanguages}
        case smActionTypes.changeContext:
            return {
                ...state,
                [(action.payload as ChangeContext).contextField]: (action.payload as ChangeContext).contextValue
            }
        default:
            return state
    }
}

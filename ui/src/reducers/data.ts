import {DataState} from '@tesler-ui/core/interfaces/data'
import {coreActions} from '@tesler-ui/core'
import {AppState} from '../interfaces/reducers'
import {smActionTypes, SmAnyAction} from '../actions/actions'

export const initialState: DataState = {}

export default function screenReducer(state: DataState = initialState, action: SmAnyAction, store: Readonly<AppState>): DataState {
    switch (action.type) {
        case coreActions.logoutDone:
            return initialState
        case smActionTypes.smSeSetFiles: {
            const {bcName} = action.payload
            const {cursor} = action.payload
            return {
                ...state,
                [bcName]: state[bcName].map(i => (i.id === cursor ? {...i, files: action.payload.files} : i))
            }
        }
        default:
            return state
    }
}

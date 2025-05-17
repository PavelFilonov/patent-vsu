import {coreActions} from '@tesler-ui/core'
import qs from 'query-string'
import {PendingValidationFailsFormat} from '@tesler-ui/core/interfaces/view'
import {smActionTypes, SmAnyAction} from '../actions/actions'
import {SmViewState} from '../interfaces/view'
import {AppState} from '../interfaces/reducers'

export const initialState: SmViewState = {
    id: null,
    name: null,
    url: null,
    widgets: [],
    columns: null,
    readOnly: false,
    rowHeight: null,
    rowMeta: {},
    associationInProgress: false,
    metaInProgress: {},
    popupData: {bcName: null},
    pendingDataChanges: {},
    pendingValidationFailsFormat: PendingValidationFailsFormat.target,
    smDrawerFilterExtendedMode: {},
    handledForceActive: {},
    smShowCondition: {},
    smShowChanges: {},
    smBcRecordsCount: {},
    smExportDataInProgress: {},
    systemNotifications: []
}

export default function viewReducer(state: SmViewState = initialState, action: SmAnyAction, store: Readonly<AppState>): SmViewState {
    switch (action.type) {
        case coreActions.logoutDone:
            return {...state, ...initialState}
        case coreActions.operationConfirmation: {
            const {type} = qs.parse(action.payload.confirmOperation.message)
            const modalInvoke = type === 'save' ? null : action.payload
            return {...state, modalInvoke}
        }
        case smActionTypes.changeSmShowChanges: {
            const {bcName, showChanges} = action.payload
            return {
                ...state,
                smShowChanges: {
                    ...state.smShowChanges,
                    [bcName]: showChanges
                }
            }
        }
        case smActionTypes.changeSmShowCondition: {
            const {payload} = action
            return {
                ...state,
                smShowCondition: {
                    ...state.smShowCondition,
                    [payload.key]: {
                        ...state.smShowCondition[payload.key],
                        [payload.fieldKey]: payload.value
                    }
                }
            }
        }
        case smActionTypes.setBcCount: {
            const {bcName: bcCountName, count} = action.payload

            return {
                ...state,
                smBcRecordsCount: {
                    ...state.smBcRecordsCount,
                    [bcCountName]: {count, error: false}
                }
            }
        }
        case smActionTypes.setBcCountError: {
            const {bcName: bcCountErrorName} = action.payload

            return {
                ...state,
                smBcRecordsCount: {
                    ...state.smBcRecordsCount,
                    [bcCountErrorName]: {count: 0, error: true}
                }
            }
        }
        case coreActions.selectView: {
            return {
                ...state,
                smBcRecordsCount: {}
            }
        }
        case smActionTypes.smChangeDrawerFilterMode: {
            return {
                ...state,
                smDrawerFilterExtendedMode: {
                    ...state.smDrawerFilterExtendedMode,
                    [action.payload.widgetName]: action.payload.mode
                }
            }
        }
        case smActionTypes.exportData: {
            return {
                ...state,
                smExportDataInProgress: {
                    [action.payload.bcName]: true
                }
            }
        }
        case smActionTypes.exportDataDone: {
            return {
                ...state,
                smExportDataInProgress: {
                    [action.payload.bcName]: false
                }
            }
        }
        case smActionTypes.exportDataFailed: {
            return {
                ...state,
                smExportDataInProgress: {
                    [action.payload.bcName]: false
                }
            }
        }
        case coreActions.saveAssociations: {
            if (state.popupData.active) {
                return {
                    ...state,
                    associationInProgress: true
                }
            }
            return state
        }
        case smActionTypes.associationsCompleted: {
            return {
                ...state,
                associationInProgress: false
            }
        }

        default:
            return state
    }
}

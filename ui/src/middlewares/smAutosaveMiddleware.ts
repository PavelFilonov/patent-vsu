import {Dispatch, MiddlewareAPI} from 'redux'
import {autosaveRoutine, buildBcUrl, coreActions} from '@tesler-ui/core'
import {Operation, OperationTypeCrud} from '@tesler-ui/core/interfaces/operation'
import {AppState} from '../interfaces/reducers'
import {SmAnyAction} from '../actions/actions'

export function bcHasPendingAutosaveChanges(store: AppState, bcName: string, cursor: string) {
    const pendingChanges = store.view.pendingDataChanges
    const cursorChanges = pendingChanges[bcName]?.[cursor]
    return cursorChanges && !Object.keys(cursorChanges).includes('_associate') && Object.values(cursorChanges).length > 0
}

export function checkUnsavedChangesOfBc(store: AppState, bcName: string) {
    const pendingCursors = Object.keys(store.view.pendingDataChanges?.[bcName] ?? {})
    return pendingCursors.some(cursor => bcHasPendingAutosaveChanges(store, bcName, cursor))
}

const smAutosaveMiddleware = ({getState, dispatch}: MiddlewareAPI<Dispatch<SmAnyAction>, AppState>) => (next: Dispatch) => (
    action: SmAnyAction
) => {
    const state = getState()

    const isPopupOpen = state.view.popupData?.bcName === action.payload?.bcName
    const isChangePageInPopup = isPopupOpen && action.type === coreActions.bcChangePage
    if (isChangePageInPopup) {
        return next(action)
    }

    const isSendOperation = action.type === coreActions.sendOperation
    const isSelectTableCellInit = action.type === coreActions.selectTableCellInit

    const isSaveAction = isSendOperation && action.payload.operationType === OperationTypeCrud.save
    const isNotSaveAction = !isSaveAction

    const isAutosaveBefore =
        isSendOperation &&
        (state.view.rowMeta[action.payload.bcName]?.[buildBcUrl(action.payload.bcName, true)]?.actions.find(
            i => i.type === action.payload.operationType
        ) as Operation)?.autoSaveBefore

    const isSendOperationCreate = isSendOperation && action.payload.operationType === OperationTypeCrud.create

    const actionBcName = isSendOperation && action.payload.bcName
    const hasAnotherUnsavedBc =
        Object.keys(state.view.pendingDataChanges)
            .filter(key => key !== actionBcName)
            .filter(key => checkUnsavedChangesOfBc(state, key)).length > 0
    const isSendOperationForAnotherBc = isSendOperation && hasAnotherUnsavedBc

    const {selectedCell} = state.view
    const isSelectTableCellInitOnAnotherRowOrWidget =
        selectedCell &&
        isSelectTableCellInit &&
        (selectedCell.widgetName !== action.payload.widgetName || selectedCell.rowId !== action.payload.rowId)

    const isChangeDataItem = action.type === coreActions.changeDataItem
    const notAssociationAction = isChangeDataItem && action.payload.dataItem._associate === undefined
    const isChangeDataItemForAnotherCursor =
        notAssociationAction && action.payload.cursor !== state.screen.bo.bc[action.payload.bcName].cursor

    const isNeedSaveCondition =
        isNotSaveAction &&
        (isSendOperationCreate ||
            isAutosaveBefore ||
            isSendOperationForAnotherBc ||
            isSelectTableCellInitOnAnotherRowOrWidget ||
            isChangeDataItemForAnotherCursor)

    if (isNeedSaveCondition) {
        return autosaveRoutine(action, {dispatch, getState}, next)
    }

    return next(action)
}

export function createSmAutosaveMiddleware() {
    return smAutosaveMiddleware
}

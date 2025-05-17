import {$do, customAction, coreActions, sendOperationEpicImpl, matchOperationRole, buildBcUrl, getFilters} from '@tesler-ui/core'
import {Observable} from 'rxjs'
import {Epic} from '@tesler-ui/core/actions/actions'
import {CustomEpicSlice} from '@tesler-ui/core/interfaces/customEpics'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {AppState} from '../interfaces/reducers'
import {$smDo, smActionTypes, SmEpic} from '../actions/actions'
import {fetchBcCount} from '../api/bcCount'
import {BcCountResponse} from '../interfaces/bcCount'
import {selectRecordAndOpenPopupByBcName} from './view/selectRecordAndOpenPopupByBcName'

const closePopupWhileDrilldown: Epic = (action$, store) =>
    action$.ofType(coreActions.userDrillDown).mergeMap(action => {
        const state = store.getState()
        const isPopupOpen = state.view.popupData.bcName
        return Observable.concat(
            isPopupOpen
                ? Observable.of(
                      $smDo.closeViewPopup({
                          bcName: state.view.popupData.bcName
                      })
                  )
                : Observable.empty<never>()
        )
    })

const sendOperation: Epic = (action$, store) =>
    action$
        .ofType(coreActions.sendOperation)
        .filter(action => matchOperationRole('none', action.payload, store.getState()))
        .delayWhen(action => {
            const state = store.getState() as AppState
            /**
             * If we understand that BC is already fetching row meta, wait until it's fetched
             *
             * It's possible that data fetching also should be checked here
             */
            // const metaIsAlreadyLoading = Object.values(state.view.metaInProgress).includes(true)
            const metaIsAlreadyLoading = state.view.metaInProgress[action.payload.bcName] === true
            if (metaIsAlreadyLoading) {
                return action$
                    .ofType(coreActions.bcFetchRowMetaSuccess || coreActions.bcFetchRowMetaFail)
                    .filter(subAction => subAction.payload.bcName === action.payload.bcName)
            }
            /**
             * If BC is not fetching anything we can proceed with default handler for action
             */
            return Observable.of(true)
        })
        .mergeMap(action => sendOperationEpicImpl(action, store))

const bcFetchCountEpic: SmEpic = (action$, store) =>
    action$
        .ofType(smActionTypes.getBcCount)
        .mergeMap(action => {
            const {params, bcName} = action.payload
            const bcUrl = buildBcUrl(bcName)
            return fetchBcCount(bcUrl, params)
                .mergeMap(({data}: BcCountResponse) =>
                    Observable.of(
                        $smDo.setBcCount({
                            bcName,
                            count: data
                        })
                    )
                )
                .catch(error => {
                    console.error(error)
                    return Observable.of($smDo.setBcCountError({bcName}))
                })
        })
        .catch(error => {
            console.error(error)
            return Observable.empty<never>()
        })

const bulkUpdate: Epic = (action$, store) =>
    action$
        .ofType(coreActions.sendOperation)
        .filter(action => matchOperationRole('bulk-update', action.payload, store.getState()))
        .mergeMap(action => {
            const state = store.getState()
            const {bcName} = action.payload
            const bcUrl = buildBcUrl(bcName, true)
            const bulkIds: PendingDataItem[] = []
            Object.values(state.view.pendingDataChanges[bcName])?.forEach(item => bulkIds.push(item))
            bulkIds.sort((a, b) => {
                if (a.displayOrder > b.displayOrder) {
                    return 1
                }
                if (a.displayOrder < b.displayOrder) {
                    return -1
                }
                return 0
            })
            const data = {
                bulkIds: bulkIds.map(item => item.id).filter(i => !!i)
            }
            return customAction(state.screen.screenName, bcUrl, data, null, {
                _action: 'bulk-update'
            }).mergeMap(() => {
                return Observable.concat(
                    Observable.of($do.bcCancelPendingChanges({bcNames: [bcName]})),
                    Observable.of($do.sendOperationSuccess({bcName, cursor: null})),
                    Observable.of($do.bcForceUpdate({bcName}))
                )
            })
        })

const getBcCountEpic: SmEpic = ($action, store) =>
    $action.ofType(coreActions.bcForceUpdate, coreActions.bcFetchDataSuccess).mergeMap(action => {
        const {bcName} = action.payload
        const state = store.getState()
        const params = getFilters(state.screen.filters[bcName] as BcFilter[])
        return Observable.of($smDo.getBcCount({bcName, params}))
    })

/**
 * If all filters are removed, this epic clears pendingDataChanges of assoc BC
 *
 * @param action$
 * @param store
 */
const clearPendingOnRemoveAllFilters: SmEpic = (action$, store) =>
    action$.ofType(coreActions.bcRemoveAllFilters).mergeMap(action => {
        const state = store.getState()
        const {bcName} = action.payload
        const widgets = state.view.widgets.filter(i => i.bcName === bcName)
        const fields = widgets.reduce((acc, cur) => [...acc, ...cur.fields], [])
        const bcNamesForClear = fields.filter(i => i.popupBcName).map(i => i.popupBcName)
        return Observable.of($do.bcCancelPendingChanges({bcNames: bcNamesForClear}))
    })

export const viewEpics: CustomEpicSlice<'viewEpics'> = {
    selectRecordAndOpenPopupByBcName,
    getBcCountEpic,
    clearPendingOnRemoveAllFilters,
    closePopupWhileDrilldown,
    sendOperation,
    bulkUpdate,
    bcFetchCountEpic
}

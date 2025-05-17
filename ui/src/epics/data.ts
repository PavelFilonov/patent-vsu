import {Epic} from '@tesler-ui/core/actions/actions'
import {Observable} from 'rxjs/Observable'
import {AssociatedItem, OperationTypeCrud} from '@tesler-ui/core/interfaces/operation'
import {buildBcUrl, coreActions, getFilters} from '@tesler-ui/core'
import qs from 'query-string'
import {CustomEpicSlice} from '@tesler-ui/core/interfaces/customEpics'
import {WidgetTableMeta} from '@tesler-ui/core/interfaces/widget'
import {$smDo, smActionTypes, SmAnyAction, SmEpic} from '../actions/actions'
import * as api from '../api/api'
import {AppState} from '../interfaces/reducers'
import updateOnChangeSmShowCondition from './data/updateOnChangeSmShowCondition'
import {exportDataEpic, createExcelEpic} from './data/exportEpics'
import getSorters from '../utils/getSorters'
import saveAssociationsAndSave from './data/saveAssociationsAndSave'
import clearPopupsPendingChanges from './data/clearPopupsPendingChanges'

/**
 * Dirty copy of core's requestBcChildren
 *
 * @param state
 * @param bcName
 */
function requestBcChildren(state: AppState, bcName: string) {
    // const state = storeInstance.getState()
    const {widgets} = state.view
    const bcMap = state.screen.bo.bc

    // Build a dictionary with children for requested BC and widgets that need this BC
    const childrenBcMap: Record<string, string[]> = {}
    widgets.forEach(widget => {
        if (widget.bcName) {
            const widgetBcList: string[] = []

            widgetBcList.push(widget.bcName)
            let parentName = bcMap[widget.bcName]?.parentName
            while (parentName) {
                widgetBcList.push(parentName)
                parentName = bcMap[parentName]?.parentName
            }

            widgetBcList.some(expectedBcName => {
                if (bcMap[expectedBcName].parentName === bcName) {
                    if (!childrenBcMap[expectedBcName]) {
                        childrenBcMap[expectedBcName] = []
                    }
                    childrenBcMap[expectedBcName].push(widget.name)
                    return true
                }

                return false
            })
        }
    })

    // If widgets supports hierarchy, try to find children though it
    // TODO: need description and split to separate methods?
    const hierarchyWidget = state.view.widgets.find(item => {
        const hierarchy = item.options?.hierarchy
        const nestedBc = hierarchy?.map(nestedItem => nestedItem.bcName)
        return hierarchy && (item.bcName === bcName || nestedBc.includes(bcName))
    }) as WidgetTableMeta
    if (hierarchyWidget) {
        const nestedBcNames = hierarchyWidget.options?.hierarchy.map(nestedItem => nestedItem.bcName)
        const childHierarchyBcIndex = nestedBcNames.findIndex(item => item === bcName)
        const childHierarchyBcName =
            childHierarchyBcIndex !== -1 ? nestedBcNames[childHierarchyBcIndex + 1] : hierarchyWidget.options?.hierarchy[0].bcName
        if (!childHierarchyBcName) {
            return childrenBcMap
        }
        if (!childrenBcMap[childHierarchyBcName]) {
            childrenBcMap[childHierarchyBcName] = []
        }
        childrenBcMap[childHierarchyBcName].push(hierarchyWidget.name)
    }
    return childrenBcMap
}

const anotherBcSaved: Epic = (action$, store) =>
    action$.ofType(coreActions.processPreInvoke).mergeMap(action => {
        const {bcName, widgetName, preInvoke, operationType} = action.payload
        const state = store.getState()
        /**
         * TODO: Fix then new type of PreInvoke will be added in the Tesler
         */
        const widget = state.view.widgets[0].name
        const params = qs.parse(preInvoke.message)
        const hasData = state.data[params.bcName]?.length > 0

        if (params.type === 'save') {
            return hasData
                ? Observable.of(
                      $smDo.sendOperation({
                          bcName: params.bcName,
                          operationType: OperationTypeCrud.save,
                          widgetName: widget,
                          onSuccessAction: $smDo.sendOperation({
                              bcName,
                              operationType,
                              widgetName,
                              confirm: 'confirm'
                          })
                      })
                  )
                : Observable.of(
                      $smDo.sendOperation({
                          bcName,
                          operationType,
                          widgetName,
                          confirm: 'confirm'
                      })
                  )
        }
        return Observable.empty()
    })

const refreshViewEpic: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.changeContext).mergeMap(action => {
        const state = store.getState()
        const {view} = state
        return Observable.of($smDo.selectView({...view}))
    })

/**
 * Experimental epic of data fetching without cursors changing
 *
 * @param action$
 * @param store
 */
const bcFetchDataSavingCursorsEpic: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.bcFetchDataRequestSavingCursors).mergeMap(action => {
        const state = store.getState()
        const {bcName, widgetName} = action.payload
        const bc = state.screen.bo.bc[bcName]
        const {cursor, page} = bc
        const limit = state.view.widgets.find(i => i.bcName === bcName)?.limit || bc.limit
        const filters = state.screen.filters[bcName] || []
        const sorters = state.screen.sorters[bcName]

        const fetchParams: Record<string, any> = {
            _page: page,
            _limit: limit,
            ...getFilters(filters),
            ...getSorters(sorters)
        }
        if (action.type === smActionTypes.bcFetchDataRequestSavingCursors && action.payload.ignorePageLimit) {
            fetchParams._limit = 0
        }
        const limitBySelfCursor = state.router.bcPath?.includes(`${bcName}/${cursor}`)
        const bcUrl = buildBcUrl(bcName, limitBySelfCursor)
        const cancelFlow = action$
            .ofType(coreActions.selectView)
            .filter(() => {
                return true
            })
            .mergeMap(() => {
                return Observable.of($smDo.bcFetchDataFail({bcName, bcUrl}))
            })
            .take(1)
        const normalFlow = api
            .fetchBcData(state.screen.screenName, bcUrl, fetchParams)
            .takeUntil(action$.ofType(coreActions.logout))
            .mergeMap(data => {
                const fetchChildrenBcData = data.data?.length
                    ? Object.entries(requestBcChildren(state, bcName)).map(entry => {
                          const [childBcName, widgetNames] = entry
                          return $smDo.bcFetchDataRequestSavingCursors({
                              bcName: childBcName,
                              widgetName: widgetNames[0],
                              ignorePageLimit:
                                  action.type === smActionTypes.bcFetchDataRequestSavingCursors && action.payload.ignorePageLimit
                              // || action.type === coreActions.showViewPopup
                          })
                      })
                    : Observable.empty<never>()
                return Observable.concat(
                    Observable.of(
                        $smDo.bcFetchDataSuccess({
                            bcName,
                            data: data.data,
                            bcUrl,
                            hasNext: data.hasNext
                        })
                    ),
                    Observable.of<SmAnyAction>($smDo.bcFetchRowMeta({widgetName, bcName})),
                    fetchChildrenBcData
                )
            })
        return Observable.race(cancelFlow, normalFlow)
    })

const performDragAndDropEpic: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.performDnd).mergeMap(action => {
        const {bcName, cursors, dataItems, widgetName} = action.payload
        const state = store.getState()
        const isPendingChanges = !!state.view.pendingDataChanges[bcName]
        const saveFlow = Observable.if(
            () => isPendingChanges,
            Observable.of($smDo.sendOperation({bcName, widgetName, operationType: OperationTypeCrud.save})),
            Observable.empty<never>()
        )
        const updateFlow = action$
            .ofType(coreActions.bcSaveDataSuccess)
            .filter(a => a.payload.bcName === bcName)
            .take(1)
            .mergeMap(a => {
                const mergedDataItems = dataItems.map(item =>
                    item.id === a.payload.dataItem.id ? {...a.payload.dataItem, displayOrder: item.displayOrder} : {...item}
                )

                return Observable.concat(
                    Observable.of(
                        $smDo.changeDataItems({
                            bcName,
                            cursors,
                            dataItems: mergedDataItems
                        })
                    ),
                    Observable.of(
                        $smDo.sendOperation({
                            operationType: 'bulk-update',
                            bcName,
                            widgetName
                        })
                    )
                )
            })

        const forceUpdateFlow = Observable.concat(
            Observable.of(
                $smDo.changeDataItems({
                    bcName,
                    cursors,
                    dataItems
                })
            ),
            Observable.of(
                $smDo.sendOperation({
                    operationType: 'bulk-update',
                    bcName,
                    widgetName
                })
            )
        )

        return isPendingChanges ? Observable.concat(saveFlow, updateFlow) : forceUpdateFlow
    })

const smSaveAssociationsActive: SmEpic = (action$, store) =>
    action$
        .ofType(coreActions.saveAssociations)
        .filter(action => {
            return store.getState().view.popupData.active
        })
        .switchMap(action => {
            const state = store.getState()
            const {calleeBCName} = state.view.popupData
            const {bcNames} = action.payload
            const bcUrl = buildBcUrl(calleeBCName, true)
            const pendingChanges = state.view.pendingDataChanges[bcNames[0]] || {}
            const params: Record<string, any> = bcNames.length ? {_bcName: bcNames[bcNames.length - 1]} : {}
            return api
                .associate(state.screen.screenName, bcUrl, Object.values(pendingChanges) as AssociatedItem[], params)
                .mergeMap(response => {
                    const postInvoke = response.postActions[0]
                    const calleeWidget = state.view.widgets.find(widgetItem => widgetItem.bcName === calleeBCName)
                    return Observable.concat(
                        Observable.of($smDo.associationsCompleted(null)),
                        postInvoke
                            ? Observable.of($smDo.processPostInvoke({bcName: calleeBCName, postInvoke, widgetName: calleeWidget.name}))
                            : Observable.empty<never>(),
                        Observable.of($smDo.bcCancelPendingChanges({bcNames})),
                        Observable.of($smDo.bcForceUpdate({bcName: calleeBCName}))
                    )
                })
                .catch(err => {
                    console.error(err)
                    return Observable.empty<never>()
                })
        })

export const dataEpics: CustomEpicSlice<'dataEpics'> = {
    saveAssociationsAndSave,
    clearPopupsPendingChanges,
    saveAssociationsActive: smSaveAssociationsActive,
    exportDataEpic,
    createExcelEpic,
    updateOnChangeSmShowCondition,
    bcFetchDataSavingCursorsEpic,
    refreshViewEpic,
    anotherBcSaved,
    performDragAndDropEpic
}

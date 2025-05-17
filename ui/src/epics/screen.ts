import {CustomEpicSlice} from '@tesler-ui/core/interfaces/customEpics'
import {coreActions} from '@tesler-ui/core'
import {Observable} from 'rxjs'
import {OperationPostInvokeRefreshBc} from '@tesler-ui/core/interfaces/operation'
import {SmPostInvokeType} from '../interfaces/screen'
import {$smDo, SmEpic} from '../actions/actions'
import {addLinkedFilters} from './screen/linkedFilters'

const smProcessPostInvoke: SmEpic = (action$, store) =>
    action$.ofType(coreActions.processPostInvoke).mergeMap(action => {
        const state = store.getState()
        switch (action.payload.postInvoke.type as SmPostInvokeType) {
            case SmPostInvokeType.refreshBcSaveCursors: {
                const {bo} = state.screen
                const postInvoke = action.payload.postInvoke as OperationPostInvokeRefreshBc
                const postInvokeBCItem = bo.bc[postInvoke.bc]
                const {widgetName} = action.payload
                return Observable.of(
                    $smDo.bcFetchDataRequestSavingCursors({
                        bcName: postInvokeBCItem.name,
                        widgetName
                    })
                )
            }
            default:
                return Observable.empty()
        }
    })
export const screenEpics: CustomEpicSlice<'screenEpics'> = {
    addLinkedFilters,
    smProcessPostInvoke
}

import {Observable} from 'rxjs'
import {$do} from '@tesler-ui/core'
import {MultivalueFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {smActionTypes, SmEpic} from '../../actions/actions'

const clearPopupsPendingChanges: SmEpic = ($action, store) =>
    $action.ofType(smActionTypes.clearPopupsPendingChanges).mergeMap(action => {
        const state = store.getState()
        const {widgetName} = action.payload
        const widget = state.view.widgets.find(i => i.name === widgetName)
        const bcNamesForClear = widget.fields
            .filter(i => (i as MultivalueFieldMeta).popupBcName)
            .map(i => (i as MultivalueFieldMeta).popupBcName)
        return Observable.of($do.bcCancelPendingChanges({bcNames: bcNamesForClear}))
    })

export default clearPopupsPendingChanges

import {Observable} from 'rxjs/Observable'
import {OperationTypeCrud} from '@tesler-ui/core/interfaces/operation'
import {$smDo, smActionTypes, SmEpic} from '../../actions/actions'
import {getClearedFields} from '../../utils/getClearefFields'
import {SmField} from '../../interfaces/widget'

/**
 * For CheckboxAssocListPopup usage
 * Saves associations then save data
 * @param $action
 * @param store
 */
const saveAssociationsAndSave: SmEpic = ($action, store) =>
    $action.ofType(smActionTypes.saveAssociationsAndSave).mergeMap(action => {
        const state = store.getState()
        const {widgetName, saveBcName} = action.payload
        const {cursor} = state.screen.bo.bc[saveBcName]
        const {fields} = state.view.widgets.find(i => i.name === widgetName)
        return Observable.concat(
            // clear rest fields
            Observable.of($smDo.changeDataItem({bcName: saveBcName, cursor, dataItem: getClearedFields(fields as SmField[])})),
            Observable.of($smDo.saveAssociations({bcNames: action.payload.bcNames})),
            Observable.of(
                $smDo.sendOperation({
                    operationType: OperationTypeCrud.save,
                    widgetName: action.payload.widgetName,
                    bcName: action.payload.saveBcName
                })
            )
        )
    })

export default saveAssociationsAndSave

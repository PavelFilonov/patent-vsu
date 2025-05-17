import {Observable} from 'rxjs'
import {$smDo, smActionTypes, SmEpic} from '../../actions/actions'
import {SmWidgetOptions} from '../../interfaces/widget'

/**
 * After switching smShowCondition to `false` this epic updates data of BC which showed if smShowCondition is false
 * @param $action
 * @param store
 */
const updateOnChangeSmShowCondition: SmEpic = ($action, store) =>
    $action.ofType(smActionTypes.changeSmShowCondition).mergeMap(action => {
        const {key, fieldKey, value} = action.payload
        const state = store.getState()
        const widget = state.view.widgets.find(i => {
            return (
                (i.options as SmWidgetOptions)?.showCondition?.key === key &&
                (i.options as SmWidgetOptions)?.showCondition?.params.fieldKey === fieldKey &&
                (i.options as SmWidgetOptions)?.showCondition?.params.value === value
            )
        })
        const bcName = widget?.bcName
        const widgetName = widget?.name
        if (value === false && bcName && widgetName) {
            return Observable.of($smDo.bcFetchDataRequest({bcName, widgetName}))
        }

        return Observable.empty()
    })

export default updateOnChangeSmShowCondition

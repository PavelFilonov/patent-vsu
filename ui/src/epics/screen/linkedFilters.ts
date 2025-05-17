import {Observable} from 'rxjs/Observable'
import {coreActions} from '@tesler-ui/core'
import {$smDo, SmAnyAction, SmEpic} from '../../actions/actions'
import {SmWidgetMeta} from '../../interfaces/widget'

export const addLinkedFilters: SmEpic = (action$, store) =>
    action$.ofType(coreActions.showViewPopup).mergeMap(action => {
        const {widgetName} = action.payload
        const state = store.getState()
        const widgets = state.view.widgets as SmWidgetMeta[]
        const widget = widgets.find(i => i.name === widgetName)
        const copyFilters = widget?.options?.drawerFilterCopyFilters

        if (copyFilters) {
            const {pivotWidgetName, fieldsMapping} = copyFilters
            const pivotFieldNames = Object.keys(fieldsMapping)
            const pivotWidget = widgets.find(i => i.name === pivotWidgetName)
            const pivotFilters = state.screen.filters[pivotWidget.bcName]
            const copiedFilters: SmAnyAction[] = pivotFilters
                ?.filter(i => pivotFieldNames.includes(i.fieldName))
                .map(f =>
                    $smDo.smBcAddFilter({
                        widgetName,
                        bcName: widget.bcName,
                        filter: {...f, fieldName: fieldsMapping[f.fieldName]}
                    })
                )
            if (copiedFilters?.length) {
                return Observable.concat(copiedFilters)
            }
        }
        return Observable.empty()
    })

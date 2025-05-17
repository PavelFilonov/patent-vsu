import React from 'react'
import {BaseFieldProps, ChangeDataItemPayload} from '@tesler-ui/core/components/Field/Field'
import {PickMap} from '@tesler-ui/core/interfaces/data'
import {WidgetMeta, PickListFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {connect} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import PickInput from '../../ui/PickInput/PickInput'
import {SmWidgetTypes} from '../../../interfaces/widget'

interface IPickListWidgetInputOwnProps extends BaseFieldProps {
    value?: string
    cursor: string
    disabled: boolean
    placeholder?: string
}

interface IPickListWidgetInputProps extends IPickListWidgetInputOwnProps {
    pickMap: PickMap
    parentBCName: string
    bcName: string
    popupWidget: WidgetMeta
    onChange: (payload: ChangeDataItemPayload) => void
    onClick: (bcName: string, pickMap: PickMap, widgetName?: string) => void
}

const SinglePickField: React.FunctionComponent<IPickListWidgetInputProps> = props => {
    const {parentBCName, bcName, pickMap, value, placeholder, popupWidget, onChange, onClick, cursor, disabled} = props
    // if (readOnly) {
    //     return (
    //         <ReadOnlyField
    //             widgetName={widgetName}
    //             meta={meta}
    //             className={className}
    //             backgroundColor={backgroundColor}
    //             onDrillDown={onDrillDown}
    //         >
    //             {value}
    //         </ReadOnlyField>
    //     )
    // }

    const handleClear = React.useCallback(() => {
        Object.keys(pickMap).forEach(field => {
            onChange({
                bcName: parentBCName,
                cursor,
                dataItem: {[field]: ''}
            })
        })
    }, [pickMap, onChange, parentBCName, cursor])

    const handleClick = React.useCallback(() => {
        onClick(bcName, pickMap, popupWidget.name)
    }, [onClick, bcName, pickMap, popupWidget.name])

    return <PickInput disabled={disabled} value={value} onClick={handleClick} onClear={handleClear} placeholder={placeholder} />
}

function mapStateToProps(state: AppState, ownProps: IPickListWidgetInputOwnProps) {
    const {widgets} = state.view
    const widget = state.view.widgets.find(item => item.name === ownProps.widgetName)
    const parentBCName = widget?.bcName
    const bcName = (ownProps.meta as PickListFieldMeta).popupBcName
    const popupWidget = widgets.find(i => i.bcName === bcName && i.type === SmWidgetTypes.SingleValuePopup)
    return {
        pickMap: (ownProps.meta as PickListFieldMeta).pickMap,
        parentBCName,
        bcName,
        popupWidget
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onChange: (payload: ChangeDataItemPayload) => {
        return dispatch($smDo.changeDataItem(payload))
    },
    onClick: (bcName: string, pickMap: PickMap, widgetName?: string) => {
        dispatch($smDo.showViewPopup({bcName, widgetName}))
        dispatch($smDo.viewPutPickMap({map: pickMap, bcName}))
    }
})

const ConnectedPickListField = connect(mapStateToProps, mapDispatchToProps)(SinglePickField)

export default ConnectedPickListField

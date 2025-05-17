import React from 'react'
import {connect, useSelector} from 'react-redux'
import {BaseFieldProps, ChangeDataItemPayload} from '@tesler-ui/core/components/Field/Field'
import {Dispatch} from 'redux'
import {PickListFieldMeta, WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import {PickMap} from '@tesler-ui/core/interfaces/data'
import PickInput from '../../ui/PickInput/PickInput'
import {$smDo} from '../../../actions/actions'
import {AppState} from '../../../interfaces/reducers'

interface IPickListWidgetInputOwnProps extends BaseFieldProps {
    widgetName: string
    cursor: string
    disabled: boolean
    meta: PickListFieldMeta
    value?: string
    placeholder?: string
}

interface IPickListWidgetInputProps extends IPickListWidgetInputOwnProps {
    onCancel: (bcName: string) => void
    parentBCName: string
    onChange: (payload: ChangeDataItemPayload) => void
    onClick: (bcName: string, pickMap: PickMap, widgetName?: string) => void
}

const PickListField: React.FunctionComponent<IPickListWidgetInputProps> = props => {
    const {meta, value, placeholder, onChange, onClick, disabled, cursor, parentBCName, onCancel} = props
    const {popupBcName: bcName, pickMap} = meta
    const popupWidget = useSelector((store: AppState) =>
        store.view.widgets.find(i => i.bcName === bcName && i.type === WidgetTypes.PickListPopup)
    )

    const handleClear = React.useCallback(() => {
        onCancel(bcName)
        Object.keys(pickMap).forEach(field => {
            onChange({
                bcName: parentBCName,
                cursor,
                dataItem: {[field]: ''}
            })
        })
    }, [pickMap, onChange, parentBCName, cursor, bcName, onCancel])

    const handleClick = React.useCallback(() => {
        onClick(bcName, pickMap, popupWidget?.name)
    }, [onClick, bcName, pickMap, popupWidget?.name])

    return <PickInput disabled={disabled} value={value} onClick={handleClick} onClear={handleClear} placeholder={placeholder} />
}

function mapStateToProps(state: AppState, ownProps: IPickListWidgetInputOwnProps) {
    const {widgets} = state.view
    return {
        parentBCName: widgets.find(i => i.name === ownProps.widgetName)?.bcName
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onCancel: (bcName: string) => {
        dispatch($smDo.bcCancelPendingChanges({bcNames: [bcName]}))
    },
    onChange: (payload: ChangeDataItemPayload) => {
        return dispatch($smDo.changeDataItem(payload))
    },
    onClick: (bcName: string, pickMap: PickMap, widgetName?: string) => {
        dispatch($smDo.showViewPopup({bcName, widgetName}))
        dispatch($smDo.viewPutPickMap({map: pickMap, bcName}))
    }
})

const ConnectedPickListField = connect(mapStateToProps, mapDispatchToProps)(PickListField)

export default ConnectedPickListField

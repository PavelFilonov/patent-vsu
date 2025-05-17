import React from 'react'
import {buildBcUrl} from '@tesler-ui/core'
import {connect} from 'react-redux'
import {MultivalueSingleValue, PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {WidgetField} from '@tesler-ui/core/interfaces/widget'
import {Dispatch} from 'redux'
import styles from './CheckboxSelectField.less'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import CheckboxInput from '../../ui/CheckboxInput/CheckboxInput'

interface CheckboxSelectFieldOwnProps {
    value: MultivalueSingleValue[]
    meta: WidgetField
    cursor: string
    disabled: boolean
    widgetName: string
}
interface CheckboxSelectFieldProps extends CheckboxSelectFieldOwnProps {
    bcName: string
    values: Array<{value: string; options?: {disabled?: string}}>
    onSelect: (bcName: string, cursor: string, dataItem: PendingDataItem) => void
}

const CheckboxSelectField: React.FunctionComponent<CheckboxSelectFieldProps> = props => {
    const {value, values, onSelect, bcName, cursor, meta, disabled} = props
    const checkIfDisabled = React.useCallback(
        (disableOption: string) => {
            return disableOption === 'true' || disabled
        },
        [disabled]
    )
    const ifAllSelected = value?.length > 0 && value?.length === values?.filter(i => !checkIfDisabled(i.options?.disabled)).length
    const availableValues = values?.filter(i => !(i.options?.disabled === 'true'))
    const handleSelectAll = React.useCallback(() => {
        let newValue = value.slice() || []
        if (newValue.length < availableValues.length) {
            newValue = availableValues.map(i => {
                return {
                    id: i.value,
                    value: i.value
                }
            })
        } else {
            newValue = []
        }
        onSelect(bcName, cursor, {[meta.key]: newValue})
    }, [value, availableValues, onSelect, bcName, cursor, meta])
    const handleCheckbox = React.useCallback(
        (v: string) => {
            let newValue = value.slice() || []
            const newValueIndex = newValue.findIndex(i => i.value === v)
            if (newValueIndex > -1) {
                newValue.splice(newValueIndex, 1)
            } else {
                newValue = [...newValue, {id: v, value: v}]
            }
            onSelect(bcName, cursor, {[meta.key]: newValue})
        },
        [value, onSelect, bcName, cursor, meta]
    )
    const getValueIndex = React.useCallback(
        (item: string) => {
            return value?.findIndex(v => v.value === item)
        },
        [value]
    )
    return (
        <div className={styles.container}>
            <CheckboxInput
                disabled={!availableValues?.length || disabled}
                onChange={handleSelectAll}
                indeterminate={value?.length > 0 && value?.length < values?.length}
                selected={ifAllSelected}
                value="Select All"
            />
            {values?.map(item => {
                return (
                    <CheckboxInput
                        key={item.value}
                        disabled={checkIfDisabled(item.options.disabled)}
                        onChange={handleCheckbox}
                        selected={getValueIndex(item.value) > -1}
                        value={item.value}
                    />
                )
            })}
        </div>
    )
}

export function mapStateToProps(state: AppState, ownProps: CheckboxSelectFieldOwnProps) {
    const widget = state.view.widgets.find(item => item.name === ownProps.widgetName)
    const bcName = widget?.bcName
    const bcRowMeta = state.view.rowMeta[bcName]
    const bcUrl = buildBcUrl(bcName, true)
    const rowMetaFields = bcUrl && bcRowMeta?.[bcUrl]?.fields
    const field = rowMetaFields?.find(item => item.key === ownProps.meta.key)
    const values = field?.values
    return {
        bcName,
        values
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onSelect: (bcName: string, cursor: string, dataItem: PendingDataItem) => {
            dispatch($smDo.changeDataItem({bcName, cursor, dataItem}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckboxSelectField)

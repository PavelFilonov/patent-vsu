import React from 'react'
import {buildBcUrl, connect} from '@tesler-ui/core'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import cn from 'classnames'
import {SmField} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import IconifiedCheckbox from '../../ui/IconifiedCheckbox/IconifiedCheckbox'
import styles from './IconifiedCheckboxField.less'

interface IconifiedCheckboxFieldOwnProps {
    disabled: boolean
    widgetName: string
    value: MultivalueSingleValue[]
    meta: SmField
    cursor: string
    onChange: (newValue: MultivalueSingleValue[]) => void
}
interface IconifiedCheckboxFieldProps extends IconifiedCheckboxFieldOwnProps {
    values: Array<{value: string; options: {iconType: string}; icon: string}>
    filterValues: Array<{value: string; options: {iconType: string}}>
}

const IconifiedCheckboxField: React.FunctionComponent<IconifiedCheckboxFieldProps> = props => {
    const {onChange, disabled, value, values, filterValues} = props

    const handleCheckbox = React.useCallback(
        (v: string) => {
            const prevValue = value || []
            const index = prevValue.findIndex(i => i.value === v)
            const newValue = prevValue.slice()
            if (index > -1) {
                newValue.splice(index, 1)
            } else {
                newValue.splice(0, 0, {value: v, id: v})
            }
            onChange(newValue)
        },
        [onChange, value]
    )
    return (
        <div className={styles.container}>
            {filterValues?.map(i => {
                const checked = value?.some(filterValue => i.value === filterValue.value)
                return (
                    <IconifiedCheckbox
                        disabled={!values.some(item => item.value === i.value) || disabled}
                        key={i.value}
                        className={cn(styles.wrapper)}
                        value={i.value}
                        selected={checked}
                        iconType={i.options.iconType}
                        onChange={handleCheckbox}
                    />
                )
            })}
        </div>
    )
}

export function mapStateToProps(state: AppState, ownProps: IconifiedCheckboxFieldOwnProps) {
    const widget = state.view.widgets.find(item => item.name === ownProps.widgetName)
    const bcName = widget?.bcName
    const bcRowMeta = state.view.rowMeta[bcName]
    const bcUrl = buildBcUrl(bcName, true)
    const rowMetaFields = bcUrl && bcRowMeta?.[bcUrl]?.fields
    const field = rowMetaFields?.find(item => item.key === ownProps.meta.key)
    const values = field?.values
    const filterValues = field?.filterValues
    return {
        values,
        filterValues
    }
}
export default connect(mapStateToProps)(IconifiedCheckboxField)

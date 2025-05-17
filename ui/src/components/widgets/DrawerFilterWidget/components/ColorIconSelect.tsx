import React from 'react'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {WidgetField} from '@tesler-ui/core/interfaces/widget'
import ColoredCheckbox from '../../../ui/ColoredChecbox/ColoredCheckbox'
import styles from './ColorIconSelect.less'
import getFilterType from '../utils/getFilterType'
import IconifiedCheckbox from '../../../ui/IconifiedCheckbox/IconifiedCheckbox'
import {SmFieldTypes} from '../../../../interfaces/widget'

interface ColorIconSelectProps {
    value: DataValue[]
    filterValues: Array<{
        options?: {
            iconType?: string
            backgroundColor?: string
        }
        value: string
    }>
    displayedValues?: string[]
    setValue: React.Dispatch<DataValue[]>
    fieldName: string
    widgetName: string
    bcName: string
    addFilter: (widgetName: string, bcName: string, filter: BcFilter) => void
    removeFilter: (bcName: string, filter: BcFilter) => void
    fieldType: FieldType | SmFieldTypes
    fieldMeta: WidgetField
}
const ColorIconSelect: React.FunctionComponent<ColorIconSelectProps> = props => {
    const {
        value,
        // name,
        widgetName,
        fieldName,
        setValue,
        bcName,
        fieldType,
        // title,
        filterValues,
        // fieldMeta,
        // filter,
        addFilter,
        removeFilter
        // onMultivalueAssocOpen
    } = props
    const filterType = getFilterType(fieldType)
    const handleSelect = React.useCallback(
        (condition: DataValue[] | number, newValues: DataValue[], prevValues: DataValue[]) => {
            if (condition) {
                addFilter(widgetName, bcName, {
                    type: filterType,
                    fieldName,
                    value: newValues
                })
            } else {
                removeFilter(bcName, {
                    type: filterType,
                    fieldName,
                    value: prevValues
                })
            }
        },
        [addFilter, removeFilter, fieldName, filterType, bcName, widgetName]
    )

    function handleChange(v: string) {
        const prevValue = value || []
        const index = prevValue.findIndex(i => i === v)
        const newValue = prevValue.slice()
        if (index > -1) {
            newValue.splice(index, 1)
        } else {
            newValue.splice(0, 0, v)
        }
        setValue(newValue)
        handleSelect(newValue.length, newValue, prevValue)
    }

    return (
        <div className={styles.colorIconSelectContainer}>
            {filterValues?.map(i => {
                if (i.options?.iconType) {
                    return (
                        <IconifiedCheckbox
                            className={styles.iconifiedWrapper}
                            key={i.value}
                            value={i.value}
                            iconType={i.options.iconType}
                            selected={value?.some(j => j === i.value)}
                            onChange={handleChange}
                        />
                    )
                }
                return (
                    <ColoredCheckbox
                        className={styles.coloredWrapper}
                        key={i.value}
                        value={i.value}
                        backgroundColor={i.options?.backgroundColor ?? '#9e9e9e'}
                        selected={value?.some(j => j === i.value)}
                        onChange={handleChange}
                    />
                )
            })}
        </div>
    )
}

export default React.memo(ColorIconSelect)

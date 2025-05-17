import React from 'react'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import ColoredCheckbox from '../../../ui/ColoredChecbox/ColoredCheckbox'
import styles from './OpenFilter.less'
import getFilterType from '../utils/getFilterType'
import {SmFieldTypes} from '../../../../interfaces/widget'

interface OpenFilterProps {
    value: DataValue[]
    filterValues: Array<{
        value: string
    }>
    setValue: React.Dispatch<DataValue[]>
    fieldName: string
    widgetName: string
    bcName: string
    addFilter: (widgetName: string, bcName: string, filter: BcFilter) => void
    removeFilter: (bcName: string, filter: BcFilter) => void
    fieldType: FieldType | SmFieldTypes
}

const OpenFilter = ({
    value,
    widgetName,
    fieldName,
    setValue,
    bcName,
    fieldType,
    filterValues,
    addFilter,
    removeFilter
}: OpenFilterProps) => {
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
        <>
            {filterValues?.map(i => {
                return (
                    <ColoredCheckbox
                        type="remoteAudit"
                        className={styles.coloredWrapper}
                        key={i.value}
                        value={i.value}
                        selected={value?.some(j => j === i.value)}
                        onChange={handleChange}
                    />
                )
            })}
        </>
    )
}

export default React.memo(OpenFilter)

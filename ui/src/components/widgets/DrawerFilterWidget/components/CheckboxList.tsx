import React, {ReactElement} from 'react'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {CheckboxChangeEvent} from 'antd/lib/checkbox'
import cn from 'classnames'
import {Checkbox} from 'antd'
import styles from './CheckboxList.less'
import getFilterType from '../utils/getFilterType'

interface CheckboxListProps {
    value: DataValue[]
    filterValues: Array<{value: string}>
    setValue: React.Dispatch<DataValue[]>
    fieldName: string
    bcName: string
    addFilter: (bcName: string, filter: BcFilter) => void
    removeFilter: (bcName: string, filter: BcFilter) => void
    fieldType: FieldType
}
// todo use for suitable FieldType in FilterFormInput
function CheckboxList(props: CheckboxListProps): ReactElement<CheckboxListProps> {
    const {value, filterValues, setValue, fieldName, bcName, addFilter, removeFilter, fieldType} = props
    const filterType = getFilterType(fieldType)
    const handleFilter = React.useCallback(
        (condition: DataValue[] | number, newValues: DataValue[], prevValues: DataValue[]) => {
            if (condition) {
                addFilter(bcName, {
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
        [addFilter, removeFilter, fieldName, filterType, bcName]
    )

    const handleCheckbox = (e: CheckboxChangeEvent) => {
        const prevValues = (value as DataValue[]) || []
        const newValues = e.target.checked ? [...prevValues, e.target.value] : prevValues.filter(item => item !== e.target.value)
        setValue(newValues.length ? newValues : null)
        handleFilter(newValues.length, newValues, prevValues)
    }

    const handleAll = (e: CheckboxChangeEvent) => {
        const prevValues = (value as DataValue[]) || []
        const newValues = e.target.checked ? filterValues.map(item => item.value) : null
        setValue(newValues)
        handleFilter(newValues, newValues, prevValues)
    }
    return (
        <div>
            <li className={cn(styles.listItem)}>
                <Checkbox
                    className={styles.checkbox}
                    indeterminate={value?.length > 0 && value?.length < filterValues.length}
                    checked={value?.length === filterValues.length}
                    onChange={handleAll}
                />
                All
            </li>
            <ul className={styles.list}>
                {filterValues.map(item => {
                    const checked = value?.some(filterValue => item.value === filterValue)
                    return (
                        <li className={styles.listItem} key={item.value}>
                            <Checkbox checked={checked} className={styles.checkbox} value={item.value} onChange={handleCheckbox} />
                            {item.value}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default React.memo(CheckboxList)

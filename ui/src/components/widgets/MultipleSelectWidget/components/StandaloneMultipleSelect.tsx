import React from 'react'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import CheckboxInput from '../../../ui/CheckboxInput/CheckboxInput'
import styles from './StandaloneMultipleSelect.less'

interface StandaloneMultipleSelectProps {
    data: DataItem[]
    allSelected: boolean
    indeterminate: boolean
    valueKey: string
    checkIfSelected: (item: DataItem) => boolean
    onSelect: (value: string) => void
    onSelectAll: () => void
    disabled: boolean
}

const StandaloneMultipleSelect: React.FunctionComponent<StandaloneMultipleSelectProps> = props => {
    const {data, checkIfSelected, onSelectAll, disabled, onSelect, valueKey, allSelected, indeterminate} = props
    return (
        <div className={styles.container}>
            {data.length === 0 && <span className={styles.noData}>Нет данных</span>}
            {data.length > 0 && (
                <CheckboxInput
                    value="Выбрать все"
                    onChange={onSelectAll}
                    disabled={disabled}
                    selected={allSelected}
                    indeterminate={indeterminate}
                />
            )}
            {data.map(i => {
                return (
                    <CheckboxInput
                        key={i[valueKey] as string}
                        value={i[valueKey] as string}
                        disabled={disabled}
                        selected={checkIfSelected(i)}
                        onChange={() => onSelect(i[valueKey] as string)}
                    />
                )
            })}
        </div>
    )
}

export default React.memo(StandaloneMultipleSelect)

import React, {ChangeEvent, FC, useCallback, useState} from 'react'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import styles from './OrderCell.less'
import EnterIcon from '../../../assets/icons/ui/enter.svg'

interface OrderCellProps {
    text?: string
    record: DataItem
    index: number
    recordKey: string
    isChanging: boolean
    onChangedInput: (event: ChangeEvent<HTMLInputElement>, index: number) => void
}

const OrderCell: FC<OrderCellProps> = ({record, recordKey, index, isChanging, onChangedInput}) => {
    const [tempValue, setTempValue] = useState('')

    const handlePressEnter = useCallback(
        event => {
            if (event.key === 'Enter') {
                onChangedInput(event, index)
            }
        },
        [onChangedInput, index]
    )

    return isChanging ? (
        <span className={styles.orderContainer}>
            <input
                onBlur={event => onChangedInput(event, index)}
                onChange={event => setTempValue(event.target.value)}
                onKeyPress={handlePressEnter}
                value={tempValue || null}
                placeholder={record[recordKey] as string}
                className={styles.orderInput}
            />
            {tempValue && (
                <span className={styles.enterHint}>
                    <img src={EnterIcon} alt="" />
                </span>
            )}
        </span>
    ) : (
        <span>{record[recordKey]}</span>
    )
}

export default OrderCell

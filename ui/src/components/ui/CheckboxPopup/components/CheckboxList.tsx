import React from 'react'
import {useDispatch} from 'react-redux'
import {AssociatedItem} from '@tesler-ui/core/interfaces/operation'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import {FixedSizeList as List} from 'react-window'
import cn from 'classnames'
import styles from './CheckboxList.less'
import CheckboxInput from '../../CheckboxInput/CheckboxInput'
import {$smDo} from '../../../../actions/actions'

interface CheckboxListProps {
    validationError: boolean
    selectedRecords: DataItem[]
    data: DataItem[]
    bcName: string
    valueKey: string
}
const MAX_SHOWED_ITEMS = 16
const ITEM_HEIGHT = 34
const CheckboxList: React.FunctionComponent<CheckboxListProps> = props => {
    const {data, valueKey, bcName, selectedRecords, validationError} = props
    const dispatch = useDispatch()
    const allSelected = selectedRecords?.length > 0 && selectedRecords?.length === data?.length
    const intermediate = selectedRecords?.length > 0 && selectedRecords?.length < data?.length
    const selectAllHandler = React.useCallback(() => {
        dispatch(
            $smDo.changeDataItems({
                bcName,
                cursors: data.map(i => i.id),
                dataItems: data.map(i => ({
                    ...i,
                    _value: i[valueKey],
                    _associate: !allSelected
                }))
            })
        )
    }, [dispatch, bcName, data, valueKey, allSelected])
    const createSelectHandler = React.useCallback(
        (dataItem: AssociatedItem) => () => {
            dispatch($smDo.changeDataItem({bcName, cursor: dataItem.id, dataItem}))
        },
        [dispatch, bcName]
    )

    const Row = React.memo(({index, style}: {index: number; style: React.CSSProperties}) => {
        const selected = !!selectedRecords.find(item => data[index].id === item.id)
        const selectHandler = createSelectHandler({
            id: data[index].id,
            vstamp: data[index].vstamp,
            _value: data[index][valueKey],
            _associate: !selected
        })
        return (
            <div style={style}>
                <CheckboxInput
                    key={data[index].id}
                    value={data[index][valueKey] as string}
                    selected={selected}
                    onChange={selectHandler}
                    className={cn({[styles.validationError]: validationError})}
                />
            </div>
        )
    })
    Row.displayName = 'Row'
    const len = data?.length || 0
    return (
        <div className={styles.checkboxList}>
            {len > 0 && (
                <CheckboxInput value="Select All" selected={allSelected} indeterminate={intermediate} onChange={selectAllHandler} />
            )}
            <List itemSize={ITEM_HEIGHT} height={ITEM_HEIGHT * MAX_SHOWED_ITEMS} itemCount={len} width="100%">
                {Row}
            </List>
        </div>
    )
}

export default React.memo(CheckboxList)

import React from 'react'
import {FixedSizeList as List} from 'react-window'
import {useDispatch} from 'react-redux'
import cn from 'classnames'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import styles from './DashboardMultipleSelectCheckboxList.less'
import CheckboxInput from '../../../ui/CheckboxInput/CheckboxInput'
import {$smDo} from '../../../../actions/actions'
import {getClearedFields} from '../../../../utils/getClearefFields'
import {SmField, SmWidgetMeta} from '../../../../interfaces/widget'

interface DashboardMultipleSelectCheckboxListProps {
    validationError: boolean
    cursor: string
    meta: SmWidgetMeta
    fieldMeta: SmField
    filterQuery: string
    data: string[]
    value: string[]
}
const MAX_SHOWED_ITEMS = 16
const ITEM_HEIGHT = 34

const emptyResult: string[] = []
const DashboardMultipleSelectCheckboxList: React.FunctionComponent<DashboardMultipleSelectCheckboxListProps> = props => {
    const {data, filterQuery, value, cursor, meta, fieldMeta, validationError} = props
    const {bcName, fields} = meta
    let result = emptyResult
    if (data) {
        if (filterQuery.length === 0) {
            result = data
        } else {
            result = data.filter(i => i.toLowerCase().includes(filterQuery))
        }
    }
    const dispatch = useDispatch()
    const handleChange = React.useCallback(
        (v: string) => {
            const index = value.findIndex(i => i === v)
            const newValue = value.slice()
            if (index > -1) {
                newValue.splice(index, 1)
            } else {
                newValue.splice(0, 0, v)
            }
            const r: MultivalueSingleValue[] = []
            newValue.map(item => r.push({id: item, value: item}))
            dispatch($smDo.changeDataItem({cursor, bcName, dataItem: {...getClearedFields(fields), [fieldMeta?.key]: r}}))
        },
        [value, dispatch, cursor, bcName, fieldMeta, fields]
    )
    const allSelected = value?.length > 0 && value.length === result?.length
    const intermediate = value?.length > 0 && value.length < result?.length
    const handleChangeAll = React.useCallback(() => {
        const r = !allSelected ? result.map(item => ({id: item, value: item})) : []
        dispatch($smDo.changeDataItem({cursor, bcName, dataItem: {...getClearedFields(fields), [fieldMeta?.key]: r}}))
    }, [dispatch, cursor, bcName, fieldMeta, allSelected, result, fields])
    const createChangeHandler = React.useCallback((v: string) => () => handleChange(v), [handleChange])
    const Row = React.memo(({index, style}: {index: number; style: React.CSSProperties}) => {
        const selected = value.includes(result[index])
        return (
            <div style={style}>
                <CheckboxInput
                    className={cn({[styles.validationError]: validationError})}
                    key={result[index]}
                    value={result[index]}
                    selected={selected}
                    onChange={createChangeHandler(result[index])}
                />
            </div>
        )
    })
    Row.displayName = 'Row'
    const len = result.length || 0
    return (
        <div className={styles.checkboxList}>
            {len > 0 && <CheckboxInput value="Select All" selected={allSelected} indeterminate={intermediate} onChange={handleChangeAll} />}
            <List itemSize={ITEM_HEIGHT} height={ITEM_HEIGHT * MAX_SHOWED_ITEMS} itemCount={len} width="100%">
                {Row}
            </List>
        </div>
    )
}

export default React.memo(DashboardMultipleSelectCheckboxList)

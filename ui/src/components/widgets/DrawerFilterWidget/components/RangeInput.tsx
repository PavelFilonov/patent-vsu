import React from 'react'
import {Input} from 'antd'
import cn from 'classnames'
import {$do, NumberInput} from '@tesler-ui/core'
import {useDispatch, useSelector} from 'react-redux'
import {BcFilter, FilterType} from '@tesler-ui/core/interfaces/filters'
import {NumberTypes} from '@tesler-ui/core/components/ui/NumberInput/formaters'
import styles from './RangeInput.less'
import {AppState} from '../../../../interfaces/reducers'

interface RangeInputProps {
    fieldName: string
    bcName: string
}

function RangeInput({fieldName, bcName}: RangeInputProps) {
    const topFilter = useSelector((state: AppState) =>
        state.screen.filters[bcName]?.find(item => item.fieldName === fieldName && item.type === FilterType.lessOrEqualThan)
    )
    const bottomFilter = useSelector((state: AppState) =>
        state.screen.filters[bcName]?.find(item => item.fieldName === fieldName && item.type === FilterType.greaterOrEqualThan)
    )
    const [top, setTop] = React.useState(topFilter ? topFilter.value : null)
    const [bottom, setBottom] = React.useState(bottomFilter ? bottomFilter.value : null)
    React.useEffect(() => {
        if (!bottomFilter) {
            setBottom(null)
        }
        if (!topFilter) {
            setTop(null)
        }
    }, [bottomFilter, topFilter])
    const dispatch = useDispatch()
    const createNumberInputChangeHandler = React.useCallback(
        (type: 'top' | 'bottom') => (v: number) => {
            const isTop = type === 'top'
            if (isTop) {
                setTop(v)
            } else {
                setBottom(v)
            }
            const newFilter: BcFilter = {
                type: isTop ? FilterType.lessOrEqualThan : FilterType.greaterOrEqualThan,
                value: v,
                fieldName
            }
            if (v) {
                dispatch($do.bcAddFilter({bcName, filter: newFilter}))
            } else {
                dispatch($do.bcRemoveFilter({bcName, filter: isTop ? topFilter : bottomFilter}))
            }
        },
        [fieldName, bcName, topFilter, bottomFilter]
    )
    return (
        <div className={cn(styles.wrapper)}>
            <Input.Group compact>
                <NumberInput
                    value={bottom as number}
                    placeholder="From"
                    type={'percent' as NumberTypes}
                    digits={0}
                    nullable
                    onChange={createNumberInputChangeHandler('bottom')}
                />
                <Input disabled placeholder="⇀" />
                <NumberInput
                    value={top as number}
                    placeholder="To"
                    type={'percent' as NumberTypes}
                    digits={0}
                    nullable
                    onChange={createNumberInputChangeHandler('top')}
                />
            </Input.Group>
        </div>
    )
}

export default React.memo(RangeInput)

import React, {memo, useCallback} from 'react'
import {$do} from '@tesler-ui/core'
import {FilterType} from '@tesler-ui/core/interfaces/filters'
import {useDispatch, useSelector} from 'react-redux'
import styled from '@emotion/styled'
import {$smDo} from '../../actions/actions'
import Checkbox from '../ui/Checkbox/Checkbox'
import {SmWidgetMeta} from '../../interfaces/widget'
import {AppState} from '../../interfaces/reducers'

interface CheckboxFiltersOwnProps {
    widgetMeta: SmWidgetMeta
}

const Container = styled.div`
    display: flex;
    gap: 8px;

    span {
        font-family: mbCorpoS_textOffice_regular;
    }
`

const CheckboxFilters = memo(({widgetMeta}: CheckboxFiltersOwnProps) => {
    const filters = useSelector((state: AppState) => state.screen.filters)
    const dispatch = useDispatch()
    const {
        options: {checkboxFiltersList},
        bcName,
        name
    } = widgetMeta

    const onClickFilter = useCallback(
        (fieldName: string, value: boolean) => {
            const filter = {value, fieldName, type: FilterType.specified}
            dispatch(!value ? $do.bcRemoveFilter({bcName, filter}) : $smDo.smBcAddFilter({bcName, widgetName: name, filter}))
            dispatch($do.bcForceUpdate({bcName}))
        },
        [bcName, dispatch, name]
    )

    const isChecked = useCallback(
        (filterName: string) => !!filters?.[bcName]?.find(({fieldName: currentFieldName}) => currentFieldName === filterName)?.fieldName,
        [bcName, filters]
    )

    return (
        <Container>
            {checkboxFiltersList?.map(filter => {
                const {filterKey, filterName} = filter
                return (
                    <>
                        <Checkbox
                            checked={isChecked(filterKey)}
                            onChange={e => onClickFilter(filterKey, e.target.checked)}
                            key={filterKey}
                        />
                        <span>{filterName}</span>
                    </>
                )
            })}
        </Container>
    )
})

export default CheckboxFilters

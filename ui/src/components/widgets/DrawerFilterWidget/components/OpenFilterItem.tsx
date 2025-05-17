import React, {useCallback, useState} from 'react'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {$do} from '@tesler-ui/core'
import {WidgetField} from '@tesler-ui/core/interfaces/widget'
import {useDispatch, useSelector} from 'react-redux'
import {VsuBcFilter} from '../../../../interfaces/filters'
import {AppState} from '../../../../interfaces/reducers'
import {$smDo} from '../../../../actions/actions'
import {SmFieldTypes} from '../../../../interfaces/widget'
import OpenFilter from './OpenFilter'
import {useRefState} from '../../../../hooks/useRefState'

export interface OpenFilterItemProps {
    name: string
    widgetName: string
    bcName: string
    fieldType: FieldType | SmFieldTypes
    title: string
    filterValues?: Array<{
        options?: {
            backgroundColor?: string
        }
        value: string
    }>
    fieldMeta: WidgetField
}

export const OpenFilterItem = ({name, widgetName, bcName, fieldType, filterValues}: OpenFilterItemProps) => {
    const {filter, activeFiltersLength} = useSelector((state: AppState) => {
        return {
            filter: state.screen.filters[bcName]?.find(item => item.fieldName === name),
            activeFiltersLength: state.screen.activeFiltersLengthList[bcName]
        }
    })
    const [oldActiveFiltersLength, setOldActiveFiltersLength] = useRefState(activeFiltersLength)

    const [value, setValue] = useState(filter ? filter.value : null)

    React.useEffect(() => {
        if (activeFiltersLength !== oldActiveFiltersLength.current) {
            setValue(filter ? filter.value : null)
            setOldActiveFiltersLength(activeFiltersLength)
        }
    }, [activeFiltersLength, filter, oldActiveFiltersLength, setOldActiveFiltersLength, setValue])

    const dispatch = useDispatch()

    const removeFilter = useCallback(
        (filterBcName: string, bcFilter: VsuBcFilter) => {
            dispatch($do.bcRemoveFilter({bcName: filterBcName, filter: bcFilter}))
            dispatch($do.bcForceUpdate({bcName: filterBcName}))
            dispatch($smDo.bcForceUpdateActiveFilterLength({bcName: filterBcName}))
        },
        [dispatch]
    )
    const addFilter = useCallback(
        (filterWidgetName: string, filterBcName: string, bcFilter: VsuBcFilter) => {
            dispatch($smDo.smBcAddFilter({bcName: filterBcName, filter: bcFilter, widgetName: filterWidgetName}))
            dispatch($do.bcForceUpdate({bcName: filterBcName}))
            dispatch($smDo.bcForceUpdateActiveFilterLength({bcName: filterBcName}))
        },
        [dispatch]
    )

    return (
        <OpenFilter
            widgetName={widgetName}
            value={value as DataValue[]}
            filterValues={filterValues}
            setValue={setValue}
            fieldName={name}
            bcName={bcName}
            addFilter={addFilter}
            removeFilter={removeFilter}
            fieldType={fieldType}
        />
    )
}

export default React.memo(OpenFilterItem)

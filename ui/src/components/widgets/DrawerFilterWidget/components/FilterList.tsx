import React from 'react'
import {SmWidgetMeta} from '../../../../interfaces/widget'
import FilterFormInput from './FilterFormInput'
import {FilterableField} from '../interfaces'

interface FilterListProps {
    filterFields: FilterableField[]
    meta: SmWidgetMeta
}

const FilterList: React.FunctionComponent<FilterListProps> = props => {
    const {filterFields, meta} = props
    return (
        <>
            {filterFields.map((field: FilterableField) => {
                const fieldMeta = meta.fields.find(item => item.key === field.key)
                return (
                    <FilterFormInput
                        widgetName={meta.name}
                        bcName={meta.bcName}
                        name={field.key}
                        key={field.key}
                        title={field.title}
                        fieldType={field.type}
                        filterValues={field.filterValues}
                        fieldMeta={fieldMeta}
                    />
                )
            })}
        </>
    )
}

export default React.memo(FilterList)

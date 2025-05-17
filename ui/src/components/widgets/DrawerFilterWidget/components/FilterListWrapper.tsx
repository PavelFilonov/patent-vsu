import React from 'react'
import cn from 'classnames'
import {SmWidgetMeta} from '../../../../interfaces/widget'
import styles from './FilterListWrapper.less'
import FilterList from './FilterList'
import {NUMBER_DEFAULT_FILTERS} from '../consts'
import {FilterableField} from '../interfaces'

interface FilterListWrapperProps {
    filterFields: FilterableField[]
    meta: SmWidgetMeta
    showExtraFilters: boolean
}

const FilterListWrapper: React.FunctionComponent<FilterListWrapperProps> = props => {
    const {filterFields, meta, showExtraFilters} = props
    const shovedFilterFields = filterFields.slice(0, NUMBER_DEFAULT_FILTERS)
    const extraFilterFields = filterFields.slice(NUMBER_DEFAULT_FILTERS)

    return (
        <div className={cn(styles.scrollableContent)}>
            <FilterList meta={meta} filterFields={shovedFilterFields} />
            {showExtraFilters && <FilterList meta={meta} filterFields={extraFilterFields} />}
        </div>
    )
}

export default React.memo(FilterListWrapper)

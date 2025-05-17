import React from 'react'
import {$do, connect} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {BcFilter, FilterGroup} from '@tesler-ui/core/interfaces/filters'
import {Select} from 'antd'
import styles from './PredefinedFiltersSelector.less'
import {AppState} from '../../../interfaces/reducers'
import {parseFilters} from '../../../utils/filters'
import down from './img/down.svg'

interface PredefinedFiltersSelectorOwnProps {
    filterGroups: FilterGroup[]
    bcName: string
}

interface PredefinedFiltersSelectorProps extends PredefinedFiltersSelectorOwnProps {
    filters: BcFilter[]
    onRemoveFilters: (bcName: string) => void
    onApplyFilter: (bcName: string, filter: BcFilter) => void
    onForceUpdate: (bcName: string) => void
}

const PredefinedFiltersSelector: React.FunctionComponent<PredefinedFiltersSelectorProps> = props => {
    const {filterGroups, bcName, filters, onRemoveFilters, onApplyFilter, onForceUpdate} = props
    const [filterGroupName, setFilterGroupName] = React.useState(null)

    const handleAddFilters = React.useCallback(
        (value: string) => {
            const filterGroup = filterGroups.find(item => item.name === value)
            const parsedFilters = parseFilters(filterGroup.filters)
            setFilterGroupName(filterGroup.name)
            onRemoveFilters(bcName)
            parsedFilters.forEach(item => onApplyFilter(bcName, item))
            onForceUpdate(bcName)
        },
        [filterGroups, bcName, onApplyFilter, onForceUpdate, onRemoveFilters]
    )

    React.useEffect(() => {
        let activeFilterGroupName: string = null
        const fltrs = JSON.stringify(filters)
        filterGroups.forEach(item => {
            const filterGroup = JSON.stringify(parseFilters(item.filters))
            if (fltrs === filterGroup) {
                activeFilterGroupName = item.name
            }
        })
        setFilterGroupName(activeFilterGroupName)
    }, [filterGroups, filters])

    const filtersSelection = React.useMemo(() => {
        return (
            <Select
                suffixIcon={<img src={down} alt="down" />}
                value={filterGroupName ?? 'Show all'}
                onChange={handleAddFilters}
                dropdownMatchSelectWidth={false}
                dropdownClassName={styles.dropdown}
            >
                {filterGroups.map(group => (
                    <Select.Option key={group.name} value={group.name}>
                        <span>{group.name}</span>
                    </Select.Option>
                ))}
            </Select>
        )
    }, [filterGroups, filterGroupName, handleAddFilters])

    return <div className={styles.container}>{filtersSelection}</div>
}

function mapStateToProps(store: AppState, ownProps: PredefinedFiltersSelectorOwnProps) {
    const {bcName} = ownProps
    const filters = store.screen.filters[bcName]
    return {
        filters
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onRemoveFilters: (bcName: string) => {
            dispatch($do.bcRemoveAllFilters({bcName}))
        },
        onApplyFilter: (bcName: string, filter: BcFilter) => {
            dispatch($do.bcAddFilter({bcName, filter}))
        },
        onForceUpdate: (bcName: string) => {
            dispatch($do.bcForceUpdate({bcName}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PredefinedFiltersSelector)

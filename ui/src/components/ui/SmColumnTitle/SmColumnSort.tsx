import React, {FunctionComponent} from 'react'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import cn from 'classnames'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import increment from './img/increment.svg'
import decrement from './img/decrement.svg'
import styles from './SmColumnSort.less'

export interface ColumnSortOwnProps {
    shown: boolean
    className?: string
    widgetName: string
    fieldKey: string
}
export interface BcSorter {
    fieldName: string
    direction: 'asc' | 'desc'
}
export interface ColumnSortProps extends ColumnSortOwnProps {
    sorter: BcSorter
    bcName: string
    page: number
    infinitePagination: boolean
    onSort: (bcName: string, sorter: BcSorter, page: number, widgetName: string, infinitePagination: boolean) => void
}
enum SmSortIconType {
    inc = 'increment',
    dec = 'decrement'
}
export const SmColumnSort: FunctionComponent<ColumnSortProps> = props => {
    const {className, widgetName, fieldKey, sorter, bcName, page, infinitePagination, onSort, shown} = props
    let icon = SmSortIconType.dec
    let direction: 'asc' | 'desc' = 'asc'
    if (sorter) {
        icon = sorter.direction === 'asc' ? SmSortIconType.inc : SmSortIconType.dec
    }
    if (!sorter) {
        direction = 'desc'
    }
    if (sorter && sorter.direction === 'asc') {
        direction = 'desc'
    }

    const handleSort = () => {
        const newSorter: BcSorter = {
            fieldName: fieldKey,
            direction
        }
        onSort(bcName, newSorter, page, widgetName, infinitePagination)
    }
    const handleKeyUp = (e: React.KeyboardEvent<HTMLImageElement>) => {
        if (e.keyCode === 32) {
            handleSort()
        }
    }

    return (
        <div role="button" onClick={handleSort} onKeyUp={handleKeyUp} tabIndex={0}>
            <img
                className={cn(className, styles.ml7, styles.sortIcon, {
                    [styles.shown]: sorter || shown,
                    [styles.notShown]: !sorter
                })}
                alt={icon === SmSortIconType.inc ? SmSortIconType.inc : SmSortIconType.dec}
                src={icon === SmSortIconType.inc ? increment : decrement}
            />
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: ColumnSortOwnProps) {
    const widget = store.view.widgets.find(item => item.name === ownProps.widgetName)
    const widgetName = widget?.name
    const bcName = widget?.bcName
    const sorter = store.screen.sorters[bcName]?.find(item => item.fieldName === ownProps.fieldKey)
    const page = store.screen.bo.bc[bcName]?.page
    const infiniteWidgets: string[] = store.view.infiniteWidgets || []
    const infinitePagination = infiniteWidgets.includes(widgetName)
    return {
        bcName,
        widgetName,
        infinitePagination,
        sorter,
        page
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onSort: (bcName: string, sorter: BcSorter, page: number, widgetName: string, infinitePagination: boolean) => {
            dispatch($smDo.bcAddSorter({bcName, sorter}))
            if (infinitePagination) {
                dispatch(
                    $smDo.bcFetchDataPages({
                        bcName,
                        widgetName,
                        from: 1,
                        to: page
                    })
                )
            } else {
                dispatch(
                    $smDo.bcForceUpdate({
                        bcName,
                        widgetName
                    })
                )
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmColumnSort)

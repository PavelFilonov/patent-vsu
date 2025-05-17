import React from 'react'
import {$do, connect, Pagination as CorePagination} from '@tesler-ui/core'
import {PaginationMode} from '@tesler-ui/core/interfaces/widget'
import {Dispatch} from 'redux'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {Icon, Select} from 'antd'
import cn from 'classnames'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import styles from './Pagination.less'
import {generateRange} from '../../../utils/range'

import {SmPaginationMode, SmPaginationTypes, SmWidgetMeta} from '../../../interfaces/widget'

export interface PaginationOwnProps {
    // data: any
    bcName: string
    widgetName?: string
    mode: SmPaginationMode
    onChangePage?: () => void
    meta?: SmWidgetMeta
}

interface PaginationProps extends PaginationOwnProps {
    page: number
    changePage: (bcName: string, page: number) => void
    changeLimit: (bcName: string, limit: number) => void
    // filters: BcFilter[]
    // onFetchCount: (bcName: string, filters: BcCountParamsMap, parentCursor?: string) => void
    count: {count: number; error: boolean}
    limit: number
}

interface PageInfo {
    pageNumber: number
    separator?: boolean
}

const PAGES_TO_SHOW = 5
const LIMIT_OPTIONS = [5, 10, 15]
const SEPARATOR: PageInfo = {pageNumber: -1, separator: true}
const SEPARATOR_CONTENT = '...'

const numberToPageInfo = (num: number): PageInfo => ({pageNumber: num})

const generateDisplayedPageNumbers = (pageCount: number, currentPage: number, pagesToShow: number) => {
    const pageNumbers: PageInfo[] = []

    if (pageCount <= pagesToShow) {
        pageNumbers.push(...generateRange(1, pageCount).map(numberToPageInfo))
    } else {
        const pageCountCeil = Math.ceil(pagesToShow / 2)
        const pageCountFloor = Math.floor(pagesToShow / 2)
        if (currentPage <= pageCountCeil) {
            pageNumbers.push(...generateRange(1, pagesToShow).map(numberToPageInfo))
            if (currentPage + pagesToShow < pageCount) {
                pageNumbers.push(SEPARATOR, numberToPageInfo(pageCount))
                return pageNumbers
            }
        } else {
            const pageToStart = currentPage - pageCountFloor
            pageNumbers.push(numberToPageInfo(1))
            if (pageToStart > 2) {
                pageNumbers.push(SEPARATOR)
            }
            pageNumbers.push(...generateRange(pageToStart, currentPage).map(numberToPageInfo))
        }
        if (currentPage > pageCount - pageCountCeil) {
            pageNumbers.push(...generateRange(currentPage + 1, pageCount).map(numberToPageInfo))
        } else {
            pageNumbers.push(
                ...generateRange(currentPage + 1, currentPage + pageCountFloor)
                    .filter(num => !pageNumbers.some(pageNumber => pageNumber.pageNumber === num))
                    .map(numberToPageInfo)
            )
            if (currentPage < pageCount - pageCountCeil) {
                pageNumbers.push(SEPARATOR)
            }
            pageNumbers.push(numberToPageInfo(pageCount))
        }
    }

    return pageNumbers
}

const Pagination: React.FunctionComponent<PaginationProps> = (props: PaginationProps) => {
    const {bcName, widgetName, mode, onChangePage, count, limit, page, changePage, changeLimit, meta} = props
    const pagesToShow = meta?.options?.pagination?.pagesToShow || PAGES_TO_SHOW
    const showSelectOptions = !meta?.options?.pagination?.hideSelectOptions

    const pageCount = Math.ceil((count?.count ?? 0) / limit)

    const [limitOptions, setLimitOptions] = React.useState(meta?.options?.pagination?.limitOptions || LIMIT_OPTIONS)

    React.useEffect(() => {
        if (limit && !limitOptions.includes(limit)) {
            setLimitOptions([...limitOptions, limit])
        }
    }, [limit, limitOptions, setLimitOptions])

    const onPrevPage = React.useCallback(() => {
        if (page > 1) changePage(bcName, page - 1)
    }, [bcName, page, changePage])

    const onNextPage = React.useCallback(() => {
        if (page < pageCount) changePage(bcName, page + 1)
    }, [bcName, page, changePage, pageCount])

    const createPageHandler = (pageNumber: number) => () => {
        if (pageNumber !== page) {
            changePage(bcName, pageNumber)
        }
    }

    const pageNumbers: PageInfo[] = React.useMemo(() => generateDisplayedPageNumbers(pageCount, page, pagesToShow), [
        pageCount,
        page,
        pagesToShow
    ])

    const handleLimitChange = (value: number) => {
        changeLimit(bcName, value)
    }
    const isCorePagination = mode !== SmPaginationTypes.pageNumbers || count?.error
    return isCorePagination ? (
        <CorePagination bcName={bcName} widgetName={widgetName} mode={mode as PaginationMode} onChangePage={onChangePage} />
    ) : (
        <>
            {pageCount > 1 && (
                <div className={styles.container}>
                    <div className={styles.pagination}>
                        <div
                            onKeyUp={onPrevPage}
                            role="button"
                            tabIndex={0}
                            className={cn(styles.item, {[styles.disabled]: page === 1})}
                            onClick={onPrevPage}
                        >
                            <Icon type="left" />
                        </div>
                        {pageNumbers?.map(({pageNumber, separator}) => (
                            <div
                                className={cn(styles.item, {
                                    [styles.active]: pageNumber === page
                                })}
                                role="button"
                                tabIndex={0}
                                onKeyUp={separator ? null : createPageHandler(pageNumber)}
                                onClick={separator ? null : createPageHandler(pageNumber)}
                                key={pageNumber}
                            >
                                {separator ? SEPARATOR_CONTENT : pageNumber}
                            </div>
                        ))}
                        <div
                            onKeyUp={onNextPage}
                            role="button"
                            tabIndex={0}
                            className={cn(styles.item, {
                                [styles.disabled]: page === pageCount || pageCount === 0
                            })}
                            onClick={onNextPage}
                        >
                            <Icon type="right" />
                        </div>
                    </div>
                    {showSelectOptions && (
                        <Select
                            dropdownClassName={styles.dropdown}
                            dropdownMatchSelectWidth={false}
                            onChange={handleLimitChange}
                            value={limit}
                        >
                            {LIMIT_OPTIONS.map(option => (
                                <Select.Option value={option} key={option}>
                                    {option} / page
                                </Select.Option>
                            ))}
                            {!LIMIT_OPTIONS.includes(limit) && (
                                <Select.Option value={limit} key={limit}>
                                    {limit} / page
                                </Select.Option>
                            )}
                        </Select>
                    )}
                </div>
            )}
        </>
    )
}

function mapStateToProps(store: AppState, ownProps: PaginationOwnProps) {
    const bc = store.screen.bo.bc[ownProps.bcName]
    const bcCountState = store.view.smBcRecordsCount
    const filters = store.screen.filters[ownProps.bcName]
    return {
        filters,
        count: bcCountState[ownProps.bcName],
        page: bc?.page,
        limit: bc?.limit
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onFetchCount: (bcName: string, filters: BcFilter) => {
            dispatch($smDo.getBcCount({bcName, params: filters}))
        },
        changePage: (bcName: string, page: number) => {
            dispatch($do.bcChangePage({bcName, page}))
        },
        changeLimit: (bcName: string, limit: number) => {
            dispatch($smDo.changeBcLimit({bcName, limit}))
            dispatch($do.bcForceUpdate({bcName}))
            dispatch($do.bcChangePage({bcName, page: 1}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination)

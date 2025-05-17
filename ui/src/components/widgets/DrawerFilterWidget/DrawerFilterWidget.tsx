import React from 'react'
import {$do, buildBcUrl, useTranslation} from '@tesler-ui/core'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {Drawer} from 'antd'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import cn from 'classnames'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {WidgetMeta} from '@tesler-ui/core/interfaces/widget'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {AppState} from '../../../interfaces/reducers'
import {SmWidgetMeta, SmField} from '../../../interfaces/widget'
import styles from './DrawerFilterWidget.less'
import FiltersControlButtons from './components/FiltersControlButtons'
import DrawerControlButton from './components/DrawerControlButton'
import FilterListWrapper from './components/FilterListWrapper'
import Portal from '../../ui/Portal/Portal'
import DrawerFilterExtendedMode from './components/DrawerFilterExtendedMode'
import getFields from '../../../utils/getFields'
import {$smDo, setPopupWithInputValue} from '../../../actions/actions'
import OpenFilterList from './components/OpenFilterList'

export interface FilterableField extends RowMetaField {
    title: string
    type: FieldType
}

export interface DrawerFilterWidgetOwnProps {
    selectContainer?: () => Element
    meta: SmWidgetMeta
    width?: number
    type?: 'remoteAudit'
}

export interface UseDrawerFilterState {
    openFilterFields?: FilterableField[]
    filterFields: FilterableField[]
    filterLength: number
    activeFiltersLength: number
}

export type DrawerFilterWidgetProps = DrawerFilterWidgetOwnProps

interface UseDrawerState {
    extendedMode: boolean
    filters: BcFilter[]
    listWidget: WidgetMeta
    rowMetaFields: RowMetaField[]
    activeFiltersLength: number
}

function mapStateToProps(store: AppState, bcName: string, widgetName: string): UseDrawerState {
    const bcUrl = buildBcUrl(bcName, true)
    const bcRowMeta = store.view.rowMeta[bcName]
    const rowMetaFields = bcUrl && bcRowMeta?.[bcUrl]?.fields
    const listWidget = store.view.widgets.find(widget => widget.name === widgetName)
    return {
        extendedMode: store.view.smDrawerFilterExtendedMode?.[widgetName],
        rowMetaFields,
        listWidget,
        filters: store.screen.filters[bcName],
        activeFiltersLength: store.screen.activeFiltersLengthList[bcName] ?? 0
    }
}

const removeNotSelectedFromMetaFields = <T extends Partial<RowMetaField[]>>(fields?: T) => {
    return fields?.map(item => {
        item.filterValues = item.filterValues?.filter(filterValue => filterValue?.value !== 'Not selected')

        return item
    })
}

function useFiltersOrder(filterFields: FilterableField[], filtersOrder: string[]) {
    return React.useMemo(() => {
        let orderedListFilterableFields: FilterableField[] = []
        if (!filterFields || !filtersOrder) {
            orderedListFilterableFields = filterFields
        } else {
            const copy = [...filterFields]
            orderedListFilterableFields = filtersOrder.map(fieldKey => {
                const index = copy.findIndex(item => item.key === fieldKey)
                const element = copy[index]
                copy.splice(index, 1)
                return element
            })
            orderedListFilterableFields = orderedListFilterableFields.concat([...copy])
        }
        return orderedListFilterableFields
    }, [filterFields, filtersOrder])
}

function useDrawerFilterState(
    widgetName: string,
    bcName: string,
    filtersOrder?: string[],
    filtersExtension?: {[fieldKey: string]: Array<Record<string, DataValue>>},
    openFiltersOrder?: string[]
): UseDrawerFilterState {
    const mapping = React.useCallback(store => mapStateToProps(store, bcName, widgetName), [bcName, widgetName])
    const state = useSelector(mapping, shallowEqual)
    const extendedFields = !state.extendedMode
        ? state.rowMetaFields
        : state.rowMetaFields?.map(i => {
              if (filtersExtension?.[i.key]) {
                  return {
                      ...i,
                      filterValues: [...i.filterValues, ...filtersExtension?.[i.key]]
                  } as RowMetaField
              }
              return i
          })
    const allFilterableFields = removeNotSelectedFromMetaFields(extendedFields?.filter((field: RowMetaField) => field.filterable))
    const listWidgetFields = state.listWidget?.fields && getFields(state.listWidget.fields as SmField[])
    const listWidgetFieldsKeys = listWidgetFields?.map(field => field.key)
    const listFilterableFields = allFilterableFields?.filter((filterableField: RowMetaField) =>
        listWidgetFieldsKeys.includes(filterableField.key)
    )
    const filterFields: FilterableField[] = listFilterableFields?.map((field: RowMetaField) => {
        const founded = listWidgetFields.find((i: SmField) => i.key === field.key)
        return {
            ...field,
            title: founded?.title,
            type: founded?.type
        }
    })
    const orderedListFilterableFields = useFiltersOrder(filterFields, filtersOrder)
    const openOrderedListFilterableFields =
        openFiltersOrder && orderedListFilterableFields?.filter(item => openFiltersOrder.includes(item.key))
    let filterLength = 0
    state.filters?.forEach((filter: BcFilter) => {
        if (Array.isArray(filter.value)) {
            filterLength += filter.value.length
        } else {
            filterLength += 1
        }
    })
    return {
        openFilterFields: openOrderedListFilterableFields,
        filterFields: orderedListFilterableFields,
        filterLength,
        activeFiltersLength: state.activeFiltersLength
    }
}

export function DrawerFilterWidget({selectContainer, meta, width, type}: DrawerFilterWidgetProps) {
    const {t} = useTranslation()
    const [drawerVisible, setDrawerVisible] = React.useState(false)
    const dispatch = useDispatch()
    const state = useDrawerFilterState(
        meta.name,
        meta.bcName,
        meta.options?.filtersOrder,
        meta.options?.filtersExtension,
        meta.options?.openFiltersOrder
    )

    const [isExtraFiltersShown, setIsExtraFiltersShown] = React.useState(state.filterLength > 0)
    const handleShowExtraFilters = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        setIsExtraFiltersShown(!isExtraFiltersShown)
    }

    const handleChangeVisible = () => setDrawerVisible(!drawerVisible)
    const handleSearch = React.useCallback(() => {
        setDrawerVisible(false)
        dispatch($do.bcForceUpdate({bcName: meta.bcName}))
        dispatch($smDo.bcForceUpdateActiveFilterLength({bcName: meta.bcName}))
    }, [dispatch, meta.bcName, setDrawerVisible])
    const handleResetFilters = React.useCallback(() => {
        setDrawerVisible(false)
        dispatch($do.bcRemoveAllFilters({bcName: meta.bcName}))
        dispatch($do.bcForceUpdate({bcName: meta.bcName}))
        dispatch($smDo.bcResetActiveFilterLength({bcName: meta.bcName}))
    }, [dispatch, meta.bcName, setDrawerVisible])
    const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        handleSearch()
    }
    const handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        handleResetFilters()
        dispatch(setPopupWithInputValue(null))
    }

    const isNoAddedFilters = state.filterFields?.findIndex(i => i === undefined) > -1 || state.filterFields?.length === 0
    const filtersPresent = !isNoAddedFilters && state.filterFields?.length > 0
    console.log(state)
    const SmDrawer = (
        <Drawer
            style={selectContainer ? {position: 'absolute'} : {}}
            width={width || 363}
            placement="right"
            onClose={handleChangeVisible}
            closable
            visible={drawerVisible}
            getContainer={false}
            mask={false}
            maskClosable={false}
            zIndex={1010}
            title={t('Фильтры')}
        >
            {drawerVisible && (
                <div className={cn(styles.drawerBodyContainer, width && styles.customWidth)}>
                    {isNoAddedFilters && t('Нет фильтров')}
                    {filtersPresent && (
                        <>
                            <FilterListWrapper filterFields={state.filterFields} meta={meta} showExtraFilters={isExtraFiltersShown} />
                            <DrawerFilterExtendedMode meta={meta} />
                            <FiltersControlButtons
                                bcName={meta.bcName}
                                onSubmit={handleSubmit}
                                filterFieldsLength={state.filterFields.length}
                                filterLength={state.filterLength}
                                handleReset={handleReset}
                                handleShowExtraFilters={handleShowExtraFilters}
                                isExtraFiltersShown={isExtraFiltersShown}
                            />
                        </>
                    )}
                </div>
            )}
        </Drawer>
    )

    return (
        <div className={cn(styles.drawerFilterWidget)}>
            <DrawerControlButton openDrawer={handleChangeVisible} handleReset={handleReset} filterLength={state.filterLength} />
            {state.openFilterFields && (
                <OpenFilterList
                    filterLength={state.filterLength}
                    filterFields={state.openFilterFields}
                    meta={meta}
                    onReset={handleReset}
                />
            )}
            {selectContainer ? <Portal getContainer={selectContainer}>{SmDrawer}</Portal> : SmDrawer}
        </div>
    )
}

export default React.memo(DrawerFilterWidget)

import React from 'react'
import {connect} from 'react-redux'
import {DataItem, PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {BcFilter, FilterType} from '@tesler-ui/core/interfaces/filters'
import {Select, Skeleton, Form} from 'antd'
import {SelectProps} from '@tesler-ui/core/components/ui/Select/Select'
import cn from 'classnames'
import {LabeledValue} from 'antd/lib/select'
import {$do} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import Portal from '../../ui/Portal/Portal'
import {SmWidgetMeta} from '../../../interfaces/widget'
import checkbox from '../../fields/MultipleSelectField/img/checkbox.svg'
import styles from './MultipleSelectWidget.less'
import {AppState} from '../../../interfaces/reducers'
import StandaloneMultipleSelect from './components/StandaloneMultipleSelect'
import removeDataItemDuplicates from '../../../utils/removeDataItemDuplicates'

interface MultipleSelectWidgetOwnProps {
    meta: SmWidgetMeta
    optionClassName?: string
}

interface MultipleSelectWidgetProps extends MultipleSelectWidgetOwnProps {
    associationInProgress: boolean
    pendingChanges: Record<string, PendingDataItem>
    bcLoading: boolean
    standalone?: boolean
    // assocName?: string
    bcData: DataItem[]
    assocData: DataItem[]
    onSelect: (bcName: string, dataItem: DataItem, selected: boolean) => void
    onSelectAll: (bcName: string, cursors: string[], dataItems: PendingDataItem[]) => void
    onFilter: (bcName: string, filter: BcFilter) => void
    onSave: (bcName: string) => void
    onClearFilters: (bcName: string) => void
}

const isSelected = (dataItem: DataItem, pendingChanges: Record<string, PendingDataItem>, bcData: DataItem[], standalone: boolean) => {
    return pendingChanges?.[dataItem.id]?._associate || (standalone && bcData && bcData.findIndex(item => dataItem.id === item.id) !== -1)
}
const emptyPending = {}
const MultipleSelectWidget = (props: MultipleSelectWidgetProps) => {
    const {meta, pendingChanges, standalone, bcData, bcLoading, optionClassName, onSelect, onSave, assocData, associationInProgress} = props
    const {multipleSelect} = meta.options
    const {Option} = Select
    const {fields} = meta
    const data = standalone ? removeDataItemDuplicates([...bcData, ...assocData]) : bcData
    const primaryField = multipleSelect?.primaryField ? fields.find(field => field.key === multipleSelect.primaryField) : fields?.[0]
    const hideSearch = multipleSelect?.hideSearch
    const pendingDataChanges = React.useMemo(() => pendingChanges || emptyPending, [pendingChanges])

    const [filterValue, setFilterValue] = React.useState('')
    const optionsContainerRef = React.useRef(null)

    const selectedItems: string[] = standalone
        ? data.filter(item => isSelected(item, pendingDataChanges, bcData, standalone)).map(item => item[primaryField.key] as string)
        : Object.values(pendingDataChanges)
              .filter(({_associate}) => _associate)
              .map(item => item[primaryField.key] as string) || []

    const handleSelect = React.useCallback(
        (value: string | number | LabeledValue) => {
            const selectedItem = data.find(item => item[primaryField.key] === value)
            const selected = !isSelected(selectedItem, pendingDataChanges, bcData, standalone)

            const dataItem = {
                ...selectedItem,
                _value: selectedItem[primaryField.key]
            }

            onSelect(meta.bcName, dataItem, selected)

            if (standalone) {
                onSave(meta.bcName)
            }
        },
        [data, pendingDataChanges, bcData, standalone, primaryField.key, onSelect, onSave, meta.bcName]
    )
    const handleSelectAll = () => {
        const selected = data.length === selectedItems?.length

        props.onSelectAll(
            meta.bcName,
            data.map(({id}) => id),
            data.map(item => ({
                ...item,
                _value: item[primaryField.key],
                _associate: !selected
            }))
        )

        if (standalone) {
            props.onSave(meta.bcName)
        }
    }

    const handleSearch = (value: string) => {
        setFilterValue(value)

        const filter: BcFilter = {
            type: FilterType.contains,
            fieldName: primaryField.key,
            value
        }

        props.onFilter(meta.bcName, filter)
    }

    const handleBlur = () => {
        if (filterValue?.length) {
            setFilterValue('')
            props.onClearFilters(meta.bcName)
        }
    }

    const values =
        primaryField &&
        data?.map(item => {
            return (
                <Option className={optionClassName} key={item[primaryField.key] as string} label={item[primaryField.key]}>
                    {isSelected(item, pendingDataChanges, bcData, standalone) ? (
                        <img className={styles.checkbox} alt="checkbox" src={checkbox} />
                    ) : (
                        <span className={styles.emptyCheckbox} />
                    )}
                    <div className={styles.option}>
                        <span className={styles.title}>
                            item[primaryField.key]
                        </span>
                        {fields.length > 1 &&
                            fields.slice(1, fields.length).map(field => (
                                <div className={styles.hint} key={field.key}>
                                    {item[field.key]}
                                </div>
                            ))}
                    </div>
                </Option>
            )
        })

    const dropdownRender = (node: any) => (
        <Portal getContainer={() => optionsContainerRef.current}>
            {data?.length > 0 && (
                <div
                    role="button"
                    tabIndex={0}
                    onKeyUp={handleSelectAll}
                    className={cn(styles.selectAll, optionClassName)}
                    onClick={handleSelectAll}
                >
                    {selectedItems?.length === data?.length ? (
                        <img className={styles.checkbox} alt="checkbox" src={checkbox} />
                    ) : (
                        <span className={styles.emptyCheckbox} />
                    )}
                    <div className={styles.option}>
                        <span className={styles.title}>Select All</span>
                    </div>
                </div>
            )}
            {node}
        </Portal>
    )

    const selectProps: SelectProps = {
        dropdownClassName: styles.dropDownMenu,
        className: cn(styles.container, {[styles.hideSearch]: hideSearch}),
        value: selectedItems,
        optionLabelProp: 'label',
        mode: 'multiple',
        open: true,
        onSelect: handleSelect,
        onDeselect: handleSelect,
        onSearch: handleSearch,
        onBlur: handleBlur,
        filterOption: false,
        dropdownRender
    }

    const checkIfSelected = React.useCallback(
        (item: DataItem) => {
            return isSelected(item, pendingDataChanges, bcData, standalone) as boolean
        },
        [pendingDataChanges, bcData, standalone]
    )

    return standalone ? (
        <StandaloneMultipleSelect
            allSelected={selectedItems?.length > 0 && selectedItems?.length === data?.length}
            indeterminate={selectedItems?.length > 0 && selectedItems?.length < data?.length}
            disabled={associationInProgress}
            data={data}
            checkIfSelected={checkIfSelected}
            onSelectAll={handleSelectAll}
            onSelect={handleSelect}
            valueKey={primaryField.key}
        />
    ) : (
        <div>
            <Form.Item
                className={cn(styles.selectWrapper, {[styles.hideSearch]: hideSearch})}
                label={!hideSearch ? meta.options?.multipleSelect?.selectLabel : null}
            >
                <Select {...selectProps}>{values}</Select>
            </Form.Item>
            {bcLoading ? <Skeleton loading /> : <div ref={optionsContainerRef} className={styles.dropDownMenu} />}
        </div>
    )
}
const emptyDataItems: DataItem[] = []

const mapStateToProps = (state: AppState, ownProps: MultipleSelectWidgetOwnProps) => {
    const widgetName = ownProps.meta.name
    const options = ownProps.meta?.options?.multipleSelect
    const standalone = options?.standalone
    const widget = state.view.widgets.find(item => item.name === widgetName)
    const bcName = widget?.bcName

    const bcData = state.data[bcName] || emptyDataItems
    const assocData = state.data[options?.assocName] || emptyDataItems

    const bc = state.screen.bo.bc[bcName]

    const pendingChanges = state.view.pendingDataChanges[ownProps.meta.bcName]

    return {
        associationInProgress: state.view.associationInProgress,
        pendingChanges,
        standalone,
        bcData,
        assocData,
        bcLoading: bc?.loading,
        assocValueKey: state.view.popupData.assocValueKey
        // assocName: options?.assocName
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onSelect: (bcName: string, dataItem: DataItem, selected: boolean) => {
            dispatch(
                $do.changeDataItem({
                    bcName,
                    cursor: dataItem.id,
                    dataItem: {
                        ...dataItem,
                        _associate: selected
                    }
                })
            )
        },
        onSave: (bcName: string) => {
            dispatch($do.showViewPopup({bcName, calleeBCName: bcName, active: true}))
            dispatch($do.saveAssociations({bcNames: [bcName]}))
        },
        onSelectAll: (bcName: string, cursors: string[], dataItems: PendingDataItem[]) => {
            dispatch($do.changeDataItems({bcName, cursors, dataItems}))
        },
        onFilter: (bcName: string, filter: BcFilter) => {
            dispatch($do.bcAddFilter({bcName, filter}))
            dispatch($do.bcForceUpdate({bcName}))
        },
        onClearFilters: (bcName: string) => {
            dispatch($do.bcRemoveAllFilters({bcName}))
            dispatch($do.bcForceUpdate({bcName}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultipleSelectWidget)

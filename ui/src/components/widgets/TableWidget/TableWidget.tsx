import React, {ChangeEvent} from 'react'
import {connect, Field, TableWidget as CoreTableWidget, useTranslation} from '@tesler-ui/core'
import {TableWidgetOwnProps} from '@tesler-ui/core/components/widgets/TableWidget/TableWidget'
import {DataItem, PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {ColumnProps} from 'antd/es/table'
import cn from 'classnames'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {arrayMove, SortableContainer, SortableElement, SortableHandle, SortEnd} from 'react-sortable-hoc'
import {Dispatch} from 'redux'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import InfoColumn from '../../ui/CustomColumns/InfoColumn'
import DotsColumn from '../../ui/CustomColumns/DotsColumn'
import {AppState} from '../../../interfaces/reducers'
import {SmField, SmFieldTypes, SmListTableWidgetMeta, SmPaginationTypes, SmWidgetMeta} from '../../../interfaces/widget'
import styles from './TableWidget.less'
import SimpleText from '../../ui/SimpleText/SimpleText'
import SmColumnTitle from '../../ui/SmColumnTitle/SmColumnTitle'
import Pagination from '../Pagination/Pagination'
import DragIcon from '../../ui/DragIcon/DragIcon'
import {$smDo} from '../../../actions/actions'
import OrderCell from '../../ui/OrderCell/OrderCell'
import {EMPTY_ARRAY} from '../../../constants'
import {OpenButton} from '../../ui/CustomColumns/components/OpenButton/OpenButton'

export interface SmTableWidgetOwnProps extends TableWidgetOwnProps {
    meta: SmListTableWidgetMeta
}
export interface SmTableWidgetProps extends SmTableWidgetOwnProps {
    screenName: string
    data: DataItem[]
    isChangingOrder: boolean
    onChangeOrder: (bcName: string, cursors: string[], dataItems: PendingDataItem[]) => void
    onSave: (bcName: string, widgetName: string) => void
}

const SortableTableBody = SortableContainer((props: never) => <tbody {...props} />)
const SortableRow = SortableElement((props: never) => <tr {...props} />)
const DragHandler = SortableHandle(() => <DragIcon />)

export function TableWidget(props: SmTableWidgetProps) {
    const {meta, data, disablePagination, isChangingOrder, onChangeOrder, onSave, screenName} = props
    const {t} = useTranslation()
    const hasTranslationKey = (meta as SmWidgetMeta).options?.translations?.languagePresentKey
    const expandedRowsKeys = (meta as SmWidgetMeta).options?.extendedRowHintKeys
    const expandedRowsItems = React.useMemo(() => {
        const result: string[] = []
        data?.forEach(item => {
            const intersectionHintKeys = expandedRowsKeys ? Object.keys(item).filter(i => expandedRowsKeys.includes(i)) : EMPTY_ARRAY
            if ((hasTranslationKey && item[hasTranslationKey] === false) || intersectionHintKeys.length > 0) {
                result.push(item.id)
            }
        })
        return result
    }, [data, hasTranslationKey, expandedRowsKeys])
    const printHintMessage = React.useCallback(
        (record: DataItem) => {
            return (
                <div className={styles.expandedRow}>
                    {record[hasTranslationKey] === false && (
                        <SimpleText
                            key="noTranslation"
                            text={t('No translation, master language English')}
                            className={cn(styles.expandedText, styles.red)}
                        />
                    )}
                    {expandedRowsKeys?.map(k => {
                        const fieldMeta = meta.fields.find(i => i.key === k)
                        const text = record[k]
                        if (fieldMeta) {
                            if (fieldMeta.drillDown) {
                                return (
                                    <Field
                                        data={record}
                                        bcName={meta.bcName}
                                        cursor={record.id}
                                        widgetName={meta.name}
                                        widgetFieldMeta={fieldMeta}
                                        readonly
                                    />
                                )
                            }
                            return <SimpleText key={k} text={text as string} className={cn(styles.expandedText, styles.green)} />
                        }
                        return null
                    })}
                </div>
            )
        },
        [hasTranslationKey, expandedRowsKeys, meta.bcName, meta.name, meta.fields, t]
    )

    const onSortEnd = React.useCallback(
        ({newIndex, oldIndex}: Partial<SortEnd>) => {
            if (newIndex !== oldIndex) {
                const changedData = arrayMove(data, oldIndex, newIndex)
                onChangeOrder(
                    meta.bcName,
                    changedData.map(item => item.id),
                    changedData.map((item, index) => ({
                        ...item,
                        displayOrder: index
                    }))
                )
                onSave(meta.bcName, meta.name)
            }
        },
        [onSave, meta.bcName, meta.name, onChangeOrder, data]
    )
    const onManualChangeOrder = React.useCallback(
        ({target}: ChangeEvent<HTMLInputElement>, oldIndex: number) => {
            const newIndex = Number(target.value)
            if (newIndex > 0 && newIndex - 1 !== oldIndex) {
                onSortEnd({oldIndex, newIndex: newIndex - 1})
            }
        },
        [onSortEnd]
    )
    const infoColumn: ColumnProps<DataItem> = React.useMemo(() => {
        return (
            meta.options?.infoColumn && {
                title: '',
                key: '_infoColumn',
                width: '30px',
                render: function renderInfoColumn(text, dataItem) {
                    return <InfoColumn meta={meta} selectedKey={dataItem.id} />
                }
            }
        )
    }, [meta])
    const dotsColumn: ColumnProps<DataItem> = React.useMemo(() => {
        return (
            !meta.options?.hideDotsColumn && {
                title: '',
                key: '_dotsColumn',
                width: '42px',
                render: function renderDotsColumn(text, dataItem) {
                    return <DotsColumn meta={meta} selectedKey={dataItem.id} />
                }
            }
        )
    }, [meta])
    const dragColumn: ColumnProps<DataItem> = React.useMemo(
        () =>
            meta.options?.changeOrder &&
            isChangingOrder && {
                title: '',
                key: '_dragColumn',
                className: cn(styles.dragColumn, {[styles.dragDisabled]: !isChangingOrder}),
                render: function renderDragItem() {
                    return <DragHandler />
                }
            },
        [isChangingOrder, meta.options]
    )
    const orderColumn = React.useCallback((): ColumnProps<DataItem> => {
        const key = meta.options?.changeOrder.params?.orderColumnKey

        return {
            title: meta.fields.find(field => field.key === key)?.title,
            key: `_${key}Column`,
            className: '',
            render: function renderOrderCell(text, record, index) {
                return (
                    <OrderCell
                        text={text}
                        record={record}
                        index={index}
                        recordKey={key}
                        isChanging={isChangingOrder}
                        onChangedInput={onManualChangeOrder}
                    />
                )
            }
        }
    }, [meta, onManualChangeOrder, isChangingOrder])
    const openButtonColumn: ColumnProps<DataItem> = React.useMemo(() => {
        return (
            meta.options?.showOpenButton && {
                title: '',
                key: '_openButtonColumn',
                width: '42px',
                render: function renderColumn(text, dataItem) {
                    return <OpenButton meta={meta} selectedKey={dataItem.id} />
                }
            }
        )
    }, [meta])
    const controlColumns = React.useMemo(() => {
        const resultColumns: Array<{column: ColumnProps<DataItem>; position: 'left' | 'right'}> = []

        if (dotsColumn) {
            resultColumns.push({column: dotsColumn, position: 'right'})
        }
        if (dragColumn) {
            resultColumns.push({column: dragColumn, position: 'left'})
            resultColumns.push({column: orderColumn(), position: 'left'})
        }
        if (infoColumn) {
            resultColumns.push({column: infoColumn, position: 'left'})
        }
        if (openButtonColumn) {
            resultColumns.push({column: openButtonColumn, position: 'right'})
        }
        return [...resultColumns]
    }, [dotsColumn, dragColumn, infoColumn, openButtonColumn, orderColumn])

    const renderSmColumnTitle = React.useCallback(
        (pr: {widgetName: string; widgetMeta: SmField; rowMeta: RowMetaField}) => (
            <SmColumnTitle
                widgetName={pr.widgetName}
                fieldMeta={pr.widgetMeta}
                rowMeta={pr.rowMeta}
                sortingDisabled={meta.options?.table?.sorting === false}
            />
        ),
        [meta]
    )

    const DraggableTable = (tableProps: never) => {
        return <SortableTableBody useDragHandle onSortEnd={onSortEnd} helperClass="row-dragging" {...tableProps} />
    }

    const DraggableRow = (rowProps: never) => {
        const index = data?.findIndex(value => value.id === rowProps['data-row-key'])
        return <SortableRow index={index || 0} disabled={!isChangingOrder} {...rowProps} />
    }

    const allowEdit =
        meta.fields.some(i => i.type === ((SmFieldTypes.FramedInput as unknown) as FieldType)) ||
        ['admin', 'legacyaudit'].includes(screenName)

    return (
        <>
            <div className={cn(styles.tableContainer, cn({[styles.sortableTable]: dragColumn}))}>
                <CoreTableWidget
                    indentSize={0}
                    expandIconAsCell={false}
                    expandIconColumnIndex={-1}
                    expandedRowKeys={expandedRowsItems}
                    expandedRowRender={printHintMessage}
                    columnTitleComponent={renderSmColumnTitle}
                    disableDots
                    showRowActions
                    allowEdit={allowEdit}
                    disablePagination
                    controlColumns={controlColumns}
                    header={<></>}
                    components={{
                        body: (meta as SmListTableWidgetMeta)?.options?.changeOrder && {
                            wrapper: DraggableTable,
                            row: DraggableRow
                        }
                    }}
                    {...props}
                />
            </div>
            {!disablePagination && (
                <Pagination bcName={meta.bcName} meta={meta as SmWidgetMeta} mode={SmPaginationTypes.pageNumbers} widgetName={meta.name} />
            )}
        </>
    )
}

function mapStateToProps(store: AppState, ownProps: TableWidgetOwnProps) {
    const meta = ownProps.meta as SmListTableWidgetMeta
    const isChangingOrder = store.view.smShowCondition?.[meta.options?.changeOrder?.key]?.[meta.options?.changeOrder?.params?.fieldKey]
    return {
        screenName: store.screen.screenName,
        data: store.data[ownProps.meta.bcName],
        isChangingOrder
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onChangeOrder: (bcName: string, cursors: string[], dataItems: PendingDataItem[]) =>
            dispatch($smDo.changeDataItems({bcName, cursors, dataItems})),
        onSave: (bcName: string, widgetName: string) =>
            dispatch(
                $smDo.sendOperation({
                    bcName,
                    widgetName,
                    operationType: 'bulk-update'
                })
            )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableWidget)

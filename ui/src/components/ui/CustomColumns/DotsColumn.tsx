import React from 'react'
import {$do, connect, buildBcUrl, useWidgetOperations, useTranslation} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {Operation, OperationGroup, OperationInclusionDescriptor} from '@tesler-ui/core/interfaces/operation'
import {Skeleton, Dropdown, Icon, Menu} from 'antd'
import {WidgetTableMeta} from '@tesler-ui/core/interfaces/widget'
import styles from './CustomColumns.less'
import {AppState} from '../../../interfaces/reducers'
import {useOrderOfOperations} from '../../../hooks/useOrderOfOperations'

export interface DotsColumnOwnProps {
    meta: WidgetTableMeta
    selectedKey?: string
}

export interface DotsColumnProps extends DotsColumnOwnProps {
    operations: Array<Operation | OperationGroup>
    metaInProgress: boolean
    cursor: string
    onOperationClick: (bcName: string, operationType: string, widgetName: string) => void
    onExpand: (bcName: string, cursor: string) => void
}

export function DotsColumn(props: DotsColumnProps) {
    const {meta, selectedKey, operations, metaInProgress, cursor, onOperationClick, onExpand} = props
    const {t} = useTranslation()
    const handleExpand = React.useCallback(() => {
        if (selectedKey !== cursor) {
            onExpand(meta.bcName, selectedKey)
        }
    }, [meta.bcName, selectedKey, cursor, onExpand])

    const currentOperations = useOrderOfOperations(
        useWidgetOperations(operations, meta),
        meta.options?.actionGroups?.include as OperationInclusionDescriptor[]
    )

    const rowActionsMenu = React.useMemo(() => {
        const menuItemList: React.ReactNode[] = []
        currentOperations.filter(removeOpenButton).forEach((item: Operation | OperationGroup) => {
            if ((item as OperationGroup).actions) {
                const group = item as OperationGroup
                const groupOperations: React.ReactNode[] = []
                group.actions.forEach(operation => {
                    if (operation.scope === 'record') {
                        groupOperations.push(
                            <Menu.Item
                                key={operation.type}
                                onClick={() => {
                                    onOperationClick(meta.bcName, operation.type, meta.name)
                                }}
                            >
                                {operation.icon && <Icon type={operation.icon} className={styles.icon} />}
                                {operation.text}
                            </Menu.Item>
                        )
                    }
                })
                if (groupOperations.length)
                    menuItemList.push(
                        <Menu.ItemGroup key={item.type || item.text} title={item.text}>
                            {groupOperations.map(v => v)}
                        </Menu.ItemGroup>
                    )
            } else {
                const ungroupedOperation = item as Operation
                if (ungroupedOperation.scope === 'record') {
                    menuItemList.push(
                        <Menu.Item
                            key={item.type}
                            onClick={() => {
                                onOperationClick(meta.bcName, ungroupedOperation.type, meta.name)
                            }}
                        >
                            {ungroupedOperation.icon && <Icon type={ungroupedOperation.icon} className={styles.icon} />}
                            {item.text}
                        </Menu.Item>
                    )
                }
            }
        })
        return (
            <Menu>
                {metaInProgress && (
                    <Menu.Item disabled>
                        <div className={styles.floatMenuSkeletonWrapper}>
                            <Skeleton active />
                        </div>
                    </Menu.Item>
                )}
                {!metaInProgress &&
                    menuItemList.length &&
                    menuItemList.map(item => {
                        return item
                    })}
                {!metaInProgress && !menuItemList.length && <Menu.Item disabled>{t('Нет доступных действий')}</Menu.Item>}
            </Menu>
        )
    }, [currentOperations, metaInProgress, t, onOperationClick, meta.bcName, meta.name])

    return (
        !hideDots(currentOperations) && (
            <div className={styles.dotsMenu}>
                <Dropdown placement="bottomRight" trigger={['click']} overlayClassName={styles.dropDownContainer} overlay={rowActionsMenu}>
                    <Icon className={styles.dots} type="ellipsis" onClick={handleExpand} />
                </Dropdown>
            </div>
        )
    )
}

function mapStateToProps(store: AppState, ownProps: DotsColumnOwnProps) {
    const {bcName} = ownProps.meta
    const bcUrl = buildBcUrl(bcName, true)
    const operations = store.view.rowMeta[bcName] && store.view.rowMeta[bcName][bcUrl] && store.view.rowMeta[bcName][bcUrl].actions
    const bc = store.screen.bo.bc[bcName]
    const cursor = bc && bc.cursor
    return {
        operations,
        metaInProgress: !!store.view.metaInProgress[bcName],
        cursor
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onOperationClick: (bcName: string, operationType: string, widgetName: string) => {
            dispatch($do.sendOperation({bcName, operationType, widgetName}))
        },
        onExpand: (bcName: string, cursor: string) => {
            dispatch($do.bcSelectRecord({bcName, cursor}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DotsColumn)

function removeOpenButton(item: Operation | OperationGroup) {
    return item?.type !== 'open'
}

function hideDots(operations: Array<Operation | OperationGroup>) {
    return operations.length === 1 && operations[0].type === 'open'
}

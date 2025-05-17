import React, {useCallback} from 'react'
import {$do, connect, useTranslation, useWidgetOperations} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {Button, Checkbox, Dropdown, Icon, Menu} from 'antd'
import {
    Operation,
    OperationGroup,
    OperationInclusionDescriptor,
    OperationType,
    OperationTypeCrud
} from '@tesler-ui/core/interfaces/operation'
import {WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import CheckboxFilters from '../CheckboxFilters/CheckboxFilters'

import cn from 'classnames'
import {ThemeType} from 'antd/es/icon'
import {FilterGroup} from '@tesler-ui/core/interfaces/filters'
import {useSelector} from 'react-redux'
import styles from './Operations.less'
import {AppState} from '../../interfaces/reducers'
import {SmWidgetMeta, SmWidgetTypes} from '../../interfaces/widget'
import DrawerFilterWidget from '../widgets/DrawerFilterWidget/DrawerFilterWidget'
import {useOrderOfOperations} from '../../hooks/useOrderOfOperations'
import PredefinedFiltersSelector from './components/PredefinedFiltersSelector'
import {$smDo} from '../../actions/actions'
import checkIfCustomIcon from './utils/checkIfCustomIcon'
import CustomIcon from './components/CustomIcon'
import XlsGeneration from './components/XlsGeneration/XlsGeneration'
import {SmOperationTypeCrud} from '../../interfaces/operation'
import UploadLabel from './components/UploadLabel/UploadLabel'
import SplitRateSorting from './components/SplitRateSorting'

export interface OperationsOwnProps {
    bcName: string
    widgetMeta: SmWidgetMeta
    operations: Array<Operation | OperationGroup>
    hiddenGroups?: string[]
    formStyle?: boolean
    screenName?: string
    filterGroups?: FilterGroup[]
    containerClassName?: string
}

export interface OperationsProps extends OperationsOwnProps {
    metaInProgress: boolean
    changeOrder: boolean
    showChanges: boolean
    onClick: (bcName: string, operationType: string, widgetName: string, bcKey?: string) => void
    changeShowCondition: (key: string, fieldKey: string, value: boolean) => void
}

function getIconTheme(iconType: string): ThemeType | null {
    switch (iconType) {
        case 'plus-circle':
            return 'filled'
        default:
            return null
    }
}

export const Operations: React.FunctionComponent<OperationsProps> = props => {
    const {
        bcName,
        widgetMeta,
        operations,
        hiddenGroups,
        formStyle,
        filterGroups,
        metaInProgress,
        changeOrder,
        showChanges,
        onClick,
        changeShowCondition,
        containerClassName
    } = props
    const currentOperations = useOrderOfOperations(
        useWidgetOperations(operations, widgetMeta),
        widgetMeta.options?.actionGroups?.include as OperationInclusionDescriptor[]
    )

    const {t} = useTranslation()

    const handleChangeOrder = useCallback(() => {
        const changeOrderObj = widgetMeta.options?.changeOrder
        changeShowCondition(changeOrderObj.key, changeOrderObj.params.fieldKey, !changeOrder)
    }, [changeShowCondition, widgetMeta.options?.changeOrder, changeOrder])

    const handleShowChanges = useCallback(() => {
        const showChangesCondition = widgetMeta.options?.showCondition
        changeShowCondition(showChangesCondition.key, showChangesCondition.params.fieldKey, !showChanges)
    }, [changeShowCondition, widgetMeta.options?.showCondition, showChanges])

    const removeRecordOperation =
        widgetMeta.type === WidgetTypes.List ||
        widgetMeta.type === WidgetTypes.DataGrid ||
        widgetMeta.type === SmWidgetTypes.ShowChangesToggleWidget

    const additionalOperations = []
    if (widgetMeta.options?.drawerFilter) {
        additionalOperations.push(<DrawerFilterWidget key="DrawerFilterWidget" meta={widgetMeta as SmWidgetMeta} />)
    }
    if (widgetMeta.options?.xlsGeneration) {
        additionalOperations.push(<XlsGeneration key="XlsGeneration" meta={widgetMeta as SmWidgetMeta} />)
    }
    if (widgetMeta.options?.splitRate?.sorting?.enabled) {
        additionalOperations.push(<SplitRateSorting key="SplitRateSorting" widgetMeta={widgetMeta} />)
    }
    const widgets = useSelector((state: AppState) => state.view.widgets)
    const createClickHandler = React.useCallback(
        (type: OperationType) => () => {
            if (type === OperationTypeCrud.associate) {
                const assocWidget = widgets?.find(i => i.bcName === `${bcName}Assoc` && i.type === WidgetTypes.AssocListPopup)
                onClick(bcName, type, assocWidget?.name, assocWidget?.bcName)
            } else {
                onClick(bcName, type, widgetMeta.name)
            }
        },
        [onClick, bcName, widgetMeta, widgets]
    )
    return (
        <div>
            <div className={cn(containerClassName || styles.container)}>
                {!metaInProgress && additionalOperations}
                {metaInProgress ? (
                    <Button loading className={styles.operation} />
                ) : (
                    currentOperations.map((item: Operation | OperationGroup, index) => {
                        if ((item as OperationGroup).actions) {
                            const group = item as OperationGroup
                            if (group.type && hiddenGroups && hiddenGroups.includes(group.type)) {
                                return null
                            }

                            let groupIsEmpty = true
                            const moreOperations = (
                                <Menu>
                                    {group.actions.map(operation => {
                                        if (removeRecordOperation && operation.scope === 'record') {
                                            return null
                                        }

                                        groupIsEmpty = false
                                        if (operation.type === SmOperationTypeCrud.uploadOneXlsx) {
                                            return (
                                                <Menu.Item key={operation.type} className={styles.subOperation}>
                                                    <UploadLabel
                                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                        bcName={bcName}
                                                        operation={operation}
                                                        multiple={false}
                                                    />
                                                </Menu.Item>
                                            )
                                        }
                                        return (
                                            <Menu.Item
                                                key={operation.type}
                                                className={styles.subOperation}
                                                onClick={createClickHandler(operation.type)}
                                            >
                                                {operation.icon && <Icon type={operation.icon} className={styles.icon} />}
                                                {t(operation.text)}
                                            </Menu.Item>
                                        )
                                    })}
                                </Menu>
                            )

                            if (groupIsEmpty) {
                                return null
                            }

                            const trigger = (
                                <Button
                                    className={cn(styles.operation, {
                                        [styles.formOperation]: formStyle
                                    })}
                                    key={item.text}
                                >
                                    {group.icon && checkIfCustomIcon(group.icon) && <CustomIcon type={group.icon} className={styles.mr8} />}
                                    {group.icon && !checkIfCustomIcon(group.icon) && <Icon type={group.icon} className={styles.icon} />}
                                    {!group.showOnlyIcon && t(item.text)}
                                </Button>
                            )

                            return group.actions.length ? (
                                <Dropdown
                                    trigger={['click']}
                                    overlay={moreOperations}
                                    key={item.text}
                                    getPopupContainer={element => element.parentElement}
                                >
                                    {trigger}
                                </Dropdown>
                            ) : (
                                trigger
                            )
                        }

                        const ungroupedOperation = item as Operation
                        const themeNotSpecified = !widgetMeta.options?.actionTheme?.[ungroupedOperation.type]
                        const ungroupedOperationClassName = cn(
                            styles.operation,
                            {
                                [styles.formOperationBack]:
                                    widgetMeta.options?.actionTheme?.[ungroupedOperation.type] === 'white' ||
                                    (formStyle && themeNotSpecified && index === 0 && currentOperations.length >= 3)
                            },
                            {
                                [styles.formOperationNext]:
                                    widgetMeta.options?.actionTheme?.[ungroupedOperation.type] === 'blue' ||
                                    (formStyle &&
                                        themeNotSpecified &&
                                        ((index === 1 && currentOperations.length >= 3) ||
                                            (index === 0 && currentOperations.length === 2)))
                            },
                            {
                                [styles.formOperation]:
                                    widgetMeta.options?.actionTheme?.[ungroupedOperation.type] === 'link' ||
                                    (themeNotSpecified && formStyle && index !== 0)
                            },
                            {
                                [styles.buttonBackToList]:
                                    ungroupedOperation.type === 'back_to_list'
                            }
                        )
                        if (item.type === SmOperationTypeCrud.uploadOneXlsx) {
                            return (
                                <Button key={item.text + item.type} className={ungroupedOperationClassName}>
                                    <UploadLabel
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        bcName={bcName}
                                        operation={ungroupedOperation}
                                        multiple={false}
                                    />
                                </Button>
                            )
                        }
                        return removeRecordOperation && ungroupedOperation.scope === 'record' ? null : (
                            <Button
                                key={item.text + item.type}
                                className={ungroupedOperationClassName}
                                onClick={createClickHandler(ungroupedOperation.type)}
                            >
                                {ungroupedOperation.icon && checkIfCustomIcon(ungroupedOperation.icon) && (
                                    <CustomIcon type={ungroupedOperation.icon} className={styles.mr8} />
                                )}
                                {ungroupedOperation.icon && !checkIfCustomIcon(ungroupedOperation.icon) && (
                                    <Icon
                                        theme={getIconTheme(ungroupedOperation.icon)}
                                        type={ungroupedOperation.icon}
                                        className={styles.icon}
                                    />
                                )}
                                <span>{t(item.text)}</span>
                            </Button>
                        )
                    })
                )}
                {!!filterGroups?.length && <PredefinedFiltersSelector filterGroups={filterGroups} bcName={bcName} />}
                {widgetMeta?.options?.checkboxFiltersList && <CheckboxFilters widgetMeta={widgetMeta} />}
            </div>
            {!metaInProgress && (
                <div className={styles.checkBoxContainer}>
                    {widgetMeta.options?.showCondition && !widgetMeta.options?.showCondition?.toggleLabelHidden && (
                        <Checkbox checked={showChanges} onChange={handleShowChanges}>
                            <span className={styles.checkboxLabel}>
                                {widgetMeta.options?.showCondition?.toggleLabel ?? t('Show changes')}
                            </span>
                        </Checkbox>
                    )}
                    {widgetMeta.options?.changeOrder && (
                        <Checkbox checked={changeOrder} onChange={handleChangeOrder}>
                            <span className={styles.checkboxLabel}>{t('Change order')}</span>
                        </Checkbox>
                    )}
                </div>
            )}
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: OperationsOwnProps) {
    const showChanges = !!store.view.smShowCondition?.[ownProps.widgetMeta.options?.showCondition?.key]?.[
        ownProps.widgetMeta.options?.showCondition?.params.fieldKey
    ]
    const changeOrder = !!store.view.smShowCondition?.[ownProps.widgetMeta.options?.changeOrder?.key]?.[
        ownProps.widgetMeta.options?.changeOrder?.params.fieldKey
    ]

    return {
        metaInProgress: !!store.view.metaInProgress[ownProps.bcName],
        screenName: store.screen.screenName,
        showChanges,
        changeOrder
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onClick: (bcName: string, operationType: string, widgetName: string, bcKey?: string) => {
            dispatch($do.sendOperation({bcName, operationType, widgetName, bcKey}))
        },
        changeShowCondition: (key: string, fieldKey: string, value: boolean) => {
            dispatch($smDo.changeSmShowCondition({key, fieldKey, value}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Operations)

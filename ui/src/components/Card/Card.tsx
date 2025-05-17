import React from 'react'
import {buildBcUrl, connect, useTranslation} from '@tesler-ui/core'
import {WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import {Operation, OperationGroup} from '@tesler-ui/core/interfaces/operation'
import cn from 'classnames'
import {Dispatch} from 'redux'
import {DataItem, DataValue} from '@tesler-ui/core/interfaces/data'
import {FilterGroup} from '@tesler-ui/core/interfaces/filters'
import {AppState} from '../../interfaces/reducers'
import Operations from '../Operations/Operations'
import styles from './Card.less'
import {NO_TITLE_WIDGETS, SmWidgetMeta, SmWidgetTypes} from '../../interfaces/widget'
import TitleCard from './components/TitleCard/TitleCard'
import {$smDo} from '../../actions/actions'

export interface CardOwnProps {
    children: React.ReactNode
    meta: SmWidgetMeta
}

export interface CardStateProps {
    data: DataItem
    initSmShowCondition: (key: string, fieldKey: string, value: DataValue) => void
    needInitSmShowCondition: boolean
    smShowWidget: boolean
    operations: Array<Operation | OperationGroup>
    viewName: string
    filterGroups: FilterGroup[]
}

const showOperations = [
    WidgetTypes.List,
    WidgetTypes.DataGrid,
    WidgetTypes.Form,
    SmWidgetTypes.ShowChangesToggleWidget
]

export function Card(props: CardOwnProps & CardStateProps) {
    const {children, meta, initSmShowCondition, needInitSmShowCondition, smShowWidget, operations, viewName, filterGroups, data} = props
    const {t} = useTranslation()
    React.useEffect(() => {
        if (needInitSmShowCondition) {
            initSmShowCondition(
                meta.options.showCondition.key,
                meta.options.showCondition.params.fieldKey,
                meta.options.showCondition.params.defaultValue
            )
        }
    }, [needInitSmShowCondition, initSmShowCondition, meta])

    const [isCollapsed, setCollapse] = React.useState(false)
    React.useEffect(() => {
        setCollapse(false)
    }, [viewName, meta.name])

    const handleCollapseClick = React.useCallback(() => {
        setCollapse(prevCollapseState => !prevCollapseState)
    }, [])
    if (!smShowWidget && !needInitSmShowCondition) {
        return null
    }

    const titleShown = !NO_TITLE_WIDGETS.includes(meta.type as SmWidgetTypes)

    const dataHint = data?.[meta.options?.cardOptions?.hintPopUp?.hintDataKey]
    const hints = dataHint ? [dataHint as string] : meta.options?.cardOptions?.hintPopUp?.hintText

    const title = (data?.[meta.options?.cardOptions?.titleKey] as string) || meta.title
    const translatedTitle = t(title)

    return (
        <div
            className={cn(styles.container, {
                [styles.listContainer]: meta.type === WidgetTypes.List && !meta.title,
                [styles.markdownContainer]: meta.type === SmWidgetTypes.Markdown
            })}
        >
            {titleShown && (
                <TitleCard
                    nameWidget={meta.name}
                    title={translatedTitle}
                    typeWidget={meta.type}
                    isCollapsed={isCollapsed}
                    updateCollapse={handleCollapseClick}
                    hints={hints}
                    helpUrl={meta.options?.cardOptions?.helpUrl}
                    helpLabel={meta.options?.cardOptions?.helpLabel}
                />
            )}
            <div className={isCollapsed ? styles.collapsed : null}>
                {meta.type === WidgetTypes.Form && children}
                <div className={cn(styles.operationsContainer)}>
                    {showOperations.includes(meta.type as WidgetTypes) && (
                        <Operations
                            operations={operations}
                            bcName={meta.bcName}
                            widgetMeta={meta}
                            hiddenGroups={meta.options && meta.options.hideActionGroups}
                            formStyle={meta.type === WidgetTypes.Form}
                            filterGroups={filterGroups}
                        />
                    )}
                </div>
                {meta.type !== WidgetTypes.Form && children}
            </div>
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: CardOwnProps) {
    const {bcName} = ownProps.meta
    const bc = store.screen.bo.bc[bcName]
    const cursor = bc?.cursor
    const bcUrl = bc && buildBcUrl(bcName, true)
    const operations = store.view.rowMeta[bcName] && store.view.rowMeta[bcName][bcUrl] && store.view.rowMeta[bcName][bcUrl].actions
    const showOptions = ownProps.meta.options?.showCondition
    const smShowCondition = store.view.smShowCondition[showOptions?.key]
    const needInitSmShowCondition = showOptions && !smShowCondition
    const smShowWidget =
        ownProps.meta.options?.showCondition?.params.value ===
        store.view.smShowCondition?.[ownProps.meta.options?.showCondition?.key]?.[ownProps.meta.options?.showCondition?.params.fieldKey]
    const data = store.data[bcName]?.find(i => i.id === cursor)
    return {
        data,
        operations,
        needInitSmShowCondition,
        smShowWidget,
        viewName: store.view.name,
        filterGroups: bc?.filterGroups
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return {
        initSmShowCondition: (key: string, fieldKey: string, value: DataValue) =>
            dispatch($smDo.changeSmShowCondition({key, fieldKey, value}))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)

import React from 'react'
import {Popover, Skeleton} from 'antd'
import {CustomWidget, WidgetMeta} from '@tesler-ui/core/interfaces/widget'
import {Dispatch} from 'redux'
import {$do, connect} from '@tesler-ui/core'
import styles from './CustomColumns.less'
import {AppState} from '../../../interfaces/reducers'
import {SmListTableWidgetMeta, SmWidgetTypes, WidgetInfoHoverMeta} from '../../../interfaces/widget'
import HoverInfoListWidget from '../../widgets/HoverInfoListWidget/HoverInfoListWidget'
import HoverInfoFormWidget from '../../widgets/HoverInfoFormWidget/HoverInfoFormWidget'

export interface InfoColumnOwnProps {
    meta: SmListTableWidgetMeta
    selectedKey?: string
}

export interface InfoColumnProps extends InfoColumnOwnProps {
    widgets: WidgetMeta[]
    cursor: string
    metaInProgress: boolean
    onExpand: (bcName: string, cursor: string) => void
}

const HoverInfoComponents: Record<string, CustomWidget> = {
    [SmWidgetTypes.HoverInfoList]: HoverInfoListWidget,
    [SmWidgetTypes.HoverInfoForm]: HoverInfoFormWidget
}

export function InfoColumn(props: InfoColumnProps) {
    const {meta, selectedKey, widgets, cursor, metaInProgress, onExpand} = props
    const {options} = meta
    const widgetsHoverInfo = options.infoColumn && widgets?.filter(widget => options.infoColumn.widgets.includes(widget.name))

    const handleExpand = React.useCallback(() => {
        if (selectedKey !== cursor) {
            onExpand(meta.bcName, selectedKey)
        }
    }, [meta.bcName, selectedKey, cursor, onExpand])

    if (!widgetsHoverInfo || !widgetsHoverInfo.length || !options.infoColumn) {
        return null
    }

    const popoverContent = !metaInProgress && (
        <div className={styles.infoColumn}>
            {options.infoColumn.headerText && <h2 className={styles.title}>{options.infoColumn.headerText}</h2>}
            {widgetsHoverInfo.map(widgetMeta => {
                const HoverInfoComponent = HoverInfoComponents[widgetMeta.type]

                return (
                    <HoverInfoComponent
                        meta={widgetMeta as WidgetInfoHoverMeta}
                        parentBcName={meta.bcName}
                        cursor={cursor}
                        key={widgetMeta.name}
                    />
                )
            })}
        </div>
    )

    return (
        <Popover
            placement="bottomLeft"
            trigger="hover"
            onVisibleChange={handleExpand}
            overlayClassName={styles.popoverContainer}
            content={
                !popoverContent ? (
                    <div className={styles.floatMenuSkeletonWrapper}>
                        <Skeleton active />
                    </div>
                ) : (
                    popoverContent
                )
            }
        >
            <div className={styles.info} />
        </Popover>
    )
}

function mapStateToProps(store: AppState, ownProps: InfoColumnOwnProps) {
    const {bcName} = ownProps.meta
    const bc = store.screen.bo.bc[bcName]
    const cursor = bc && bc.cursor
    return {
        widgets: store.view.widgets,
        metaInProgress: !!store.view.metaInProgress[bcName],
        cursor
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onExpand: (bcName: string, cursor: string) => {
            dispatch($do.bcSelectRecord({bcName, cursor}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoColumn)

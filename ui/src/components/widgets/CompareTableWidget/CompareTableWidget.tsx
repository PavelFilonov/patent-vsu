import React from 'react'
import {WidgetMeta, WidgetTableMeta} from '@tesler-ui/core/interfaces/widget'
import {connect} from 'react-redux'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import {$do, ActionLink, buildBcUrl, TableWidget as CoreTableWidget} from '@tesler-ui/core'
import cn from 'classnames'
import {Dispatch} from 'redux'
import {DrillDownType, Route} from '@tesler-ui/core/interfaces/router'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {SmTableWidgetMeta} from '../../../interfaces/widget'
import styles from './CompareTableWidget.less'
import {AppState} from '../../../interfaces/reducers'

interface CompareTableWidgetOwnProps {
    meta: SmTableWidgetMeta
}

interface CompareTableWidgetProps extends CompareTableWidgetOwnProps {
    data: DataItem[]
    widgets: WidgetMeta[]
    route: Route
    titleFieldMeta: RowMetaField
    onDrillDown: (drillDownUrl: string, drillDownType: DrillDownType, route: Route) => void
}

/**
 * It's a hack for this component
 */
const missingString = 'missingString'
const missingNumber = 'missingNumber'
const missingNumberAndVersion = 'missingNumberAndVersion'

/**
 * This component fits only for Comparison Tool
 *
 * Do not reuse
 *
 * @param props
 * @constructor
 */
const CompareTableWidget = (props: CompareTableWidgetProps) => {
    const {meta, data, route, titleFieldMeta, onDrillDown} = props
    const handleDrilldown = React.useCallback(() => {
        onDrillDown(titleFieldMeta.drillDown, titleFieldMeta.drillDownType as DrillDownType, route)
    }, [onDrillDown, titleFieldMeta, route])

    if (!data?.length) {
        return null
    }

    const link = data[0]?.[missingNumber] || data[0]?.[missingNumberAndVersion] || ''
    return (
        <div
            className={cn(styles.container, {
                [styles.hideTableHeader]: meta.options.hideTableHeader
            })}
        >
            {data[0]?.[missingString] && (
                <h3 className={styles.title}>
                    {data[0]?.[missingString]} <ActionLink onClick={handleDrilldown}>{link}</ActionLink>
                </h3>
            )}
            <CoreTableWidget
                indentSize={0}
                meta={meta as WidgetTableMeta}
                expandIconAsCell={false}
                expandIconColumnIndex={-1}
                disableDots
                showRowActions
                {...props}
            />
        </div>
    )
}

const mapStateToProps = (state: AppState, ownProps: CompareTableWidgetOwnProps) => {
    const bcUrl = buildBcUrl(ownProps.meta.bcName, true)
    const rowMeta = state.view.rowMeta[ownProps.meta.bcName]?.[bcUrl]
    const titleFieldMeta =
        rowMeta?.fields.find(i => i.key === missingNumber) || rowMeta?.fields.find(i => i.key === missingNumberAndVersion)
    return {
        data: state.data[ownProps.meta.bcName],
        titleFieldMeta,
        widgets: state.view.widgets,
        route: state.router
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onDrillDown: (drillDownUrl: string, drillDownType: DrillDownType, route: Route) => {
            dispatch(
                $do.drillDown({
                    url: drillDownUrl,
                    drillDownType,
                    route
                })
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompareTableWidget)

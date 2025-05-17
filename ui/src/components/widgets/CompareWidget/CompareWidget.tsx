import React, {FunctionComponent} from 'react'
import cn from 'classnames'
import {DataItem, DataValue, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {$do, ActionLink, buildBcUrl, connect} from '@tesler-ui/core'
import {diffWords} from 'diff'
import {WidgetMeta} from '@tesler-ui/core/interfaces/widget'
import {DrillDownType, Route} from '@tesler-ui/core/interfaces/router'
import {Dispatch} from 'redux'
import copy from 'copy-to-clipboard'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import moment from 'moment'
import {AppState} from '../../../interfaces/reducers'
import styles from './CompareWidget.less'

interface CompareWidgetOwnProps {
    meta: WidgetMeta
    cursor: string
    showChanges: boolean
    field: {id: string; key: string; label: string}
    onTakeOver?: (v: DataValue) => void
    pending?: string
}

interface CompareWidgetProps extends CompareWidgetOwnProps {
    data: DataItem
    route: Route
    rowMetaFields: RowMetaField[]
    onDrillDown: (drillDownUrl: string, drillDownType: DrillDownType, route: Route) => void
}

const objects = ['Standard', 'Parent']

export const CompareWidget: FunctionComponent<CompareWidgetProps> = props => {
    const {showChanges, field, pending, data, route, rowMetaFields, onDrillDown, onTakeOver} = props

    const tableData = React.useMemo(
        () => (version: string) => {
            return objects.map(currentField => {
                if (data[`${version}${currentField}Version`] == null) {
                    return null
                }
                const compareFields = data[`${version}${currentField}Field`] as MultivalueSingleValue[]
                const activeField = compareFields?.find(item => item.id === field?.id && item.options.hint === field?.key)

                const targetField = data.latestParentField as MultivalueSingleValue[]
                const target = targetField?.find(item => item.id === field?.id && item.options.hint === field?.key)?.value as string

                const sourceField = data.initialParentField as MultivalueSingleValue[]
                const source = sourceField?.find(item => item.id === field?.id && item.options.hint === field?.key)?.value as string

                const text = version === 'latest' && currentField === 'Standard' && pending ? pending : activeField?.value
                const fieldMeta = rowMetaFields?.find(value => value.key === `${version}${currentField}Date`)
                return (
                    <td className={styles.cell} key={version + currentField}>
                        <div className={styles.title}>
                            {currentField}, version {data[`${version}${currentField}Version`]}
                            {version === 'latest' && currentField === 'Standard' ? (
                                <span className={styles.description}>Current version</span>
                            ) : (
                                <ActionLink
                                    className={styles.link}
                                    onClick={() => onDrillDown(fieldMeta.drillDown, fieldMeta.drillDownType as DrillDownType, route)}
                                >
                                    {moment(data[`${version}${currentField}Date`] as string).format('DD.MM.YYYY')}
                                </ActionLink>
                            )}
                        </div>
                        <div className={styles.textArea}>
                            {showChanges && version === 'latest' && currentField === 'Parent' && source
                                ? diffWords(source, target || '').map(item => {
                                      return (
                                          <span
                                              key={item.value}
                                              className={cn({
                                                  [styles.added]: item.added,
                                                  [styles.removed]: item.removed
                                              })}
                                          >
                                              {item.value}
                                          </span>
                                      )
                                  })
                                : text}
                            {version === 'latest' && currentField === 'Parent' && (
                                <div className={styles.copyContainer}>
                                    <ActionLink className={styles.copyLink} onClick={() => copy(target)}>
                                        Copy text
                                    </ActionLink>
                                    {onTakeOver && {}.toString.call(onTakeOver) === '[object Function]' && (
                                        <ActionLink className={styles.copyLink} onClick={() => onTakeOver(target)}>
                                            Replace
                                        </ActionLink>
                                    )}
                                </div>
                            )}
                        </div>
                    </td>
                )
            })
        },
        [data, showChanges, pending, field, rowMetaFields, onDrillDown, onTakeOver, route]
    )
    if (!data) {
        return null
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.fieldTitle}> {field?.label} </h2>
            <table>
                <tbody>
                    <tr className={styles.row}>{tableData('latest')}</tr>
                    <tr className={styles.row}>{tableData('initial')}</tr>
                </tbody>
            </table>
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: CompareWidgetOwnProps) {
    const {bcName} = ownProps.meta
    const {cursor} = ownProps
    const bcRowMeta = store.view.rowMeta[bcName]
    const bcUrl = buildBcUrl(bcName, true)
    const rowMetaFields = bcUrl && bcRowMeta?.[bcUrl]?.fields
    const data = store.data[bcName]?.find(item => item.id === cursor)
    return {
        data,
        route: store.router,
        rowMetaFields
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
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

export default connect(mapStateToProps, mapDispatchToProps)(CompareWidget)

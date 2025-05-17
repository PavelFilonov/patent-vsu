import React from 'react'
import {connect, useFlatFormFields} from '@tesler-ui/core'
import {DataItem, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {AppState} from '../../../interfaces/reducers'
import {WidgetInfoField, WidgetInfoHoverMeta} from '../../../interfaces/widget'
import styles from './HoverInfoListWidget.less'

interface HoverInfoListWidgetOwnProps {
    meta: WidgetInfoHoverMeta
}

interface HoverInfoListWidgetProps extends HoverInfoListWidgetOwnProps {
    dataItems: DataItem[]
}

const HoverInfoListWidget: React.FunctionComponent<HoverInfoListWidgetProps> = props => {
    const {dataItems, meta} = props
    const flattenWidgetFields = useFlatFormFields<WidgetInfoField>(meta.fields).filter(item => item.type !== FieldType.hidden)
    return (
        <div className={styles.container} data-widget-type={meta.type}>
            <div className={styles.label}>{flattenWidgetFields[0].label}</div>
            <ol className={styles.items}>
                {dataItems.map(item => {
                    return (
                        <li key={item.id}>
                            {flattenWidgetFields.map((field: WidgetInfoField) => {
                                const multiValueItems = item[field.key] as MultivalueSingleValue[]
                                if (field.type === FieldType.multivalue && multiValueItems && multiValueItems.length) {
                                    return (
                                        <ul className={styles.multiValueArea} key={field.key}>
                                            {multiValueItems.map(val => {
                                                return (
                                                    <li className={styles.data} key={val.id}>
                                                        {val.value}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )
                                }
                                return (
                                    <div className={styles.fieldArea} key={field.key}>
                                        <div className={styles.data}>{item[field.key]}</div>
                                    </div>
                                )
                            })}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

const emptyObject = {}

function mapStateToProps(store: AppState, ownProps: HoverInfoListWidgetOwnProps) {
    const {bcName} = ownProps.meta
    const bcData = store.data[bcName]
    return {
        dataItems: bcData || emptyObject
    }
}

export default connect(mapStateToProps)(HoverInfoListWidget)

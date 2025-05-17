import React, {FunctionComponent} from 'react'
import {DataItem, DataValue, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {connect} from 'react-redux'
import {Popover} from 'antd'
import {AppState} from '../../../interfaces/reducers'
import {InfoFieldMeta, SmField} from '../../../interfaces/widget'
import styles from './InfoField.less'
import {ListValue} from '../CompositeField/components/ListValue'

interface InfoData extends SmField {
    value: DataValue
}

export interface InfoFieldProps extends InfoData {
    bcName: string
    record: DataItem
    fields: SmField[]
    cursor: string
    data?: DataItem
    widgetName: string
    meta: InfoFieldMeta
    value: DataValue
}

export const InfoField: FunctionComponent<InfoFieldProps> = props => {
    const {record, fields} = props
    const fieldsData: InfoData[] = React.useMemo(
        () =>
            fields?.map(field => {
                return {
                    ...field,
                    value: record?.[field.key]
                }
            }),
        [fields, record]
    )
    const fieldContent: React.ReactChild[] = []
    fieldContent.push(
        <h2 className={styles.title} key="_header">
            {' '}
            Additional Info{' '}
        </h2>
    )

    fieldsData.forEach(fieldData => {
        if (Array.isArray(fieldData.value)) {
            fieldContent.push(
                <div className={styles.fieldArea} key={fieldData.key}>
                    <div className={styles.label}>{fieldData.label}</div>
                    <ListValue key={fieldData.key} value={fieldData.value as MultivalueSingleValue[]} />
                </div>
            )
        } else {
            fieldContent.push(
                <div className={styles.fieldArea} key={fieldData.key}>
                    <div className={styles.label}>{fieldData.label}</div>
                    <div className={styles.data}>{fieldData.value}</div>
                </div>
            )
        }
    })
    return (
        <>
            <Popover placement="bottomLeft" trigger="hover" overlayClassName={styles.popoverContainer} content={fieldContent}>
                <div className={styles.info} />
            </Popover>
        </>
    )
}

export function mapStateToProps(store: AppState, ownProps: InfoFieldProps) {
    const widget = store.view.widgets.find(item => item.name === ownProps.widgetName)
    const fields = ownProps.meta?.fields
    const bcName = widget?.bcName
    const record = store.data[bcName] && store.data[bcName].find(item => item.id === ownProps.cursor)
    return {
        bcName,
        fields,
        record
    }
}

export default connect(mapStateToProps)(InfoField)

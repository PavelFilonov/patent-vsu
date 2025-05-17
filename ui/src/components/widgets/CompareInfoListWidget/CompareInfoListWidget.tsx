import React from 'react'
import {connect} from 'react-redux'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import {Row, Col} from 'antd'
import {AppState} from '../../../interfaces/reducers'
import styles from './CompareInfoListWidget.less'
import CompareFields from './CompareFields/CompareFields'
import {CompareInfoListMeta, InfoPopupLinkMeta} from '../../../interfaces/widget'

interface CompareInfoListWidgetOwnProps {
    meta: CompareInfoListMeta
}

interface CompareInfoListWidgetProps extends CompareInfoListWidgetOwnProps {
    data: DataItem
    cursor: string
}

const CompareInfoListWidget = (props: CompareInfoListWidgetProps) => {
    const {
        data,
        meta: {fields}
    } = props

    const singleEntityFields = React.useMemo(
        () =>
            fields
                .filter((field: InfoPopupLinkMeta) => !field.key.includes('2'))
                .map((field: InfoPopupLinkMeta) => {
                    const {key, bgColorKey, popupBcName} = field

                    return {
                        ...field,
                        key: key?.substring(0, key?.length - 1),
                        bgColorKey: bgColorKey?.substring(0, bgColorKey?.length - 1),
                        popupBcName: popupBcName?.substring(0, popupBcName?.length - 1)
                    }
                }),
        [fields]
    )

    return (
        <div className={styles.container}>
            {singleEntityFields.map((field: InfoPopupLinkMeta) => (
                <Row className={styles.fieldRow} key={field.key}>
                    <Col span={6} className={styles.fieldLabel}>
                        {field.label}
                    </Col>
                    <CompareFields
                        showChangesBc={props.meta.options?.showChangesBc}
                        data={data}
                        bcName={props.meta.bcName}
                        widgetName={props.meta.name}
                        cursor={props.cursor}
                        field={field}
                    />
                </Row>
            ))}
        </div>
    )
}
const mapStateToProps = (store: AppState, ownProps: CompareInfoListWidgetOwnProps) => {
    const {bcName} = ownProps.meta
    const bc = store.screen.bo.bc[bcName]
    const bcCursor = bc && bc.cursor
    const bcData = store.data[bcName]

    return {
        data: bcData?.[0],
        cursor: bcCursor
    }
}

export default connect(mapStateToProps)(CompareInfoListWidget)

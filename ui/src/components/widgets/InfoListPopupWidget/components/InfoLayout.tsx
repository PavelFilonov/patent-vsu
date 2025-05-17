import React from 'react'
import {Col, Row} from 'antd'
import {Field} from '@tesler-ui/core'
import {useSelector} from 'react-redux'
import styles from '../InfoListPopupWidget.less'
import {AppState} from '../../../../interfaces/reducers'
import {InfoLayout, SmField} from '../../../../interfaces/widget'

interface InfoLayoutProps {
    bcName: string
    layout: InfoLayout
    fields: SmField[]
    widgetName: string
}
const colStyle: React.CSSProperties = {
    paddingLeft: '4px',
    paddingRight: '4px'
}
const rowStyle: React.CSSProperties = {
    marginLeft: 0,
    marginRight: 0
}
function InfoLayout({bcName, layout, fields, widgetName}: InfoLayoutProps) {
    const data = useSelector((state: AppState) => state.data[bcName])

    return (
        <>
            {data?.map(item => (
                <React.Fragment key={item.id}>
                    {layout.rows.map(row => {
                        return (
                            <Row gutter={24} key={JSON.stringify(row)} className={styles.layoutRow} style={rowStyle}>
                                {row.cols.map(col => {
                                    return (
                                        <Col key={JSON.stringify(col)} span={col.span} style={colStyle}>
                                            {/* <Col key={JSON.stringify(col)} span={col.span} offset={col.offset}> */}
                                            <Field
                                                bcName={bcName}
                                                widgetName={widgetName}
                                                cursor={item.id}
                                                widgetFieldMeta={fields.find(i => i.key === col.fieldKey)}
                                                readonly
                                            />
                                        </Col>
                                    )
                                })}
                            </Row>
                        )
                    })}
                </React.Fragment>
            ))}
        </>
    )
}

export default React.memo(InfoLayout)

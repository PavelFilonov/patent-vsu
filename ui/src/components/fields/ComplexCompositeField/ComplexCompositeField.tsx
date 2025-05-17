import React, {FunctionComponent} from 'react'
import {Row} from 'antd'
import {connect} from 'react-redux'
import {Field} from '@tesler-ui/core'
import {ComplexCompositeFieldMeta, SmField} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import styles from './ComplexCompositeField.less'

const SINGLE_LINE_TYPES: ComplexCompositeFieldMeta['compositionType'][] = ['line', 'remoteMark']

export interface ComplexCompositeFieldStoreProps {
    bcName: string
    fields: SmField[]
}

export interface ComplexCompositeFieldOwnProps {
    cursor: string
    widgetName: string
    meta: ComplexCompositeFieldMeta
    className?: string
    readOnly?: boolean
}

export type ComplexCompositeFieldProps = ComplexCompositeFieldOwnProps & ComplexCompositeFieldStoreProps & SmField

export const ComplexCompositeField: FunctionComponent<ComplexCompositeFieldProps> = props => {
    const {bcName, fields, cursor, widgetName, meta, readOnly, className, ...restProps} = props
    const visibleFields = fields?.filter(field => !field?.hidden)

    let fieldContent: React.ReactNode = visibleFields.map(field => (
        <Row key={field.key} className={className}>
            <Field bcName={bcName} cursor={cursor} widgetName={widgetName} widgetFieldMeta={field} readonly={readOnly} {...restProps} />
        </Row>
    ))

    /**
     * Single line display.
     * 'line' - universal styles for display in a line, while the icon will not continue the line when wrapping.
     * 'remoteMark' - styles for a special case when the icon should continue the line
     */
    if (SINGLE_LINE_TYPES.includes(meta.compositionType)) {
        fieldContent = (
            <div style={{width: meta.width}} className={styles[`${meta.compositionType}Container`]}>
                {visibleFields.map(field => (
                    <Field
                        key={field.key}
                        bcName={bcName}
                        cursor={cursor}
                        widgetName={widgetName}
                        widgetFieldMeta={field}
                        readonly={readOnly}
                        {...restProps}
                    />
                ))}
            </div>
        )
    }

    return <>{fieldContent}</>
}

function mapStateToProps(store: AppState, ownProps: ComplexCompositeFieldOwnProps): ComplexCompositeFieldStoreProps {
    const widget = store.view.widgets.find(item => item.name === ownProps.widgetName)
    const fields = ownProps.meta?.fields
    const bcName = widget?.bcName

    return {
        bcName,
        fields
    }
}

export default connect(mapStateToProps)(ComplexCompositeField)

import React from 'react'
import {connect} from 'react-redux'
import {DataItem, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {Field, useFlatFormFields} from '@tesler-ui/core'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import styles from './HoverInfoFormWidget.less'
import {emptyMultivalueField, WidgetInfoField, WidgetInfoHoverMeta} from '../../../interfaces/widget'
import MultiValueList from '../../ui/MultiValueList/MultiValueList'
import {AppState} from '../../../interfaces/reducers'

interface HoverInfoFormWidgetOwnProps {
    meta: WidgetInfoHoverMeta
    cursor: string
}

interface HoverInfoFormWidgetProps extends HoverInfoFormWidgetOwnProps {
    data: DataItem
}

const HoverInfoFormWidget = (props: HoverInfoFormWidgetProps) => {
    const {meta, cursor, data} = props
    const flattenWidgetFields = useFlatFormFields<WidgetInfoField>(meta.fields).filter(item => item.type !== FieldType.hidden)

    return (
        <div className={styles.container}>
            {flattenWidgetFields.map(field => {
                if (field.type === FieldType.multivalue) {
                    const resultData = (data[field.key] as MultivalueSingleValue[]) || emptyMultivalueField
                    const multivalueData = resultData.map(entry => ({
                        ...entry,
                        options: {}
                    }))
                    return (
                        <div className={styles.fieldArea} key={field.key}>
                            <MultiValueList
                                fieldTitle={field.label}
                                field={field}
                                data={multivalueData}
                                noLineSeparator
                                isColumnDirection
                            />
                        </div>
                    )
                }
                return (
                    <div className={styles.fieldArea} key={field.key}>
                        <div className={styles.label}>{field.label}</div>
                        <Field
                            bcName={meta.bcName}
                            cursor={cursor}
                            widgetName={meta.name}
                            widgetFieldMeta={field}
                            className={styles.value}
                            readonly
                        />
                    </div>
                )
            })}
        </div>
    )
}

const emptyObject = {}

const mapStateToProps = (store: AppState, ownProps: HoverInfoFormWidgetOwnProps) => {
    const {
        meta: {bcName},
        cursor
    } = ownProps
    const bcData = store.data[bcName]

    return {
        data: (bcData && bcData.find(v => v.id === cursor)) || emptyObject
    }
}

export default connect(mapStateToProps)(HoverInfoFormWidget)

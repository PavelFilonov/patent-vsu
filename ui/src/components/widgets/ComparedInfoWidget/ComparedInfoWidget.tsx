import React from 'react'
import {Checkbox, Col, Icon, Row} from 'antd'
import {DataItem, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {connect, Field, MultiValueListRecord} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import styles from './ComparedInfoWidget.less'
import {SmWidgetMeta} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import {NO_DATA_HYPHEN} from '../../../constants'

interface ComparedInfoWidgetProps {
    title: string
    data: DataItem
    meta: SmWidgetMeta
    showChanges: boolean
    setShowChanges: (bcName: string, showChanges: boolean) => void
    cursor: string
}

const ComparedInfoWidget: React.FunctionComponent<ComparedInfoWidgetProps> = (props: ComparedInfoWidgetProps) => {
    const {data, meta, showChanges, setShowChanges, cursor} = props
    const {
        title,
        name: widgetName,
        bcName,
        fields,
        options: {drillDownBc, disableShowChanges}
    } = meta

    const handleChange = () => setShowChanges(bcName, !showChanges)

    const fieldsData: DataItem = data && {
        id: data?.id,
        vstamp: data?.vstamp,
        ...fields.reduce((acc, field) => ({...acc, [field.key]: data?.[`${field.key}1`]}), {})
    }

    const showChangesCheckbox = !(disableShowChanges === true)

    return (
        <Row className={styles.container}>
            <Col span={14}>
                <div className={styles.comparedInfoCard}>
                    <h3 className={styles.header}>
                        {title}
                        <Icon type="close" className={styles.icon} />
                    </h3>
                    {fields.map(field => {
                        if (field.type === FieldType.multivalue) {
                            const fieldData = fieldsData?.[field.key] as MultivalueSingleValue[]
                            return fieldData && fieldData.length ? (
                                <div className={styles.multivalue} key={field.key}>
                                    <MultiValueListRecord isFloat={false} multivalueSingleValue={fieldData?.[0]} />
                                    {fieldData?.length > 1 && <span className={styles.more}>and {fieldData.length - 1} more</span>}
                                </div>
                            ) : (
                                NO_DATA_HYPHEN
                            )
                        }
                        return (
                            <Field
                                className={styles.field}
                                bcName={drillDownBc}
                                cursor={cursor}
                                data={fieldsData}
                                widgetName={widgetName}
                                key={field.key}
                                widgetFieldMeta={field}
                                disableDrillDown={false}
                                readonly
                            />
                        )
                    })}
                    {showChangesCheckbox && (
                        <div className={styles.checkboxContainer}>
                            <Checkbox className={styles.checkbox} checked={showChanges} onChange={handleChange}>
                                Show changes
                            </Checkbox>
                        </div>
                    )}
                </div>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state: AppState, ownProps: ComparedInfoWidgetProps) => {
    const {bcName} = ownProps.meta
    const bcData = state.data[bcName]?.[0]
    const bc = state.screen.bo.bc[bcName]
    const bcCursor = bc && bc.cursor
    return {
        showChanges: !!state.view.smShowChanges[bcName],
        data: bcData,
        cursor: bcCursor
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setShowChanges: (bcName: string, showChanges: boolean) =>
            dispatch(
                $smDo.changeSmShowChanges({
                    bcName,
                    showChanges
                })
            )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComparedInfoWidget)

import React from 'react'
import {DataItem, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {$do, ActionLink, buildBcUrl, connect, Field, useFlatFormFields, TemplatedTitle} from '@tesler-ui/core'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {Row, Col} from 'antd'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import cn from 'classnames'
import {Dispatch} from 'redux'
import {AppState} from '../../../interfaces/reducers'
import MultiValueList from '../../ui/MultiValueList/MultiValueList'
import {WidgetInfoMeta, emptyMultivalueField, WidgetInfoField} from '../../../interfaces/widget'
import styles from './InfoWidget.less'
import {NO_DATA_HYPHEN} from '../../../constants'

interface InfoWidgetOwnProps {
    meta: WidgetInfoMeta
}

interface InfoWidgetProps extends InfoWidgetOwnProps {
    cursor: string
    data: DataItem
    fields: RowMetaField[]
    onDrillDown: (widgetName: string, cursor: string, bcName: string, fieldKey: string) => void
}

const InfoWidget: React.FunctionComponent<InfoWidgetProps> = props => {
    const {data, meta} = props
    const {options} = meta
    const hiddenKeys: string[] = []
    const flattenWidgetFields = useFlatFormFields<WidgetInfoField>(meta.fields).filter(item => {
        const isHidden = item.type === FieldType.hidden
        if (isHidden) {
            hiddenKeys.push(item.key)
        }
        return !isHidden
    })

    return (
        <Row className={styles.container}>
            {options && options.layout.header && options.layout.header.length > 0 && (
                <Row className={styles.gridHeader}>
                    <Col span={options.layout.aside ? 19 : 24} className={styles.headerWrapper}>
                        {options.layout.header.map(col => (
                            <Col key={col} span={24 / options.layout.header.length}>
                                {col}
                            </Col>
                        ))}
                    </Col>
                </Row>
            )}
            {options &&
                options.layout &&
                options.layout.rows
                    .filter(row => row.cols.find(col => !hiddenKeys.includes(col.fieldKey)))
                    .map((row, index) => {
                        const totalWidth = row.cols.reduce((prev, current) => prev + current.span, 0)
                        return (
                            <Row key={JSON.stringify(row)} className={styles.rowWrapper}>
                                {options.layout.aside && options.layout.aside.length > 0 && (
                                    <Col span={5} className={styles.asideWrapper}>
                                        {options.layout.aside[index]}
                                    </Col>
                                )}
                                <Col
                                    span={options.layout.aside && options.layout.aside.length > 0 ? 19 : 24}
                                    className={cn(styles.mainCol, {
                                        [styles.extraWidth]: totalWidth > 24
                                    })}
                                >
                                    {row.cols
                                        .filter(field => {
                                            const metaField = props.fields && props.fields.find(item => item.key === field.fieldKey)
                                            return metaField ? !metaField.hidden : true
                                        })
                                        .map((col, colIndex) => {
                                            const field = flattenWidgetFields.find(item => item.key === col.fieldKey)
                                            const fieldTitle = <TemplatedTitle widgetName={meta.name} title={field.label} />
                                            if (field.type === FieldType.multivalue) {
                                                return (
                                                    <Col
                                                        key={field.key}
                                                        span={17}
                                                        className={cn(
                                                            {
                                                                [styles.colWrap]: row.cols.length > 1
                                                            },
                                                            {
                                                                [styles.leftCol]: col.span
                                                            }
                                                        )}
                                                    >
                                                        <div className={styles.fieldArea}>
                                                            <MultiValueList
                                                                fieldTitle={fieldTitle}
                                                                field={field}
                                                                data={(data[field.key] || emptyMultivalueField) as MultivalueSingleValue[]}
                                                                noLineSeparator={options && options.fieldBorderBottom === false}
                                                                isColumnDirection={row.cols.length > 1}
                                                            />
                                                        </div>
                                                    </Col>
                                                )
                                            }

                                            const separateDrillDownTitle =
                                                field.drillDown &&
                                                (field.drillDownTitle || (field.drillDownTitleKey && data[field.drillDownTitleKey]))
                                            const handleDrillDown = () => {
                                                props.onDrillDown(meta.name, data.id, meta.bcName, field.key)
                                            }

                                            return (
                                                <Col
                                                    key={field.key}
                                                    span={17}
                                                    className={cn(
                                                        {
                                                            [styles.colWrap]: row.cols.length > 1
                                                        },
                                                        {
                                                            [styles.rightCol]:
                                                                col.span &&
                                                                totalWidth > 24 &&
                                                                colIndex !== 0 &&
                                                                row.cols.length % (colIndex + 1) === 0
                                                        },
                                                        {
                                                            [styles.leftCol]:
                                                                (col.span && totalWidth > 24 && row.cols.length % (colIndex + 1) !== 0) ||
                                                                (colIndex === 0 && col.span)
                                                        }
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            styles.fieldArea,
                                                            {
                                                                [styles.noFieldSeparator]: options && options.fieldBorderBottom === false
                                                            },
                                                            {
                                                                [styles.fieldDirection]: row.cols.length > 1
                                                            }
                                                        )}
                                                    >
                                                        {field.label.length !== 0 && <div className={styles.labelArea}>{fieldTitle}</div>}
                                                        <div className={styles.fieldData}>
                                                            {field.hintKey && data[field.hintKey] && (
                                                                <div className={styles.hint}>{data[field.hintKey]}</div>
                                                            )}
                                                            {(data[field.hintKey] || data[field.key]) === null ||
                                                            (typeof data[field.key] === 'object' &&
                                                                Object.keys(data[field.key]).length === 0) ? (
                                                                NO_DATA_HYPHEN
                                                            ) : (
                                                                <Field
                                                                    bcName={props.meta.bcName}
                                                                    cursor={props.cursor}
                                                                    widgetName={props.meta.name}
                                                                    widgetFieldMeta={field}
                                                                    className={cn({
                                                                        [styles.infoWidgetValue]: !!field.bgColorKey
                                                                    })}
                                                                    disableDrillDown={!!separateDrillDownTitle}
                                                                    readonly
                                                                />
                                                            )}
                                                            {separateDrillDownTitle && (
                                                                <div>
                                                                    <ActionLink onClick={handleDrillDown}>
                                                                        {separateDrillDownTitle}
                                                                    </ActionLink>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                </Col>
                            </Row>
                        )
                    })}
        </Row>
    )
}

const emptyObject = {}

function mapStateToProps(store: AppState, ownProps: InfoWidgetOwnProps) {
    const {bcName} = ownProps.meta
    const bcUrl = buildBcUrl(bcName, true)
    const bc = store.screen.bo.bc[bcName]
    const bcCursor = bc && bc.cursor
    const bcData = store.data[bcName]
    return {
        fields: bcUrl && store.view.rowMeta[bcName] && store.view.rowMeta[bcName][bcUrl] && store.view.rowMeta[bcName][bcUrl].fields,
        data: (bcData && bcData.find(v => v.id === bcCursor)) || emptyObject,
        cursor: bcCursor
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onDrillDown: (widgetName: string, cursor: string, bcName: string, fieldKey: string) => {
            dispatch($do.userDrillDown({widgetName, cursor, bcName, fieldKey}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoWidget)

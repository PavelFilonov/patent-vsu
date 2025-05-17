import React from 'react'
import {DataItem, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {Change, diffWordsWithSpace} from 'diff'
import cn from 'classnames'
import {Col} from 'antd'
import {connect} from 'react-redux'
import {Field, MultiValueListRecord} from '@tesler-ui/core'
import {MultivalueFieldMeta, WidgetField} from '@tesler-ui/core/interfaces/widget'
import {AppState} from '../../../../interfaces/reducers'
import styles from './CompareFields.less'
import {emptyMultivalueField, InfoPopupLinkMeta, SmFieldTypes} from '../../../../interfaces/widget'
import MultiValueList from '../../../ui/MultiValueList/MultiValueList'
import {NO_DATA_HYPHEN} from '../../../../constants'

interface CompareFieldsOwnProps {
    field: InfoPopupLinkMeta
    bcName: string
    cursor: string
    widgetName: string
    showChangesBc?: string
    data: DataItem
}

interface CompareFieldsProps extends CompareFieldsOwnProps {
    showChanges: boolean
}

const CompareFields: React.FunctionComponent<CompareFieldsProps> = props => {
    const {field, showChanges, data, bcName, cursor, widgetName} = props

    const value1 = data?.[`${field.key}1`]
    const value2 = data?.[`${field.key}2`]

    const firstFieldMeta = {
        ...field,
        key: `${field.key}1`,
        bgColorKey: field.bgColorKey && `${field.bgColorKey}1`,
        popupBcName: field.popupBcName && `${field.popupBcName}1`
    }
    const secondFieldMeta = {
        ...field,
        key: `${field.key}2`,
        bgColorKey: field.bgColorKey && `${field.bgColorKey}2`,
        popupBcName: field.popupBcName && `${field.popupBcName}2`
    }

    if (field.type === FieldType.multivalue || field.type === SmFieldTypes.Composite) {
        if (showChanges) {
            const multivalue1 = value1 as MultivalueSingleValue[]
            const multivalue2 = value2 as MultivalueSingleValue[]

            return (
                <>
                    <Col span={9}>
                        {!multivalue1?.length
                            ? NO_DATA_HYPHEN
                            : multivalue1.map(singleValue => {
                                  const isAdded = !multivalue2?.find(value => value.value === singleValue.value)
                                  return (
                                      <div
                                          className={cn({
                                              [styles.added]: isAdded
                                          })}
                                          key={singleValue.id}
                                      >
                                          <MultiValueListRecord isFloat={false} multivalueSingleValue={singleValue} />
                                      </div>
                                  )
                              })}
                        {!!multivalue2?.length &&
                            multivalue2
                                .filter(newItem => !multivalue1.find(oldItem => oldItem.value === newItem.value))
                                .map(singleValue => (
                                    <div className={cn(styles.multivalueWrapper, styles.removed)} key={singleValue.id}>
                                        <MultiValueListRecord isFloat={false} multivalueSingleValue={singleValue} />
                                    </div>
                                ))}
                    </Col>
                    <Col span={9}>
                        {!multivalue2?.length
                            ? NO_DATA_HYPHEN
                            : multivalue2.map(singleValue =>
                                <MultiValueListRecord key={singleValue.id} isFloat={false} multivalueSingleValue={singleValue} />
                              )}
                    </Col>
                </>
            )
        }
        return (
            <>
                <Col span={9}>
                    <MultiValueList
                        field={field as MultivalueFieldMeta}
                        data={(value1 as MultivalueSingleValue[]) || emptyMultivalueField}
                        isColumnDirection
                        noLineSeparator={false}
                    />
                </Col>
                <Col span={9}>
                    <MultiValueList
                        field={field as MultivalueFieldMeta}
                        data={(value2 as MultivalueSingleValue[]) || emptyMultivalueField}
                        isColumnDirection
                        noLineSeparator={false}
                    />
                </Col>
            </>
        )
    }

    return (
        <>
            <Col span={9} className={styles.fieldWrapper}>
                {showChanges && value1 && value2 ? (
                    diffWordsWithSpace(value2 as string, value1 as string).map((change: Change) => (
                        <span
                            key={change.value}
                            className={cn(styles.field, {
                                [styles.added]: change.added,
                                [styles.removed]: change.removed
                            })}
                        >
                            {change.value}
                        </span>
                    ))
                ) : (
                    <Field
                        className={styles.field}
                        data={data}
                        bcName={bcName}
                        cursor={cursor}
                        widgetName={widgetName}
                        widgetFieldMeta={firstFieldMeta as WidgetField}
                        readonly
                    />
                )}
            </Col>
            <Col span={9} className={styles.fieldWrapper}>
                <Field
                    className={styles.field}
                    data={data}
                    bcName={bcName}
                    cursor={cursor}
                    widgetName={widgetName}
                    widgetFieldMeta={secondFieldMeta as WidgetField}
                    readonly
                />
            </Col>
        </>
    )
}

const mapStateToProps = (state: AppState, ownProps: CompareFieldsOwnProps) => {
    const {bcName} = ownProps
    const altBc = ownProps?.showChangesBc
    const showChanges = !!state.view.smShowChanges[altBc || bcName]

    return {
        showChanges
    }
}
CompareFields.displayName = 'CompareFields'

export default connect(mapStateToProps)(CompareFields)

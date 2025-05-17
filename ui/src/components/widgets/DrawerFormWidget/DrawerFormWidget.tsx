import React, {FunctionComponent, useState} from 'react'
import {Drawer, Checkbox, Form, Row, Col, Input} from 'antd'
import {DataItem, DataValue, PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {buildBcUrl, connect, Field, TemplatedTitle, useFlatFormFields} from '@tesler-ui/core'
import {WidgetFormField, WidgetFormMeta, WidgetMeta} from '@tesler-ui/core/interfaces/widget'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {Dispatch} from 'redux'
import {PendingValidationFails} from '@tesler-ui/core/interfaces/view'
import {SmWidgetTypes} from '../../../interfaces/widget'
import CompareWidget from '../CompareWidget/CompareWidget'
import {$smDo} from '../../../actions/actions'
import {AppState} from '../../../interfaces/reducers'
import styles from './DrawerFormWidget.less'

interface DrawerFormWidgetOwnProps {
    meta: WidgetFormMeta
}

interface DrawerFormWidgetProps extends DrawerFormWidgetOwnProps {
    pendingChanges: PendingDataItem
    compareWidget: WidgetMeta
    cursor: string
    data: DataItem
    fields: RowMetaField[]
    metaErrors: Record<string, string>
    missingFields: Record<string, string>
    menuVisible: boolean
    onChange: (bcName: string, cursor: string, dataItem: PendingDataItem) => void
}

export const DrawerFormWidget: FunctionComponent<DrawerFormWidgetProps> = props => {
    const {TextArea} = Input
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [showChanges, setShowChanges] = useState(false)
    const [activeField, setActiveField] = useState(null)

    const {
        onChange,
        data,
        compareWidget,
        menuVisible,
        missingFields,
        metaErrors,
        fields,
        pendingChanges,
        meta,
        meta: {bcName, name},
        cursor
    } = props

    const handleChangeVisible = () => setDrawerVisible(!drawerVisible)
    const handleShowChanges = () => setShowChanges(!showChanges)
    const handleField = (id: string, key: string, label: string) => {
        setActiveField({id, key, label})
    }

    const handleInputChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const dataItem = {[activeField?.key]: event.target.value}
            onChange(bcName, cursor, dataItem)
        },
        [bcName, cursor, activeField, onChange]
    )

    const handleTakeOver = React.useCallback(
        (v: DataValue) => {
            const dataItem = {[activeField?.key]: v}
            onChange(bcName, cursor, dataItem)
        },
        [bcName, cursor, activeField, onChange]
    )

    const flattenWidgetFields = useFlatFormFields<WidgetFormField>(meta.fields)

    const resultFields = React.useMemo(() => {
        return (
            <Row gutter={24}>
                {meta.options?.layout?.rows.map(row => {
                    return (
                        <Row key={JSON.stringify(row)}>
                            {row.cols.map(col => {
                                const field = flattenWidgetFields.find(item => item.key === col.fieldKey)
                                const fieldMeta = fields?.find(item => item.key === field.key)
                                const disabled = fieldMeta ? fieldMeta.disabled : true
                                const error = (!disabled && missingFields?.[field.key]) || metaErrors?.[field.key]
                                const value = pendingChanges?.[field.key] != null ? pendingChanges[field.key] : data?.[field.key]
                                const commonProps = {
                                    maxLength: field.maxInput,
                                    value: value as string,
                                    onChange: handleInputChange,
                                    placeholder: fieldMeta?.placeholder,
                                    disabled,
                                    onFocus: () => handleField(cursor, field.key, field.label)
                                }
                                return (
                                    <Col key={col.fieldKey} span={col.span}>
                                        <Form.Item
                                            label={
                                                field.type === 'checkbox' ? null : <TemplatedTitle widgetName={name} title={field.label} />
                                            }
                                            validateStatus={error ? 'error' : undefined}
                                            help={error}
                                        >
                                            {field.type === 'input' && <Input {...commonProps} />}
                                            {field.type === 'text' && <TextArea autoSize {...commonProps} />}
                                            {field.type !== 'input' && field.type !== 'text' && (
                                                <Field bcName={bcName} cursor={cursor} widgetName={name} widgetFieldMeta={field} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                )
                            })}
                        </Row>
                    )
                })}
            </Row>
        )
    }, [
        data,
        bcName,
        name,
        cursor,
        flattenWidgetFields,
        missingFields,
        metaErrors,
        fields,
        pendingChanges,
        handleInputChange,
        meta.options?.layout?.rows
    ])

    return (
        <div className={styles.drawerFormWidget}>
            <div className={styles.checkboxes}>
                <Checkbox onClick={handleChangeVisible} className={styles.compare} checked={drawerVisible}>
                    Compare
                </Checkbox>
                {drawerVisible && (
                    <Checkbox onClick={handleShowChanges} className={styles.compare} checked={showChanges}>
                        Show Changes
                    </Checkbox>
                )}
            </div>
            <Form colon={false} layout="vertical">
                {resultFields}
            </Form>
            <Drawer
                height={462}
                placement="bottom"
                onClose={handleChangeVisible}
                closable
                visible={drawerVisible}
                getContainer={false}
                mask={false}
                maskClosable={false}
                zIndex={1010}
                bodyStyle={{paddingLeft: menuVisible ? 256 : 48}}
            >
                <div className={styles.compareWidgetContainer}>
                    <CompareWidget
                        onTakeOver={handleTakeOver}
                        meta={compareWidget}
                        cursor={cursor}
                        showChanges={showChanges}
                        field={activeField}
                        pending={pendingChanges ? (pendingChanges[activeField?.key] as string) : null}
                    />
                </div>
            </Drawer>
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: DrawerFormWidgetOwnProps) {
    const {bcName} = ownProps.meta
    const bc = store.screen.bo.bc[bcName]
    const cursor = bc?.cursor
    const bcUrl = buildBcUrl(bcName, true)
    const rowMeta = bcUrl && store.view.rowMeta[bcName]?.[bcUrl]
    const fields = rowMeta?.fields
    const metaErrors = rowMeta?.errors
    const missingFields = (store.view.pendingValidationFails as PendingValidationFails)?.[bcName]?.[cursor]
    const pendingChanges = store.view.pendingDataChanges[bcName]?.[cursor]
    const compareWidget = store.view.widgets.find(widget => widget.type === SmWidgetTypes.Compare)
    const data = store.data[bcName]?.find(item => item.id === cursor)
    return {
        pendingChanges,
        compareWidget,
        fields,
        metaErrors,
        missingFields,
        menuVisible: store.screen.menuVisible,
        cursor,
        data
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onChange: (bcName: string, cursor: string, dataItem: PendingDataItem) => {
            return dispatch($smDo.changeDataItem({bcName, cursor, dataItem}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerFormWidget)

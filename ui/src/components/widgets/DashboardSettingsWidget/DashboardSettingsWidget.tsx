import React from 'react'
import {Dropdown, Menu, Typography} from 'antd'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {useDispatch, useSelector} from 'react-redux'
import {buildBcUrl} from '@tesler-ui/core'
import {MultivalueFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import {SmField, SmFieldTypes, SmWidgetMeta, SmWidgetTypes} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import DashboardSettingsMultivalueTags from './components/DashboardSettingsMultivalueTags'
import styles from './DashboardSettingsWidget.less'
import MultipleSelectPopup from './components/MultipleSelectPopup'
import {getClearedFields} from '../../../utils/getClearefFields'

interface DashboardSettingsWidgetProps {
    meta: SmWidgetMeta
}

const DashboardSettingsWidget: React.FunctionComponent<DashboardSettingsWidgetProps> = props => {
    const {meta} = props
    const {fields, bcName, name} = meta
    const [multipleSelectPopupOpen, setMultipleSelectPopupOpen] = React.useState(false)
    const [multipleSelectPopupField, setMultipleSelectPopupField] = React.useState(null)
    const dispatch = useDispatch()
    const bcUrl = buildBcUrl(bcName, true)
    const data = useSelector((state: AppState) => state.data[bcName]?.[0])
    const selectedField = fields?.find(i => {
        const k = i.key
        if (Array.isArray(data?.[k])) {
            return (data?.[k] as DataItem[]).length > 0
        }
        return !!data?.[k]
    })
    const cursor = useSelector((state: AppState) => state.screen.bo.bc[bcName]?.cursor)
    const actions = useSelector((state: AppState) => state.view.rowMeta[bcName]?.[bcUrl]?.actions)
    const saveAction = actions?.find(i => i.type === 'save')
    const handleSave = React.useCallback(() => {
        dispatch($smDo.sendOperation({bcName, operationType: saveAction.type, widgetName: name}))
    }, [dispatch, bcName, saveAction, name])

    const assocWidgets = useSelector((state: AppState) => state.view.widgets).filter(
        widget => widget.type === SmWidgetTypes.CheckboxAssocListPopup
    )
    const dropPopupPending = React.useCallback(() => dispatch($smDo.clearPopupsPendingChanges({widgetName: name})), [dispatch, name])
    const handleMultipleSelectPopupSave = React.useCallback(() => {
        handleSave()
        dropPopupPending()
    }, [handleSave, dropPopupPending])
    const createOnChangeHandler = React.useCallback(
        (field: SmField) => () => {
            switch (field.type) {
                case FieldType.checkbox:
                    dispatch($smDo.changeDataItem({bcName, cursor, dataItem: {...getClearedFields(fields), [field.key]: true}}))
                    dropPopupPending()
                    handleSave()
                    break
                case FieldType.multivalue: {
                    const multivalueField = field as MultivalueFieldMeta
                    const assocWidget = assocWidgets.find(i => i.bcName === multivalueField.popupBcName)
                    dispatch(
                        $smDo.showViewPopup({
                            calleeWidgetName: name,
                            calleeBCName: bcName,
                            bcName: multivalueField.popupBcName,
                            widgetName: assocWidget.name,
                            assocValueKey: multivalueField.assocValueKey,
                            associateFieldKey: multivalueField.key
                        })
                    )
                    break
                }
                case SmFieldTypes.MultipleSelect: {
                    setMultipleSelectPopupField(field)
                    setMultipleSelectPopupOpen(!multipleSelectPopupOpen)
                    break
                }
                default:
                    console.error('Dashboard settings: Unhandled field type', field.type)
            }
        },
        [
            dispatch,
            bcName,
            cursor,
            handleSave,
            name,
            multipleSelectPopupOpen,
            setMultipleSelectPopupOpen,
            setMultipleSelectPopupField,
            assocWidgets,
            dropPopupPending,
            fields
        ]
    )
    const menu = (
        <Menu>
            {fields.map(i => (
                <Menu.Item key={i.key} onClick={createOnChangeHandler(i)}>
                    <Typography.Text>{i.label}</Typography.Text>
                </Menu.Item>
            ))}
        </Menu>
    )
    const isMultipleSelectPopupUsed =
        multipleSelectPopupField?.type === FieldType.multivalue ||
        multipleSelectPopupField?.type === SmFieldTypes.MultipleSelect ||
        selectedField?.type === FieldType.multivalue ||
        selectedField?.type === SmFieldTypes.MultipleSelect
    const getParentHandler = (element: HTMLElement) => element.parentElement
    return (
        <div>
            <Dropdown overlay={menu} trigger={['click']} getPopupContainer={getParentHandler}>
                <span>
                    <Typography.Text className={styles.dropdownLabel}>{selectedField?.label ?? 'Select filter'}</Typography.Text>
                </span>
            </Dropdown>
            {(selectedField?.type === FieldType.multivalue || selectedField?.type === SmFieldTypes.MultipleSelect) && (
                <DashboardSettingsMultivalueTags
                    meta={meta}
                    fieldMeta={selectedField}
                    cursor={cursor}
                    onSave={handleSave}
                    bcName={bcName}
                />
            )}
            {isMultipleSelectPopupUsed && (
                <MultipleSelectPopup
                    meta={meta}
                    fieldMeta={multipleSelectPopupField || selectedField}
                    cursor={cursor}
                    bcUrl={bcUrl}
                    isShowed={multipleSelectPopupOpen}
                    onChangeVisible={setMultipleSelectPopupOpen}
                    onSave={handleMultipleSelectPopupSave}
                />
            )}
        </div>
    )
}

export default React.memo(DashboardSettingsWidget)

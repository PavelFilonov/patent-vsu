import React from 'react'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {Badge, Button, Icon, Input, Select, Tooltip} from 'antd'
import {MultivalueFieldMeta, WidgetField} from '@tesler-ui/core/interfaces/widget'
import {connect} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {AssociatedItem} from '@tesler-ui/core/interfaces/operation'
import getFilterType from '../utils/getFilterType'
import {AppState} from '../../../../interfaces/reducers'
import {$smDo, setPopupWithInputValue} from '../../../../actions/actions'
import {SmField, SmFieldTypes} from '../../../../interfaces/widget'
import {VsuBcFilter} from '../../../../interfaces/filters'

interface MultipleSelectOwnProps {
    value: DataValue[]
    filterValues: Array<{value: string}>
    displayedValues?: string[]
    setValue: React.Dispatch<DataValue[]>
    fieldName: string
    widgetName: string
    bcName: string
    addFilter: (widgetName: string, bcName: string, filter: BcFilter) => void
    removeFilter: (bcName: string, filter: BcFilter) => void
    fieldType: FieldType | SmFieldTypes
    fieldMeta: WidgetField | SmField
    handlePopupVisibility?: () => void
    title?: string
}

interface MultipleSelectProps extends MultipleSelectOwnProps {
    popupPendingChanges: {
        [cursor: string]: AssociatedItem
    }
    onRemoveAssociation: (bcName: string, dataItem: AssociatedItem) => void
    popupWithInputValue: string
    handleReceivingEntityValue: (popupWithInputValue: string) => void
}

const MultipleSelect: React.FunctionComponent<MultipleSelectProps> = props => {
    const {
        popupPendingChanges,
        onRemoveAssociation,
        value,
        filterValues,
        displayedValues,
        setValue,
        fieldName,
        widgetName,
        bcName,
        addFilter,
        removeFilter,
        fieldType,
        fieldMeta,
        handlePopupVisibility,
        handleReceivingEntityValue,
        popupWithInputValue
    } = props
    const selectRef = React.useRef(null)
    const filterType = getFilterType(fieldType)
    const {Option} = Select
    const [isHovered, setIsHovered] = React.useState(false)
    const filterOptions = React.useMemo(() => {
        return filterValues.map(item => <Option key={item.value}>{item.value}</Option>)
    }, [filterValues])
    const handleSelect = React.useCallback(
        (condition: DataValue[] | number, newValues: DataValue[], prevValues: DataValue[]) => {
            if (condition) {
                addFilter(widgetName, bcName, {
                    type: filterType,
                    fieldName,
                    value: newValues
                })
            } else {
                removeFilter(bcName, {
                    type: filterType,
                    fieldName,
                    value: prevValues
                })
            }
        },
        [addFilter, removeFilter, fieldName, filterType, bcName, widgetName]
    )

    const handleInputValue = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const textValue = e.target.value.substr(0, 100)
        handleReceivingEntityValue(textValue)
    }, [])

    const applyFilter = (v: DataValue | DataValue[], popupWithInputKey?: string, isPopupTypeInput?: boolean) => {
        const type = getFilterType(fieldType, popupWithInputKey, isPopupTypeInput)
        const newFilter: VsuBcFilter = {
            type,
            value: v,
            fieldName: popupWithInputKey
        }
        const prevFilter: VsuBcFilter = {
            type,
            value: [],
            fieldName: popupWithInputKey
        }
        if (v) {
            addFilter(widgetName, bcName, newFilter)
        } else {
            removeFilter(bcName, prevFilter)
        }
    }
    const handleBlur = (popupWithInputKey?: string, isPopupTypeInput?: boolean) => {
        applyFilter(popupWithInputValue, popupWithInputKey, isPopupTypeInput)
    }
    const toggleHover = (bool: boolean) => {
        setIsHovered(bool)
    }

    function handleChange(v: DataValue[]) {
        const prevValue = value || []
        const newValue = (v.length > 0 && typeof v[0] !== 'string' ? ((v as unknown) as {key: string}[]).map(i => i.key) : v) as DataValue[]
        /**
         * If AssocListPopup is used, we need to remove redundant items from popup's pendingDataChanges
         */
        if (popupPendingChanges && Object.values(popupPendingChanges).length > 0 && newValue.length < prevValue.length) {
            const pendingChangesArray = popupPendingChanges && Object.values(popupPendingChanges)
            const cursors = prevValue
                .filter(i => !newValue.includes(i))
                .map(i => pendingChangesArray[pendingChangesArray.findIndex(j => j._value === i)].id)
            cursors.forEach(i => {
                onRemoveAssociation((fieldMeta as MultivalueFieldMeta).popupBcName, {
                    ...popupPendingChanges[i as string],
                    _associate: false
                })
            })
        }
        setValue(newValue)
        handleSelect(newValue.length, newValue, prevValue)
    }

    const isAssocPopupUsed = (fieldMeta as MultivalueFieldMeta)?.hasOwnProperty('popupBcName')

    const getContainer = () => selectRef?.current
    let resultSelect = (
        <Select
            getPopupContainer={getContainer}
            mode="multiple"
            style={{width: '100%'}}
            placeholder="Все"
            onChange={handleChange}
            value={value || []}
        >
            {filterOptions}
        </Select>
    )
    if (isAssocPopupUsed) {
        const isPopupTypeInput = (fieldMeta as SmField)?.hasOwnProperty('popupWithInputKey')
        if (isPopupTypeInput) {
            const popupWithInputKey = (fieldMeta as SmField)?.popupWithInputKey
            const inputPlaceHolder = (fieldMeta as SmField)?.inputPlaceHolder
            const secondTitle = (fieldMeta as SmField)?.secondTitle
            resultSelect = (
                <div style={{display: 'flex'}}>
                    <Input
                        style={{width: '85%'}}
                        value={popupWithInputValue as string}
                        onChange={handleInputValue}
                        onBlur={() => handleBlur(popupWithInputKey, isPopupTypeInput)}
                        suffix={<Icon type="search" />}
                        placeholder={inputPlaceHolder}
                    />
                    <div onMouseEnter={() => toggleHover(true)} onMouseLeave={() => toggleHover(false)}>
                        <Badge
                            style={isHovered && value ? null : {backgroundColor: '#9E9E9E'}}
                            count={
                                isHovered && value ? (
                                    <Icon
                                        type="close-circle"
                                        theme="filled"
                                        style={{color: 'red', fontSize: '20px'}}
                                        onClick={() => handleChange([])}
                                    />
                                ) : (
                                    value?.length
                                )
                            }
                        >
                            <Tooltip placement="top" title={secondTitle || null}>
                                <Button style={value ? {color: '#176CB6', borderColor: '#176CB6'} : null} onClick={handlePopupVisibility}>
                                    <Icon type="filter" />
                                </Button>
                            </Tooltip>
                        </Badge>
                    </div>
                </div>
            )
        } else {
            const values = value?.map((item, index) => ({
                key: item,
                label: displayedValues?.[index]
            }))
            resultSelect = (
                <Select
                    getPopupContainer={getContainer}
                    mode="multiple"
                    style={{width: '100%'}}
                    placeholder="Все"
                    onFocus={handlePopupVisibility}
                    onChange={handleChange as any}
                    value={values || []}
                    suffixIcon={<Icon type="folder-open" style={{color: 'rgba(0, 0, 0, 0.65)'}} />}
                    dropdownRender={() => <></>}
                    showArrow
                    labelInValue
                >
                    {filterOptions}
                </Select>
            )
        }
    }

    return <div ref={selectRef}>{resultSelect}</div>
}

function mapStateToProps(state: AppState, ownProps: MultipleSelectOwnProps) {
    const popupBcName = (ownProps.fieldMeta as MultivalueFieldMeta)?.popupBcName
    return {
        popupPendingChanges: popupBcName && state.view.pendingDataChanges[popupBcName],
        popupWithInputValue: state.screen.popupWithInputValue
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        handleReceivingEntityValue: (popupWithInputValue: string) => {
            dispatch(setPopupWithInputValue(popupWithInputValue))
        },
        onRemoveAssociation: (bcName: string, dataItem: AssociatedItem) =>
            dispatch($smDo.changeDataItem({bcName, dataItem, cursor: dataItem.id}))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultipleSelect)

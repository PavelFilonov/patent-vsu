import React, {FunctionComponent} from 'react'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {DatePicker, Icon, Input} from 'antd'
import {Moment} from 'moment'
import {$do, connect} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {MultivalueFieldMeta, WidgetField, WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import {VsuBcFilter} from '../../../../interfaces/filters'
import {AppState} from '../../../../interfaces/reducers'
import FilterFormInputWrapper from './FilterFormInputWrapper'
import MultipleSelect from './MultipleSelect'
import getFilterType from '../utils/getFilterType'
import {$smDo} from '../../../../actions/actions'
import ColorIconSelect from './ColorIconSelect'
import {SmFieldTypes} from '../../../../interfaces/widget'
import CheckboxInput from '../../../ui/CheckboxInput/CheckboxInput'
import styles from './FilterFormInput.less'
import RangeInput from './RangeInput'
import {useRefState} from '../../../../hooks/useRefState'

const moment = require('moment')

export interface FilterFormInputMapStateToProps {
    filter: VsuBcFilter
    assocWidgetName?: string
    activeFiltersLength: number
}

export interface FilterFormInputMapDispatchToProps {
    addFilter: (widgetName: string, bcName: string, filter: VsuBcFilter) => void
    removeFilter: (bcName: string, filter: VsuBcFilter) => void
    onMultivalueAssocOpen: (
        bcName: string,
        calleeBCName: string,
        calleeWidgetName: string,
        assocValueKey: string,
        associateFieldKey: string,
        widgetName: string
    ) => void
}

export interface FilterFormInputOwnProps {
    name: string
    widgetName: string
    bcName: string
    fieldType: FieldType | SmFieldTypes
    title: string
    filterValues?: Array<{
        options?: {
            iconType?: string
            backgroundColor?: string
        }
        value: string
    }>
    fieldMeta: WidgetField
}
export interface FilterFormInputProps extends FilterFormInputOwnProps, FilterFormInputMapStateToProps, FilterFormInputMapDispatchToProps {}
export const FilterFormInput: FunctionComponent<FilterFormInputProps> = props => {
    const {
        assocWidgetName,
        name,
        widgetName,
        bcName,
        fieldType,
        title,
        filterValues,
        fieldMeta,
        filter,
        activeFiltersLength,
        addFilter,
        removeFilter,
        onMultivalueAssocOpen
    } = props
    const [oldActiveFiltersLength, setOldActiveFiltersLength] = useRefState(activeFiltersLength)
    const [value, setValue] = React.useState(filter ? filter.value : null)
    const [popupVisible, setPopupVisible] = React.useState(false)

    React.useEffect(() => {
        if (activeFiltersLength !== oldActiveFiltersLength.current) {
            setValue(filter ? filter.value : null)
            setOldActiveFiltersLength(activeFiltersLength)
        }
    }, [activeFiltersLength, filter, oldActiveFiltersLength, setOldActiveFiltersLength, setValue])

    const handleVisibleChange = React.useCallback(() => {
        setPopupVisible(!popupVisible)
    }, [setPopupVisible, popupVisible])
    const handleInputValue = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const textValue = e.target.value.substr(0, 100)
        setValue(textValue || null)
    }, [])

    const handleDateValue = (date: Moment) => {
        const transformedDate = date ? date.format('YYYY-MM-DDTHH:mm:ss') : null
        setValue(transformedDate)
        const type = getFilterType(fieldType, name)
        const newFilter: VsuBcFilter = {
            type,
            value: transformedDate,
            fieldName: name
        }
        if (transformedDate) {
            addFilter(widgetName, bcName, newFilter)
        } else {
            removeFilter(bcName, filter)
        }
    }
    const applyFilter = (v: DataValue | DataValue[]) => {
        const type = getFilterType(fieldType)
        const newFilter: VsuBcFilter = {
            type,
            value: v,
            fieldName: name
        }
        if (v) {
            addFilter(widgetName, bcName, newFilter)
        } else {
            removeFilter(bcName, filter)
        }
    }
    const handleBlur = () => {
        applyFilter(value)
    }

    const handleCheckboxValue = () => {
        const newValue = !value || false
        setValue(newValue)
        applyFilter(newValue)
    }

    const handlePopup = React.useCallback(
        (targetBcName: string, calleeBCName: string, calleeWidgetName: string, assocValueKey: string, associateFieldKey: string) => {
            onMultivalueAssocOpen(targetBcName, calleeBCName, calleeWidgetName, assocValueKey, associateFieldKey, assocWidgetName)
            handleVisibleChange()
        },
        [onMultivalueAssocOpen, assocWidgetName, handleVisibleChange]
    )
    function getInputByType() {
        switch (fieldType) {
            case SmFieldTypes.ResultWithIcon:
            case FieldType.dictionary:
            case FieldType.pickList:
            case FieldType.multivalue:
                if (filterValues.some(i => i.options?.backgroundColor) || filterValues.some(i => i.options?.iconType)) {
                    return (
                        <ColorIconSelect
                            widgetName={widgetName}
                            value={value as DataValue[]}
                            displayedValues={filter?.displayedValues}
                            filterValues={filterValues}
                            setValue={setValue}
                            fieldName={name}
                            bcName={bcName}
                            addFilter={addFilter}
                            removeFilter={removeFilter}
                            fieldType={fieldType}
                            fieldMeta={fieldMeta}
                        />
                    )
                }
                return (
                    <MultipleSelect
                        widgetName={widgetName}
                        value={value as DataValue[]}
                        displayedValues={filter?.displayedValues}
                        filterValues={filterValues}
                        setValue={setValue}
                        fieldName={name}
                        bcName={bcName}
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                        fieldType={fieldType}
                        fieldMeta={fieldMeta}
                        handlePopupVisibility={handleVisibleChange}
                        title={title}
                    />
                )
            case FieldType.checkbox:
                return <CheckboxInput className={styles.header} value={title} onChange={handleCheckboxValue} selected={value as boolean} />
            case FieldType.input:
            case FieldType.text:
            case FieldType.number:
                return (
                    <Input
                        value={value as string}
                        suffix={<Icon type="search" />}
                        onChange={handleInputValue}
                        onBlur={handleBlur}
                        placeholder={`${title}`}
                    />
                )
            case FieldType.date:
                return <DatePicker value={value ? moment(value, 'YYYY-MM-DD') : null} onChange={handleDateValue} format="YYYY-MM-DD" />
            case SmFieldTypes.Range:
                return <RangeInput fieldName={fieldMeta.key} bcName={bcName} />
            default:
                return null
        }
    }
    React.useEffect(() => {
        if (popupVisible) {
            handlePopup(
                (fieldMeta as MultivalueFieldMeta).popupBcName,
                bcName,
                widgetName,
                (fieldMeta as MultivalueFieldMeta).assocValueKey,
                (fieldMeta as MultivalueFieldMeta).associateFieldKey
            )
        }
    }, [popupVisible, bcName, widgetName, fieldMeta, handlePopup])
    const skipTitle = fieldType === FieldType.checkbox
    return (
        <FilterFormInputWrapper title={title} skipTitle={skipTitle}>
            {getInputByType()}
        </FilterFormInputWrapper>
    )
}

export function mapStateToProps(state: AppState, ownProps: FilterFormInputOwnProps): FilterFormInputMapStateToProps {
    const assocBcName = (ownProps.fieldMeta as MultivalueFieldMeta)?.popupBcName
    const filter = state.screen.filters[ownProps.bcName]?.find(item => item.fieldName === ownProps.name)
    const activeFiltersLength = state.screen.activeFiltersLengthList[ownProps.bcName]
    const assocWidgetName: string =
        assocBcName && state.view.widgets.find(i => i.bcName === assocBcName && i.type === WidgetTypes.AssocListPopup)?.name
    return {
        assocWidgetName,
        filter,
        activeFiltersLength
    }
}

export function mapDispatchToProps(dispatch: Dispatch): FilterFormInputMapDispatchToProps {
    return {
        removeFilter: (bcName: string, filter: VsuBcFilter) => dispatch($do.bcRemoveFilter({bcName, filter})),
        addFilter: (widgetName: string, bcName: string, filter: VsuBcFilter) =>
            dispatch($smDo.smBcAddFilter({bcName, filter, widgetName})),
        onMultivalueAssocOpen: (
            bcName: string,
            calleeBCName: string,
            calleeWidgetName: string,
            assocValueKey: string,
            associateFieldKey: string,
            widgetName: string
        ) => {
            dispatch(
                $do.showViewPopup({
                    bcName,
                    widgetName,
                    calleeBCName,
                    calleeWidgetName,
                    assocValueKey,
                    associateFieldKey,
                    isFilter: true
                })
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterFormInput)

import React from 'react'
import {useSelector} from 'react-redux'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import CheckboxPopup from '../../../ui/CheckboxPopup/CheckboxPopup'
import {SmField, SmWidgetMeta} from '../../../../interfaces/widget'
import {AppState} from '../../../../interfaces/reducers'
import DashboardMultipleSelectCheckboxList from './DashboardMultipleSelectCheckboxList'
import SearchInput from '../../../ui/SearchInput/SearchInput'

interface MultipleSelectPopupProps {
    meta: SmWidgetMeta
    fieldMeta: SmField
    cursor: string
    bcUrl: string
    onChangeVisible: (v: boolean) => void
    isShowed: boolean
    onSave: () => void
}
const emptyData: string[] = []
const MultipleSelectPopup: React.FunctionComponent<MultipleSelectPopupProps> = props => {
    const {meta, fieldMeta, bcUrl, isShowed, onChangeVisible, onSave, cursor} = props
    const {bcName} = meta
    const [searchQuery, setSearchQuery] = React.useState('')
    const [validationError, setValidationError] = React.useState(false)
    const handleQueryChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), [
        setSearchQuery
    ])
    const bcData = useSelector((state: AppState) => state.data[bcName]?.find(i => i.id === cursor))
    const fieldData = bcData?.[fieldMeta?.key]
    const data = (fieldData as MultivalueSingleValue[])?.map(i => i.value)
    const pendingData = useSelector((state: AppState) => state.view.pendingDataChanges[bcName]?.[cursor])
    const fieldPending = pendingData?.[fieldMeta?.key]
    const value = React.useMemo(() => (fieldPending as MultivalueSingleValue[])?.map(i => i.value) || data || emptyData, [
        fieldPending,
        data
    ])
    const rowMeta = useSelector((state: AppState) => state.view.rowMeta[bcName]?.[bcUrl])
    const rowMetaFields = rowMeta?.fields
    const rowMetaField = rowMetaFields?.find(i => i.key === fieldMeta?.key)
    const values = rowMetaField?.values?.map(i => i.value)
    const handleCancel = React.useCallback(() => {
        onChangeVisible(!isShowed)
        setSearchQuery('')
    }, [onChangeVisible, isShowed])
    const handleSubmit = React.useCallback(() => {
        if (value?.length > 0) {
            onSave()
            handleCancel()
        } else {
            setValidationError(true)
            setTimeout(() => setValidationError(false), 300)
            console.warn('MultipleSelectPopup: there is no selected items')
        }
    }, [onSave, value, handleCancel, setValidationError])
    return (
        <CheckboxPopup
            showed={isShowed}
            bcName={bcName}
            title={meta.title}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            searchComponent={<SearchInput value={searchQuery} onChange={handleQueryChange} />}
        >
            <DashboardMultipleSelectCheckboxList
                validationError={validationError}
                cursor={cursor}
                meta={meta}
                fieldMeta={fieldMeta}
                value={value}
                filterQuery={searchQuery.toLowerCase()}
                data={values}
            />
        </CheckboxPopup>
    )
}

export default React.memo(MultipleSelectPopup)

import {FieldType} from '@tesler-ui/core/interfaces/view'
import {FilterType} from '@tesler-ui/core/interfaces/filters'
import {SmFieldTypes} from '../../../../interfaces/widget'

function getFilterType(fieldType: FieldType | SmFieldTypes, fieldName?: string, isPopupTypeInput?: boolean) {
    switch (fieldType) {
        case SmFieldTypes.ResultWithIcon:
        case FieldType.dictionary:
        case FieldType.multivalue:
            if (isPopupTypeInput) {
                return FilterType.contains
            }
            return FilterType.equalsOneOf
        case FieldType.checkbox:
            return FilterType.specified
        case FieldType.date:
            if (fieldName?.toLowerCase().includes('start')) {
                return FilterType.greaterOrEqualThan
            }
            if (fieldName?.toLowerCase().includes('end')) {
                return FilterType.lessOrEqualThan
            }
            return FilterType.equals
        case FieldType.number:
        case FieldType.pickList:
            return FilterType.equals
        case FieldType.input:
        case FieldType.text:
            return FilterType.contains
        default:
            return FilterType.equals
    }
}

export default getFilterType

import {FieldType} from '@tesler-ui/core/interfaces/view'
import {FilterType} from '@tesler-ui/core/interfaces/filters'
import getFilterType from '../getFilterType'

describe('getFilterType test', () => {
    const input = {
        dictionary: FieldType.dictionary,
        checkbox: FieldType.checkbox,
        multivalue: FieldType.multivalue,
        text: FieldType.text
    }
    const output = {
        equalsOneOf: FilterType.equalsOneOf,
        specified: FilterType.specified,
        equals: FilterType.equals,
        contains: FilterType.contains
    }
    it('should work', () => {
        expect(getFilterType(input.dictionary)).toEqual(output.equalsOneOf)
        expect(getFilterType(input.checkbox)).toEqual(output.specified)
        expect(getFilterType(input.multivalue)).toEqual(output.equalsOneOf)
        expect(getFilterType(input.text)).toEqual(output.contains)
        expect(getFilterType(FieldType.hidden)).toEqual(output.equals)
        expect(getFilterType(FieldType.date)).toEqual(output.equals)
        expect(getFilterType(FieldType.date, 'startDate')).toEqual(FilterType.greaterOrEqualThan)
        expect(getFilterType(FieldType.date, 'endDate')).toEqual(FilterType.lessOrEqualThan)
    })
})

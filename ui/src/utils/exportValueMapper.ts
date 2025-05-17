import {DataValue, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {SmField} from '../interfaces/widget'

const moment = require('moment')

function valueMapper(value: DataValue, fieldMeta: SmField) {
    switch (fieldMeta.type) {
        case FieldType.date:
            return !value ? '' : moment(value).format('YYYY/MM/DD')
        case FieldType.multivalue:
            return (value as MultivalueSingleValue[])?.map(i => i.value.trim()).join('\n') || ''
        default:
            return value || ''
    }
}

export default valueMapper

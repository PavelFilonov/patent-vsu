import {PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {SmField, SmFieldTypes} from '../interfaces/widget'

export function getClearedFields(fields: SmField[]) {
    const result: PendingDataItem = {}
    fields.forEach(i => {
        if (i.type === FieldType.multivalue || i.type === SmFieldTypes.MultipleSelect) {
            result[i.key] = []
        }
        if (i.type === FieldType.checkbox) {
            result[i.key] = false
        }
    })
    return result
}

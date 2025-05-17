import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {FieldType} from '@tesler-ui/core/interfaces/view'

export interface FilterableField extends RowMetaField {
    title: string
    type: FieldType
}

import React from 'react'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {TemplatedTitle, useTranslation} from '@tesler-ui/core'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import styles from './SmColumnTitle.less'
import SmColumnSort from './SmColumnSort'
import {SmField, SmFieldTypes} from '../../../interfaces/widget'

interface SmColumnTitleProps {
    widgetName: string
    fieldMeta: SmField
    rowMeta: RowMetaField
    sortingDisabled: boolean
}

const noSortableFieldTypes = [
    FieldType.multivalue,
    FieldType.multivalueHover,
    FieldType.multifield,
    FieldType.hidden,
    FieldType.fileUpload,
    FieldType.inlinePickList,
    FieldType.hint
]

const SmColumnTitle: React.FunctionComponent<SmColumnTitleProps> = props => {
    const {t} = useTranslation()
    const {widgetName, fieldMeta, rowMeta, sortingDisabled} = props
    const [sortShown, setSortShown] = React.useState(false)
    const createShowHandler = React.useCallback((shown: boolean) => () => setSortShown(shown), [setSortShown])
    if (!fieldMeta && !rowMeta) {
        return null
    }
    const title = <TemplatedTitle widgetName={widgetName} title={t(fieldMeta.title)} />
    if (!rowMeta) {
        return <div>{title}</div>
    }

    const compositeFieldIncludesNoSortable =
        fieldMeta.type === SmFieldTypes.Composite &&
        fieldMeta.fields.map(i => i.type).filter(i => noSortableFieldTypes.includes(i)).length > 0

    const noSortable = sortingDisabled || noSortableFieldTypes.includes(fieldMeta.type) || compositeFieldIncludesNoSortable

    const sort = !noSortable && <SmColumnSort widgetName={widgetName} fieldKey={fieldMeta.key} shown={sortShown} />

    return (
        <div className={styles.container} onMouseEnter={createShowHandler(true)} onMouseLeave={createShowHandler(false)}>
            {title}
            {sort}
        </div>
    )
}

export default React.memo(SmColumnTitle)

import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Tag, Typography} from 'antd'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {MultivalueFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {SmField, SmFieldTypes, SmWidgetMeta} from '../../../../interfaces/widget'
import {AppState} from '../../../../interfaces/reducers'
import {$smDo} from '../../../../actions/actions'
import styles from './DashboardSettingsMultivalueTags.less'

interface DashboardSettingsMultivalueTagsProps {
    meta: SmWidgetMeta
    cursor: string
    fieldMeta: MultivalueFieldMeta | SmField
    onSave: () => void
    bcName: string
}

const DashboardSettingsMultivalueTags: React.FunctionComponent<DashboardSettingsMultivalueTagsProps> = props => {
    const {meta, fieldMeta, cursor, onSave, bcName} = props
    const dispatch = useDispatch()
    const data = useSelector((state: AppState) => state.data[meta.bcName]?.find(i => i.id === cursor))
    const pendingValue = useSelector((state: AppState) => state.view.pendingDataChanges[meta.bcName]?.[cursor]?.[fieldMeta.key])
    const value: MultivalueSingleValue[] =
        pendingValue !== undefined ? (pendingValue as MultivalueSingleValue[]) : (data?.[fieldMeta.key] as MultivalueSingleValue[])
    const createDeleteHandler = React.useCallback(
        (id: string) => () => {
            if (fieldMeta.type === FieldType.multivalue) {
                dispatch(
                    $smDo.removeMultivalueTag({
                        bcName: meta.bcName,
                        cursor,
                        popupBcName: fieldMeta.popupBcName,
                        associateFieldKey: fieldMeta.associateFieldKey,
                        dataItem: value.filter(i => i.id !== id),
                        removedItem: value.find(i => i.id === id)
                    })
                )
            }
            if ((fieldMeta as SmField).type === SmFieldTypes.MultipleSelect) {
                const index = value.findIndex(i => i.id === id)
                if (index > -1) {
                    const newValue = value.slice()
                    newValue.splice(index, 1)
                    dispatch($smDo.changeDataItem({cursor, bcName, dataItem: {[fieldMeta?.key]: newValue}}))
                }
            }
            onSave()
        },
        [dispatch, meta, cursor, fieldMeta, value, onSave, bcName]
    )

    const handleTagClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation()
    }

    return (
        <div className={styles.container}>
            {value?.map(val => {
                const closable = value.length > 1
                return (
                    <Tag closable={closable} onClose={createDeleteHandler(val.id)} key={val.id} title={val.value} onClick={handleTagClick}>
                        <Typography.Text>{val.value}</Typography.Text>
                    </Tag>
                )
            })}
        </div>
    )
}

export default React.memo(DashboardSettingsMultivalueTags)

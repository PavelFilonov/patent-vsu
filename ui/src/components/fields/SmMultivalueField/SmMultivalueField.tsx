import React from 'react'
import {connect, useSelector} from 'react-redux'
import {MultivalueFieldProps} from '@tesler-ui/core/components/Multivalue/MultivalueField'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {$do, buildBcUrl} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {MultivalueFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import MultivalueFieldValues from './components/MultivalueFieldValues/MultivalueFieldValues'
import SimpleControlLink from '../../ui/SimpleControlLink/SimpleControlLink'
import styles from './SmMultivalueField.less'

interface SmMultivalueFieldProps extends Omit<MultivalueFieldProps, 'widgetFieldMeta' | 'onMultivalueAssocOpen'> {
    meta: MultivalueFieldMeta & {
        placeholder: string
        title: string
    }
    buttonLabel: string
    value: MultivalueSingleValue[]
    onMultivalueAssocOpen: (bcName: string, widgetFieldMeta: MultivalueFieldMeta, popupWidgetName: string) => void
    onChange?: (value: MultivalueSingleValue[]) => void
}

const SmMultivalueField: React.FunctionComponent<SmMultivalueFieldProps> = (props: SmMultivalueFieldProps) => {
    const {disabled, onMultivalueAssocOpen, bcName, meta, buttonLabel, value, onChange, onRemove, popupBcName, cursor, fieldKey} = props
    const popupWidgetName = useSelector((store: AppState) => store.view.widgets.find(i => i.bcName === popupBcName)?.name)
    const handleOpen = React.useCallback(() => {
        if (!disabled) {
            onMultivalueAssocOpen(bcName, meta, popupWidgetName)
        }
    }, [disabled, onMultivalueAssocOpen, bcName, meta, popupWidgetName])

    const handleDelete = React.useCallback(
        (recordId: string) => {
            if (!disabled) {
                const newValue = value.filter(item => item.id !== recordId)
                const removedValue = value.find(item => item.id === recordId)

                onRemove(bcName, popupBcName, cursor, fieldKey, newValue, removedValue)
                onChange(newValue)
            }
        },
        [onRemove, popupBcName, cursor, fieldKey, value, disabled, bcName, onChange]
    )

    return (
        <div>
            <SimpleControlLink
                iconType="plus-circle"
                theme="filled"
                className={styles.multivalueEdit}
                onClick={handleOpen}
                label={buttonLabel}
            />
            {value?.length ? <MultivalueFieldValues values={value} handleDelete={handleDelete} /> : <div>{meta.placeholder}</div>}
        </div>
    )
}

const mapStateToProps = (store: AppState, ownProps: SmMultivalueFieldProps) => {
    const widget = store.view.widgets.find(item => item.name === ownProps.widgetName)
    const bcName = widget?.bcName
    const {popupBcName} = ownProps.meta
    const bcUrl = buildBcUrl(popupBcName, true)
    const popupRowMetaDone = !!store.view.rowMeta[popupBcName]?.[bcUrl]?.fields
    return {
        bcName,
        popupBcName,
        popupRowMetaDone,
        page: 0,
        assocValueKey: ownProps.meta.assocValueKey,
        fieldKey: ownProps.meta.key,
        buttonLabel: ownProps.meta.title
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onMultivalueAssocOpen: (bcName: string, widgetFieldMeta: MultivalueFieldMeta, popupWidgetName: string) => {
            dispatch(
                $do.showViewPopup({
                    assocValueKey: widgetFieldMeta.assocValueKey,
                    bcName: widgetFieldMeta.popupBcName,
                    widgetName: popupWidgetName,
                    calleeBCName: bcName,
                    associateFieldKey: widgetFieldMeta.key
                })
            )
        },
        onRemove: (
            bcName: string,
            popupBcName: string,
            cursor: string,
            associateFieldKey: string,
            dataItem: MultivalueSingleValue[],
            removedItem: MultivalueSingleValue
        ) => {
            dispatch(
                $do.removeMultivalueTag({
                    bcName,
                    popupBcName,
                    cursor,
                    associateFieldKey,
                    dataItem,
                    removedItem
                })
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmMultivalueField)

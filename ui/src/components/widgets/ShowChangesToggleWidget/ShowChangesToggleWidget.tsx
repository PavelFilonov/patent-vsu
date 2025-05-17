import React from 'react'
import {Checkbox} from 'antd'
import {connect, useTranslation} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {SmListTableWidgetMeta, SmWidgetMeta} from '../../../interfaces/widget'
import styles from './ShowChangesToggleWidget.less'
import TableWidget from '../TableWidget/TableWidget'
import {$smDo} from '../../../actions/actions'
import {AppState} from '../../../interfaces/reducers'

interface VariableFieldsListTempOwnProps {
    meta: SmWidgetMeta
}
interface VariableFieldsListTempProps extends VariableFieldsListTempOwnProps {
    changeShowCondition: (key: string, fieldKey: string, value: DataValue) => void
    smShowConditionValue: DataValue
}

/**
 * This widget created for next purposes:
 * There was need to display another table by clicking on checkbox on Measurement criteria widget on screen of creation standard.
 * But common @tesler's process of  `showCondition` was not applicable.
 * So this widget was created.
 * It uses mechanism of `changeSmShowCondition` actions for storing conditions of displaying in redux store
 * which doesn't depends on BC data.
 *
 * If another use case will appear then should think about universalization of this widget.
 */
const ShowChangesToggleWidget: React.FunctionComponent<VariableFieldsListTempProps> = props => {
    const {meta, changeShowCondition, smShowConditionValue} = props
    const {t} = useTranslation()

    const handleChangeVisible = React.useCallback(() => {
        const {showCondition} = meta.options
        changeShowCondition(showCondition.key, showCondition.params.fieldKey, !smShowConditionValue)
    }, [changeShowCondition, meta.options, smShowConditionValue])
    return (
        <div>
            <div className={styles.checkBoxContainer}>
                <Checkbox onClick={handleChangeVisible} className={styles.compare} checked={smShowConditionValue as boolean}>
                    <span className={styles.checkboxLabel}>{t('Show changes')}</span>
                </Checkbox>
            </div>
            <TableWidget meta={meta as SmListTableWidgetMeta} />
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: VariableFieldsListTempOwnProps) {
    const smShowConditionValue =
        store.view.smShowCondition?.[ownProps.meta.options?.showCondition?.key]?.[ownProps.meta.options?.showCondition?.params.fieldKey]
    return {
        smShowConditionValue
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        changeShowCondition: (key: string, fieldKey: string, value: DataValue) =>
            dispatch($smDo.changeSmShowCondition({key, fieldKey, value}))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowChangesToggleWidget)

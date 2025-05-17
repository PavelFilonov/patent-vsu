import React from 'react'
import {connect, buildBcUrl} from '@tesler-ui/core'
import {Steps} from 'antd'
import {WidgetStepsMeta} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import styles from './Steps.less'

interface StepsWidgetOwnProps {
    meta: WidgetStepsMeta
}

interface StepsWidgetProps {
    values: Array<{value: string; icon: string; options?: {description?: string}}>
    value: string
}

export function StepsWidget(props: StepsWidgetProps) {
    const {values, value} = props
    const {Step} = Steps
    const resultValues = (values && values.map(step => step.value)) || []
    const current = resultValues && resultValues.findIndex(step => step === value)
    const currentDescription = values?.find(i => i.value === value)?.options?.description
    return (
        <div className={styles.stepsContainer}>
            <Steps className={styles.container} size="small" current={current}>
                {resultValues.map(step => (
                    <Step
                        key={step}
                        className={styles.step}
                        title={
                            // <Popover content="More information about step" trigger="hover">
                            step
                            // </Popover>
                        }
                    />
                ))}
            </Steps>
            <div className={styles.stepInfo}>
                Шаг {current + 1} из {resultValues.length}
                {currentDescription && <span className={styles.stepDescription}>{currentDescription}</span>}
            </div>
        </div>
    )
}

function mapStateToProps(store: AppState, ownProps: StepsWidgetOwnProps) {
    const {bcName} = ownProps.meta
    const bcUrl = buildBcUrl(bcName, true)
    const rowMeta = bcUrl && store.view.rowMeta[bcName] && store.view.rowMeta[bcName][bcUrl]
    const widgetField = ownProps.meta.fields[0].key
    const dictionaryField = rowMeta && rowMeta.fields.find(item => item.key === widgetField)
    const values = dictionaryField && dictionaryField.values
    const value = dictionaryField && dictionaryField.currentValue
    return {
        values,
        value
    }
}

export default connect(mapStateToProps)(StepsWidget)

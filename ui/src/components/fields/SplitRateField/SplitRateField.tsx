import React from 'react'
import {useSelector} from 'react-redux'
import cn from 'classnames'
import {SmField} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import styles from './SplitRateField.less'

interface SplitRateFieldProps {
    cursor: string
    meta: SmField
    widgetName: string
}

function SplitRateField({meta, widgetName, cursor}: SplitRateFieldProps) {
    const {fields} = meta
    const [greenField, redField] = fields
    const widget = useSelector((state: AppState) => state.view.widgets.find(i => i.name === widgetName))
    const {bcName} = widget
    const data = useSelector((state: AppState) => bcName && state.data?.[bcName]?.find(i => i.id === cursor))
    const greenValue = data?.[greenField.key] as string
    const redValue = data?.[redField.key] as string
    return (
        <>
            <span className={cn(styles.value, {[styles.greenValue]: parseInt(greenValue, 10) > 0})}>{greenValue}</span>
            <span className={cn(styles.value, styles.separator)}>/</span>
            <span className={cn(styles.value, {[styles.redValue]: parseInt(redValue, 10) > 0})}>{redValue}</span>
        </>
    )
}

export default React.memo(SplitRateField)

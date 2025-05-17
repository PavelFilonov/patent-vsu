import React from 'react'
import {connect} from '@tesler-ui/core'
import {AppState} from '../../../interfaces/reducers'
import {HintLabelOptions, SmWidgetMeta} from '../../../interfaces/widget'
import styles from './HintLabelField.less'

interface HintLabelFieldProps {
    widgetName: string
    meta: SmWidgetMeta
    label: string
}

const HintLabelField: React.FC<HintLabelFieldProps> = ({label}) => {
    return <div className={styles.label}>{label}</div>
}

const mapStateToProps = (state: AppState, ownProps: HintLabelFieldProps) => {
    const widget = state.view.widgets.find(item => item.name === ownProps.widgetName)
    const label = (widget.options as HintLabelOptions)?.hintLabel

    return {
        label
    }
}

export default connect(mapStateToProps)(HintLabelField)

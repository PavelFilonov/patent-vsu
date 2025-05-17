import React, {FunctionComponent} from 'react'
import {Input} from 'antd'
import {Dispatch} from 'redux'
import {$do} from '@tesler-ui/core'
import {connect} from 'react-redux'
import {BaseFieldProps, ChangeDataItemPayload} from '@tesler-ui/core/components/Field/Field'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import styles from './FramedInput.less'

export interface FramedInputProps extends BaseFieldProps {
    value: DataValue
    onChange: (payload: ChangeDataItemPayload) => void
    onSelectCell: (widgetName: string, cursor: string, fieldKey: string) => void
}

export const FramedInput: FunctionComponent<FramedInputProps> = props => {
    const {value, widgetName, onSelectCell, onChange, cursor, meta, ...rest} = props
    const [localValue, setLocalValue] = React.useState(null)

    const handleChange = React.useCallback(
        eventValue => {
            setLocalValue(null)
            onChange(eventValue)
        },
        [onChange]
    )

    const handleInputBlur = React.useCallback(() => {
        if (localValue != null) {
            handleChange(localValue)
        }
    }, [localValue, handleChange])

    const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(event.target.value)
    }, [])

    let resultValue = ''
    if (localValue !== null) {
        resultValue = localValue
    } else if (value) {
        resultValue = String(value)
    }
    return (
        <div className={styles.container}>
            <Input
                {...rest}
                value={resultValue}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onClick={() => onSelectCell(widgetName, cursor, meta.key)}
            />
        </div>
    )
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onSelectCell: (widgetName: string, cursor: string, fieldKey: string) => {
            dispatch($do.selectTableCellInit({widgetName, rowId: cursor, fieldKey}))
        }
    }
}

export default connect(null, mapDispatchToProps)(FramedInput)

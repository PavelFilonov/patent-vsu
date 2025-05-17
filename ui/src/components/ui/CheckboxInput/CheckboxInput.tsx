import React from 'react'
import cn from 'classnames'
import styles from './CheckboxInput.less'

interface CheckboxInputProps {
    indeterminate?: boolean
    selected: boolean
    className?: string
    value: string
    disabled?: boolean
    onChange: (v: string) => void
    valueElement?: React.ReactNode
}

const CheckboxInput: React.FunctionComponent<CheckboxInputProps> = props => {
    const {selected, value, onChange, className, disabled, indeterminate, valueElement} = props
    const handleChange = React.useCallback(() => {
        if (!disabled) {
            onChange(value)
        }
    }, [onChange, value, disabled])
    return (
        <div className={cn(styles.container, className)}>
            <label
                className={cn(styles.checkbox, {
                    [styles.disabled]: disabled,
                    [styles.selected]: selected,
                    [styles.indeterminate]: indeterminate
                })}
            >
                <input checked={selected ?? false} onChange={handleChange} type="checkbox" className={styles.input} />
                {valueElement || <span className={styles.label}>{value}</span>}
            </label>
        </div>
    )
}

export default React.memo(CheckboxInput)

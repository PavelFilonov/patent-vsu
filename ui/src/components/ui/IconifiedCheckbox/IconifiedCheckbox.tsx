import React from 'react'
import cn from 'classnames'
import styles from './IconifiedCheckbox.less'
import IconField from '../IconField/IconField'

interface IconifiedCheckboxProps {
    selected: boolean
    className?: string
    iconType: string
    value: string
    disabled?: boolean
    onChange: (v: string) => void
}

const IconifiedCheckbox: React.FunctionComponent<IconifiedCheckboxProps> = props => {
    const {selected, value, onChange, className, iconType, disabled} = props
    const handleChange = React.useCallback(() => {
        if (!disabled) {
            onChange(value)
        }
    }, [onChange, value, disabled])
    return (
        <div
            className={cn(
                {
                    [styles.selectedContainer]: selected
                },
                className
            )}
        >
            <label
                className={cn(styles.checkbox, {
                    [styles.disabled]: disabled,
                    [styles.selected]: selected
                })}
            >
                <input checked={selected ?? false} onChange={handleChange} type="checkbox" className={styles.input} />
                <IconField name={value} type={iconType} />
            </label>
        </div>
    )
}

export default React.memo(IconifiedCheckbox)

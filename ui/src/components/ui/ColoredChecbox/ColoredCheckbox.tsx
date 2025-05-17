import React from 'react'
import cn from 'classnames'
import styles from './ColoredCheckbox.less'

interface ColoredCheckboxProps {
    selected: boolean
    className?: string
    value: string
    backgroundColor?: string
    onChange: (v: string) => void
    type?: 'remoteAudit'
}
const ColoredCheckbox: React.FunctionComponent<ColoredCheckboxProps> = props => {
    const {type, selected, value, backgroundColor, onChange, className} = props
    const handleChange = React.useCallback(() => onChange(value), [onChange, value])
    return (
        <label className={cn(styles.checkbox, type && styles[type], className)}>
            <input checked={selected ?? false} onChange={handleChange} type="checkbox" />
            <span className={styles.container}>
                <span className={styles.content} style={{backgroundColor}}>
                    {value}
                </span>
            </span>
        </label>
    )
}

export default React.memo(ColoredCheckbox)

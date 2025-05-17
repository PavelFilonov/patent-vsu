import React from 'react'
import cn from 'classnames'
import styles from './IconField.less'
import {getIconSrcByType} from '../../../utils/getIconSrcByType'
import {SmIconType} from '../../../interfaces/widget'

interface IconFieldProps {
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onFocus?: () => void
    onClick?: () => void
    type: SmIconType
    name: string
    className?: string
}
const IconField: React.FunctionComponent<IconFieldProps> = props => {
    const {type, name, className, onMouseLeave, onFocus, onClick, onMouseEnter} = props
    const iconSrc = getIconSrcByType(name, type)
    const icon = !iconSrc || iconSrc === name ? name : <img className={styles.wrapper} src={iconSrc} alt={name} title={name} />
    const handleKeyUp = React.useCallback(
        (e: React.KeyboardEvent<HTMLSpanElement>) => {
            if (e.keyCode === 32) {
                onClick()
            }
        },
        [onClick]
    )
    return (
        <span
            tabIndex={0}
            onKeyUp={handleKeyUp}
            role="button"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onClick={onClick}
            className={cn(styles.wrapper, className)}
        >
            {icon}
        </span>
    )
}

export default React.memo(IconField)

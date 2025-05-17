import React from 'react'
import cn from 'classnames'
import {Button, Icon} from 'antd'
import {ThemeType} from 'antd/lib/icon'
import styles from './SimpleControlLink.less'

interface SimpleControlLinkProps {
    className?: string
    onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    iconType?: string
    theme?: ThemeType
    label: string
}

const SimpleControlLink: React.FunctionComponent<SimpleControlLinkProps> = props => {
    const {className, onClick, iconType, theme, label} = props
    return (
        <div className={cn(styles.controlLinkWrapper, className)}>
            <Button onClick={onClick} type="link">
                {iconType && <Icon type={iconType} theme={theme || 'filled'} />}
                {label}
            </Button>
        </div>
    )
}
export default React.memo(SimpleControlLink)

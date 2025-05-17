import React from 'react'
import cn from 'classnames'
import {Icon as AntdIcon} from 'antd'
import {IconProps as AntdIconProps} from 'antd/lib/icon'
import styles from './Icon.less'
import iconComponents from '../../iconsComponents'

export interface IconProps extends AntdIconProps {
    className?: string
    type: keyof typeof iconComponents
}

function Icon({type, className, ...rest}: IconProps) {
    const Component = iconComponents[type]
    return <AntdIcon className={cn(styles.root, className)} component={Component} {...rest} />
}

export default React.memo(Icon)

import React from 'react'
import {Button as AntdButton} from 'antd'
import {ButtonProps as AntdButtonProps} from 'antd/lib/button'
import cn from 'classnames'
import styles from './Button.less'

const customTypes = {
    raPrimary: 'raPrimary',
    raLink: 'raLink',
    saDefaultBlue: 'saDefaultBlue',
    saDefaultGray: 'saDefaultGray'
}

type CustomTypes = keyof typeof customTypes
type DefaultTypes = AntdButtonProps['type']
type ButtonsTypes = DefaultTypes | CustomTypes

interface ButtonProps extends Omit<AntdButtonProps, 'type'> {
    type?: ButtonsTypes
    letterCase?: 'upper'
    strong?: boolean
}

function Button({type, className, letterCase, strong, ...restProps}: ButtonProps) {
    const classNames = cn(styles.root, className, type && styles[type], letterCase && styles[letterCase], strong && styles.strong)
    const normalizedType = normalizeButtonType(type)

    return <AntdButton className={classNames} type={normalizedType} {...restProps} />
}

export default Button

function isCustomType(type: string) {
    return !!(customTypes as Record<string, string>)[type]
}

function normalizeButtonType(type?: ButtonsTypes): DefaultTypes | undefined {
    if (!isCustomType(type)) {
        return type as DefaultTypes
    }

    if (customTypes.raPrimary === type) {
        return 'primary'
    }

    if (customTypes.raLink === type) {
        return 'link'
    }

    if (customTypes.saDefaultBlue === type || customTypes.saDefaultGray === type) {
        return 'default'
    }

    return undefined
}

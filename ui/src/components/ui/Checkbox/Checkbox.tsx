import React from 'react'
import {CheckboxProps as AntdCheckboxProps} from 'antd/lib/checkbox'
import {Checkbox as AntdCheckbox} from 'antd'
import cn from 'classnames'
import styles from './Checkbox.less'

export interface CheckboxProps extends AntdCheckboxProps {
    type?: 'round'
}

function Checkbox({type, className, ...otherProps}: CheckboxProps) {
    return <AntdCheckbox className={cn(className, type && styles[type])} {...otherProps} />
}

export default React.memo(Checkbox)

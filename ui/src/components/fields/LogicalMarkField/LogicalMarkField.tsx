import React, {FunctionComponent} from 'react'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import Icon, {IconProps} from '../../ui/Icon/Icon'
import {LogicalMarkFieldMeta} from '../../../interfaces/widget'

export interface LogicalMarkFieldProps {
    meta: LogicalMarkFieldMeta
    value: DataValue
}

export const LogicalMarkField: FunctionComponent<LogicalMarkFieldProps> = props => {
    const {meta, value} = props
    const {iconType, iconColor} = meta

    return value ? <Icon key={meta.key} style={{color: iconColor}} type={iconType as IconProps['type']} /> : null
}

export default LogicalMarkField

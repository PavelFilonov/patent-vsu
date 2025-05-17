import React, {FunctionComponent} from 'react'
import {message} from 'antd'
import copy from 'copy-to-clipboard'
import {ActionLink, useTranslation} from '@tesler-ui/core'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import {WidgetFieldBase} from '@tesler-ui/core/interfaces/widget'

export interface CopyableTextFieldProps {
    meta: WidgetFieldBase
    className?: string
    value: DataValue
}

export const CopyableTextField: FunctionComponent<CopyableTextFieldProps> = props => {
    const {meta, value, className} = props
    const {t} = useTranslation()

    return value ? (
        <ActionLink
            key={meta.key}
            className={className}
            onClick={() => {
                copy(value as string)
                message.success(t('Copied'))
            }}
        >
            {meta.label}
        </ActionLink>
    ) : null
}

export default CopyableTextField

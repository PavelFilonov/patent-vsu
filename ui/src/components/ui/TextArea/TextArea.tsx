import React from 'react'
import {TextArea as CoreTextArea} from '@tesler-ui/core'
import {TextAreaProps as CoreTextAreaProps} from '@tesler-ui/core/components/ui/TextArea/TextArea'

interface TextAreaProps extends CoreTextAreaProps {
    customProps?: any
}
export function TextArea(props: TextAreaProps) {
    const {onBlur, value, customProps, ...rest} = props
    return <CoreTextArea {...rest} minRows={1} defaultValue={value as string} />
}

export default TextArea

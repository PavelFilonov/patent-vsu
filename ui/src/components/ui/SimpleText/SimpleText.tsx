import React from 'react'

interface SimpleTextProps {
    text?: string
    className?: string
}
const SimpleText: React.FunctionComponent<SimpleTextProps> = props => {
    const {text, className} = props
    return <div className={className}>{text}</div>
}

export default React.memo(SimpleText)

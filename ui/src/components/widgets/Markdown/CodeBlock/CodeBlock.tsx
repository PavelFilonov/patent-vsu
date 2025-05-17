import React from 'react'
import {tomorrow, monoBlue} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'

interface CodeBlockProps {
    language: string
    value: string
}

export default function CodeBlock(props: CodeBlockProps) {
    const {language, value} = props
    const switchStyle = (codeLanguage: string) => {
        switch (codeLanguage) {
            case 'js':
                return tomorrow
            default:
                return monoBlue
        }
    }

    return (
        <SyntaxHighlighter language={language || 'javascript'} style={switchStyle(language)}>
            {value}
        </SyntaxHighlighter>
    )
}

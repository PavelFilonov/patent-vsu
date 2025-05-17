import React from 'react'
import styles from './ItalicStartParagraph.less'

interface ItalicStartParagraphProps {
    startText: string
    restText: string
}

const ItalicStartParagraph: React.FunctionComponent<ItalicStartParagraphProps> = props => {
    const {startText, restText} = props
    if (!startText || !restText) {
        return null
    }

    return (
        <div className={styles.container}>
            <span className={styles.startText}>{startText}</span>: {restText}
        </div>
    )
}

export default React.memo(ItalicStartParagraph)

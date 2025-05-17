import React, {useCallback} from 'react'
import ReactMarkdown from 'react-markdown'
import {historyObj, useTranslation} from '@tesler-ui/core'
import styles from './Markdown.less'
import CodeBlock from './CodeBlock/CodeBlock'
import {SmWidgetMeta} from '../../../interfaces/widget'
import Button from '../../ui/Button/Button'

const DEFAULT_LANGUAGE = 'en'

interface MarkdownProps {
    meta: SmWidgetMeta
}

function Markdown({meta: {description, descriptionDictionary}}: MarkdownProps) {
    const {i18n, t} = useTranslation()
    const currentDescription = descriptionDictionary
        ? descriptionDictionary[i18n.language] || descriptionDictionary[DEFAULT_LANGUAGE]
        : description

    const handleClick = useCallback(() => {
        historyObj.go(-1)
    }, [])

    return description ? (
        <div className={styles.markdown}>
            <Button onClick={handleClick} type="link" className={styles.backButton}>
                ← {t('Back')}
            </Button>
            <ReactMarkdown source={currentDescription} escapeHtml={false} renderers={{code: CodeBlock}} />
        </div>
    ) : null
}

export default React.memo(Markdown)

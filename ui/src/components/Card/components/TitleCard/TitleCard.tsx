import React, {useCallback} from 'react'
import {changeLocation, TemplatedTitle, useTranslation} from '@tesler-ui/core'
import {Icon} from 'antd'
import cn from 'classnames'
import {SmWidgetTypes} from '../../../../interfaces/widget'
import styles from './TitleCard.less'
import PopUpHints from '../../../ui/PopUpHints/PopUpHints'
import Button from '../../../ui/Button/Button'

export interface TitleCardProps {
    nameWidget: string
    title: string
    typeWidget: string
    isCollapsed: boolean
    updateCollapse: () => void
    className?: string
    hints?: string[]
    helpUrl?: string
    helpLabel?: string
}

export function TitleCard(props: TitleCardProps) {
    const {nameWidget, title, typeWidget, isCollapsed, updateCollapse, className, hints, helpUrl, helpLabel = 'Help'} = props
    const {t} = useTranslation()
    const allowCollapse = typeWidget !== SmWidgetTypes.Header && typeWidget === SmWidgetTypes.Info
    const hasIcon = allowCollapse && title
    const hasHelpButton = !!helpUrl

    const handleHelpButtonClick = useCallback(() => {
        changeLocation(helpUrl)
    }, [helpUrl])

    if (nameWidget === 'optionList') {
        return (
            <div className={styles.middleTitle}>
                <TemplatedTitle widgetName={nameWidget} title={title} />
            </div>
        )
    }
    const translatedTitle = t(title)
    return (
        title && (
            <h2
                className={cn(
                    styles.title,
                    {
                        [styles.smHeader]: typeWidget !== SmWidgetTypes.Header && typeWidget !== SmWidgetTypes.SecondHeader,
                        [styles.bigHeader]: typeWidget === SmWidgetTypes.Header,
                        [styles.secondHeader]: typeWidget === SmWidgetTypes.SecondHeader
                    },
                    className
                )}
            >
                <div className={styles.popUpContainer}>
                    <TemplatedTitle widgetName={nameWidget} title={translatedTitle} />
                    <PopUpHints divClassName={styles.hintW} iconClassName={styles.questionIcon} placement="bottomLeft" hints={hints} />
                    {hasIcon && (
                        <Icon className={styles.titleIcon} type={isCollapsed ? 'down-circle' : 'up-circle'} onClick={updateCollapse} />
                    )}
                    {hasHelpButton && (
                        <Button type="saDefaultBlue" className={styles.helpButton} onClick={handleHelpButtonClick}>
                            <Icon className={styles.hint} type="question-circle" /> {t(helpLabel)}
                        </Button>
                    )}
                </div>
            </h2>
        )
    )
}

export default React.memo(TitleCard)

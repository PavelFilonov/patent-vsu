import React from 'react'
import {Tooltip} from 'antd'
import {useTranslation} from '@tesler-ui/core'
import styles from '../ScreenNavigation.less'

interface SmMenuItemProps {
    title: string
}

function getTooltipTitle(t: string) {
    switch (t) {
        case 'GoS':
            return 'Group Of Standards'
        case 'GoST':
            return 'Group Of Standard Templates'
        case 'GoS Snapshots':
            return 'Group Of Standard Snapshots'
        case 'GoST Snapshots':
            return 'Group Of Standard Template Snapshots'
        default:
            return t
    }
}

const SmMenuItemContent: React.FunctionComponent<SmMenuItemProps> = props => {
    const {title} = props
    const tooltipTitle = getTooltipTitle(title)
    const {t} = useTranslation()

    return (
        <Tooltip placement="right" title={t(tooltipTitle)}>
            <span className={styles.ml20}>{t(title)}</span>
        </Tooltip>
    )
}

export default React.memo(SmMenuItemContent)

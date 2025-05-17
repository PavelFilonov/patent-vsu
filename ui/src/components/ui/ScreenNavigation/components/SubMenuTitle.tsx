import React from 'react'
import {Icon} from 'antd'
import {SessionScreen} from '@tesler-ui/core/interfaces/session'
import {useTranslation} from '@tesler-ui/core'
import styles from '../ScreenNavigation.less'

interface SubMenuTitleProps {
    menuVisible: boolean
    screen: SessionScreen
}

const SubMenuTitle: React.FunctionComponent<SubMenuTitleProps> = props => {
    const {menuVisible, screen} = props
    const {t} = useTranslation()

    return (
        <span className={styles.MenuItemLink}>
            <Icon className={styles.icon} type={screen.icon ?? 'coffee'} />
            <span>{t(screen.text)}</span>
            {menuVisible && screen.notification && <div className={styles.Notification}>{screen.notification}</div>}
        </span>
    )
}
export default React.memo(SubMenuTitle)

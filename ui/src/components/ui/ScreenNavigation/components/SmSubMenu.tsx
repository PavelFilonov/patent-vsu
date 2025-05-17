import React from 'react'
import {Menu} from 'antd'
import {SessionScreen} from '@tesler-ui/core/interfaces/session'
import {ViewMetaResponse} from '@tesler-ui/core/interfaces/view'
import cn from 'classnames'
import SubMenuTitle from './SubMenuTitle'
import styles from '../ScreenNavigation.less'
import SmMenuItemContent from './SmMenuItemContent'

interface SmSubMenuProps {
    screen: SessionScreen
    menuVisible: boolean
    viewList: ViewMetaResponse[]
}

export const SmSubMenu: React.FunctionComponent<SmSubMenuProps> = props => {
    const {SubMenu} = Menu
    const {screen, menuVisible, viewList, ...rest} = props

    if (viewList.length === 1) {
        const [view] = viewList
        const menuItemProps = {...rest, eventKey: view.name}

        return (
            <Menu.Item {...menuItemProps} key={view.name} className={cn(styles.SubItem, styles.OneItem)}>
                <SubMenuTitle screen={screen} menuVisible={menuVisible} />
            </Menu.Item>
        )
    }

    return (
        <SubMenu key={screen.url} title={<SubMenuTitle screen={screen} menuVisible={menuVisible} />} {...rest}>
            {viewList.map(view => {
                return (
                    <Menu.Item key={view.name} className={styles.SubItem}>
                        <SmMenuItemContent title={view.title} />
                    </Menu.Item>
                )
            })}
        </SubMenu>
    )
}

export default React.memo(SmSubMenu)

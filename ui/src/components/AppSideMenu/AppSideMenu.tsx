import React from 'react'
import {connect} from '@tesler-ui/core'
import {SessionScreen} from '@tesler-ui/core/interfaces/session'
import {Dispatch} from 'redux'
import {ViewMetaResponse} from '@tesler-ui/core/interfaces/view'
import {setMenuVisible} from '../../actions/actions'
import ScreenNavigation from '../ui/ScreenNavigation/ScreenNavigation'
import {AppState} from '../../interfaces/reducers'
import styles from './AppSideMenu.less'
import Logo from './components/Logo'

interface AppSideMenuOwnProps {
    isProd: boolean
}
export interface AppSideMenuProps extends AppSideMenuOwnProps {
    selectedView: ViewMetaResponse
    screenUrl: string
    sessionScreens: SessionScreen[]
    menuVisible: boolean
    onMenuVisible: (menuVisible: boolean) => void
}

const AppSideMenu: React.FunctionComponent<AppSideMenuProps> = props => {
    const {selectedView, screenUrl, sessionScreens, isProd} = props

    return (
        <div className={styles.menuContainer}>
            <div className={styles.menuWrapper}>
                <div className={styles.logoContainer} role="button" tabIndex={0}>
                    <Logo />
                </div>
                <div className={styles.navigation}>
                    <ScreenNavigation items={sessionScreens} selectedScreen={screenUrl} selectedView={selectedView} isProd={isProd} />
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(store: AppState) {
    const selectedScreen =
        store.session.screens.find(item => item.name === store.router.screenName) ??
        (store.session.screens.find((screen: SessionScreen) => screen.defaultScreen) || store.session.screens[0])
    const selectedView = store.view
    const screenUrl = (selectedScreen && selectedScreen.url) || `/screen/${store.router.screenName}`
    return {
        selectedView,
        screenUrl,
        sessionScreens: store.session.screens,
        menuVisible: store.screen.menuVisible
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onMenuVisible: (menuVisible: boolean) => {
            dispatch(setMenuVisible(menuVisible))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSideMenu)

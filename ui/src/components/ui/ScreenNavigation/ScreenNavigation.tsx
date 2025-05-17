import React from 'react'
import {useDispatch} from 'react-redux'
import {Menu} from 'antd'
import cn from 'classnames'
import {SelectParam} from 'antd/es/menu'
import {changeLocation, connect, isViewNavigationItem} from '@tesler-ui/core'
import {SessionScreen} from '@tesler-ui/core/interfaces/session'
import {ViewMetaResponse} from '@tesler-ui/core/interfaces/view'
import {ViewNavigationCategory, ViewNavigationItem} from '@tesler-ui/core/interfaces/navigation'
import {TeslerScreenResponse, ViewNavigationGroup} from '../../../interfaces/navigation'
import {AppState} from '../../../interfaces/reducers'
import styles from './ScreenNavigation.less'
import SmSubMenu from './components/SmSubMenu'
import {setPopupWithInputValue} from '../../../actions/actions'

export interface ScreenNavigationProps {
    isProd: boolean
    items: SessionScreen[]
    selectedScreen: string
    selectedView: ViewMetaResponse
    menuVisible: boolean
    views: ViewMetaResponse[]
    screenMenu: ViewNavigationGroup[]
}

function getDefaultCategoryView(node: ViewNavigationGroup | ViewNavigationCategory): string {
    if (node.child && node.child[0]) {
        const firstDescendant = node.child[0]
        if (isViewNavigationItem(firstDescendant)) {
            return firstDescendant.viewName
        }
        return getDefaultCategoryView(firstDescendant as ViewNavigationCategory)
    }
    return undefined
}

const getSelectedViewParent = (selectedScreenName: string, selectedViewName: string, screens: SessionScreen[]) => {
    const selectedScreen = screens.find(screen => screen.url === selectedScreenName)

    const topLevelViews = selectedScreen?.meta.navigation.menu

    const viewParent = topLevelViews?.find(menuItem => {
        if ((menuItem as ViewNavigationGroup).child) {
            return (menuItem as ViewNavigationGroup).child.some(child => child.viewName === selectedViewName)
        }

        if ((menuItem as ViewNavigationItem).viewName === selectedViewName) {
            return true
        }
        return false
    })

    const viewName = (viewParent as ViewNavigationItem)?.viewName

    if (!viewName) {
        return viewParent ? getDefaultCategoryView(viewParent as ViewNavigationGroup) : ''
    }

    return viewName
}

const emptyScreens: SessionScreen[] = []

export function ScreenNavigation(props: ScreenNavigationProps) {
    const {items, menuVisible, selectedScreen, selectedView, views, isProd} = props
    const screens: SessionScreen[] = items || emptyScreens
    const [currentSelectedView, setCurrentSelectedView] = React.useState(getSelectedViewParent(selectedScreen, selectedView.name, screens))
    const dispatch = useDispatch()
    const handleScreen = React.useCallback(
        (e: SelectParam) => {
            let viewUrl = views.find(view => view.name === e.key)?.url

            if (!viewUrl) {
                screens.find(screen => {
                    const view = screen.meta.views.find(screenView => screenView.name === e.key)
                    if (view) {
                        viewUrl = view.url
                        return true
                    }
                    if (screen.url.startsWith('http')) {
                        window.open(screen.url)
                        return false
                    }
                    return false
                })
            }

            changeLocation(viewUrl)
            setCurrentSelectedView(e.key)
            dispatch(setPopupWithInputValue(null))
        },
        [setCurrentSelectedView, views, screens]
    )

    React.useEffect(() => {
        setCurrentSelectedView(getSelectedViewParent(selectedScreen, selectedView.name, screens))
    }, [setCurrentSelectedView, selectedView, screens, selectedScreen])

    return (
        <Menu
            inlineIndent={19}
            className={cn(styles.Container, {
                [styles.devNavigation]: !isProd
            })}
            defaultOpenKeys={[selectedScreen]}
            selectedKeys={[currentSelectedView]}
            onClick={handleScreen}
            theme="dark"
            mode="inline"
        >
            {screens.map(screen => {
                const firstLevelViews: ViewMetaResponse[] = (screen.meta as TeslerScreenResponse).navigation.menu
                    .map(node => {
                        const viewName = getDefaultCategoryView(node)
                        const matchingView = screen.meta.views.find(view => view.name === viewName)
                        return matchingView ? {...matchingView, title: node.title} : null
                    })
                    .filter(node => !!node)

                // just render views
                if (firstLevelViews.length === 0) {
                    return <SmSubMenu key={screen.url} menuVisible={menuVisible} screen={screen} viewList={screen.meta.views} />
                }
                // render non grouped views after group
                if (firstLevelViews.length >= 1) {
                    const ungroupedViewsNames = screen.meta.navigation.menu
                        .filter(v => !Object.keys(v).includes('child'))
                        .map(v => (v as ViewNavigationItem).viewName)
                    const ungroupedViews = screen.meta.views.filter(v => ungroupedViewsNames.includes(v.name))

                    return (
                        <SmSubMenu
                            key={screen.url}
                            menuVisible={menuVisible}
                            screen={screen}
                            viewList={[...firstLevelViews, ...ungroupedViews]}
                        />
                    )
                }
                // render groups of views
                return <SmSubMenu key={screen.url} menuVisible={menuVisible} screen={screen} viewList={firstLevelViews} />
            })}
        </Menu>
    )
}

function mapStateToProps(store: AppState) {
    const sessionScreen = store.session.screens.find(screen => screen.name === store.screen.screenName)
    const teslerScreenMeta = sessionScreen?.meta as TeslerScreenResponse
    return {
        menuVisible: store.screen.menuVisible,
        screenMenu: teslerScreenMeta?.navigation.menu,
        views: store.screen.views
    }
}

export default connect(mapStateToProps)(ScreenNavigation)

import React, {FunctionComponent} from 'react'
import {connect} from '@tesler-ui/core'
import {ViewMetaResponse} from '@tesler-ui/core/interfaces/view'
import {MenuItem} from '@tesler-ui/core/interfaces/navigation'
import {WidgetMeta} from '@tesler-ui/core/interfaces/widget'
import {SecondLevelTabs} from '../../ui/SecondLevelTabs/SecondLevelTabs'
import {TeslerScreenResponse} from '../../../interfaces/navigation'
import {AppState} from '../../../interfaces/reducers'

export interface NavigationWidgetOwnProps {
    meta: WidgetMeta
}

export interface NavigationWidgetProps extends NavigationWidgetOwnProps {
    views: ViewMetaResponse[]
    activeView: string
    navigationMenu: MenuItem[]
    bcPath: string
}

export const NavigationWidget: FunctionComponent<NavigationWidgetProps> = props => {
    const {views, activeView, navigationMenu, bcPath} = props
    return <SecondLevelTabs activeView={activeView} views={views} navigationMenu={navigationMenu} bcPath={bcPath} navigationLevel={null} />
}

function mapStateToProps(store: AppState) {
    const sessionScreen = store.session.screens.find(screen => screen.name === store.screen.screenName)
    const teslerScreenMeta = sessionScreen && (sessionScreen.meta as TeslerScreenResponse)
    return {
        bcPath: store.router.bcPath,
        views: store.screen.views,
        activeView: store.view.url,
        navigationMenu: teslerScreenMeta && teslerScreenMeta.navigation.menu
    }
}

export default connect(mapStateToProps)(NavigationWidget)

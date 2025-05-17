import React, {CSSProperties} from 'react'
import {Row} from 'antd'
import {connect} from '@tesler-ui/core'
import {ViewMetaResponse} from '@tesler-ui/core/interfaces/view'
import {WidgetMeta, WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import {MenuItem} from '@tesler-ui/core/interfaces/navigation'
import {SecondLevelTabs} from '../ui/SecondLevelTabs/SecondLevelTabs'
import {TeslerScreenResponse} from '../../interfaces/navigation'
import {AppState} from '../../interfaces/reducers'
import styles from './ViewHeader.less'

interface ViewHeaderProps {
    views: ViewMetaResponse[]
    activeView: string
    widgets: WidgetMeta[]
    navigationMenu: MenuItem[]
    bcPath: string
    headerWidth: CSSProperties
}

export function ViewHeader(props: ViewHeaderProps) {
    const {views, activeView, widgets, navigationMenu, bcPath, headerWidth} = props
    const showSecondMenu = !!(widgets || []).find(v => v.type === WidgetTypes.SecondLevelMenu)

    return (
        <>
            <Row className={styles.headerContainer} type="flex" justify="center">
                <div className={styles.headerWrapper}>
                    <div className={styles.tabs} style={headerWidth}>
                        {showSecondMenu && (
                            <SecondLevelTabs activeView={activeView} views={views} navigationMenu={navigationMenu} bcPath={bcPath} />
                        )}
                    </div>
                </div>
            </Row>
        </>
    )
}

function mapStateToProps(store: AppState) {
    const sessionScreen = store.session.screens.find(screen => screen.name === store.screen.screenName)
    const teslerScreenMeta = sessionScreen && (sessionScreen.meta as TeslerScreenResponse)
    return {
        bcPath: store.router.bcPath,
        views: store.screen.views,
        activeView: store.view.url,
        widgets: store.view.widgets,
        navigationMenu: teslerScreenMeta && teslerScreenMeta.navigation.menu
    }
}

export default connect(mapStateToProps)(ViewHeader)

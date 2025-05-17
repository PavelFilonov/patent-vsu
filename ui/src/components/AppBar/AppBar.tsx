import React, {CSSProperties} from 'react'
import {connect} from 'react-redux'
import {Popover, Row} from 'antd'
import cn from 'classnames'
import {Dispatch} from 'redux'
import {TeslerScreenResponse} from '../../interfaces/navigation'
import styles from './AppBar.less'
import {AppState} from '../../interfaces/reducers'
import UserMenu from './components/UserMenu'
import {$smDo} from '../../actions/actions'

interface AppBarProps {
    headerWidth: CSSProperties
    firstName: string
    lastName: string
    debugMode: boolean
    onSwitchMode: (on: boolean) => void
}

export function AppBar(props: AppBarProps) {
    const {headerWidth, firstName, lastName, debugMode, onSwitchMode} = props
    const [menuOpen, setMenuOpen] = React.useState(false)

    const userName = `${firstName} ${lastName}`
    const handleVisibleChange = (open: boolean) => setMenuOpen(open)
    let debugHandlerTimeOut: number
    const debugHandlerDown = () => {
        debugHandlerTimeOut = (setTimeout(() => onSwitchMode(!debugMode), 5000) as unknown) as number
    }
    const debugHandlerUp = () => {
        if (debugHandlerTimeOut) {
            clearTimeout(debugHandlerTimeOut)
        }
    }
    return (
        <Row className={styles.headerContainer} type="flex" justify="center">
            <div className={styles.container} style={headerWidth} />
            <div className={styles.controls} onMouseDown={debugHandlerDown} onMouseUp={debugHandlerUp} role="button" tabIndex={0}>
                <Popover
                    visible={menuOpen}
                    overlayClassName={styles.userInfoPopover}
                    trigger="click"
                    onVisibleChange={handleVisibleChange}
                    placement="bottomRight"
                    content={<UserMenu userName={userName} />}
                >
                    <span
                        className={cn(styles.userName, {
                            [styles.arrowDown]: !menuOpen,
                            [styles.arrowUp]: menuOpen
                        })}
                    >
                        {userName}
                    </span>
                </Popover>
            </div>
        </Row>
    )
}

function mapStateToProps(state: AppState) {
    const sessionScreen = state.session.screens.find(screen => screen.name === state.screen.screenName)
    const teslerScreenMeta = sessionScreen && (sessionScreen.meta as TeslerScreenResponse)
    return {
        debugMode: state.session.debugMode,
        screenName: state.screen.screenName,
        menu: teslerScreenMeta && teslerScreenMeta.navigation.menu,
        views: state.screen.views,
        activeView: state.view.url,
        firstName: state.session.firstName,
        lastName: state.session.lastName
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onSwitchMode: (on: boolean) => {
            dispatch($smDo.switchDebugMode(on))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBar)

import React from 'react'
import {Dispatch} from 'redux'
// eslint-disable-next-line import/no-unresolved
import {$do, connect, useTranslation} from '@tesler-ui/core'
import {Button, Divider} from 'antd'
import cn from 'classnames'
// eslint-disable-next-line import/no-unresolved
import {UserRole} from '@tesler-ui/core/interfaces/session'
import {AppState} from '../../../interfaces/reducers'
import styles from './UserMenu.less'
import {$smDo} from '../../../actions/actions'

interface UserMenuOwnProps {
    userName: string
}
interface UserMenuProps extends UserMenuOwnProps {
    activeRole: string
    roles: UserRole[]
    login: string
    onLogout: () => void
    onSelectRole: (value: string) => void
}

function roleComparator(a: UserRole, b: UserRole) {
    if (a.value > b.value) {
        return 1
    }
    if (a.value < b.value) {
        return -1
    }
    return 0
}

const UserMenu: React.FunctionComponent<UserMenuProps> = props => {
    const {userName, activeRole, roles, login, onLogout, onSelectRole} = props
    const {t} = useTranslation()
    const sortedRoles = React.useMemo(() => roles.sort(roleComparator), [roles])

    return (
        <div className={cn(styles.menuContainer)}>
            <div className={cn(styles.loginContainer)}>
                <span className={styles.fullName}>{userName}</span>
                <span className={styles.login}>{login}</span>
            </div>
            <Divider />
            <div className={cn(styles.mb4, styles.mt2)}>
                {sortedRoles.map(i => {
                    const handleClick = () => onSelectRole(i.key)
                    return (
                        <div
                            className={cn(styles.roleBtnWrapper, {
                                [styles.checked]: i.key === activeRole
                            })}
                            key={i.key}
                        >
                            <Button onClick={handleClick}>{i.value}</Button>
                        </div>
                    )
                })}
            </div>
            <Divider />
            <div className={cn(styles.signOutContainer)}>
                <Button type="link" onClick={onLogout}>
                    <span className={styles.signOutBtn}>{t('Выйти')}</span>
                </Button>
            </div>
        </div>
    )
}

function mapStateToProps(state: AppState) {
    return {
        activeRole: state.session.activeRole,
        roles: state.session.roles,
        login: state.session.login
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onSelectRole: (value: string) => {
            dispatch($smDo.switchRole({role: value}))
        },
        onLogout: () => {
            dispatch($do.logout(null))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)

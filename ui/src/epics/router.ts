import {CustomEpicSlice} from '@tesler-ui/core/interfaces/customEpics'
import {coreActions} from '@tesler-ui/core'
import i18n from 'i18next'
import {notification} from 'antd'
import {Observable} from 'rxjs'
import {SmEpic} from '../actions/actions'

const selectScreenFail: SmEpic = (action$, store) =>
    action$.ofType(coreActions.selectScreenFail).mergeMap(action => {
        const state = store.getState()
        const currentRoleKey = state.session.activeRole
        notification.error({
            message: i18n.t('Screen is missing or unavailable for your role', {
                role: state.session.roles.find(i => i.key === currentRoleKey)?.value ?? ''
            }),
            duration: 15
        })
        return Observable.empty()
    })

export const routerEpics: CustomEpicSlice<'routerEpics'> = {
    selectScreenFail
}

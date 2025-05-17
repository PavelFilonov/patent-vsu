import {Store} from '@tesler-ui/core/interfaces/store'
import {VsuScreenState} from './screen'
import {SmViewState} from './view'
import {TeslerSessionState as VsuSessionState} from './session'

export interface AppReducers extends Partial<Store> {
    screen: VsuScreenState
    view: SmViewState
    session: VsuSessionState
}

export type AppState = Store & AppReducers

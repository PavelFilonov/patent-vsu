import {sessionEpics} from './session'
import {dataEpics} from './data'
import {viewEpics} from './view'
import {screenEpics} from './screen'
import {routerEpics} from './router'

export const epics = {
    screenEpics,
    viewEpics,
    sessionEpics,
    routerEpics,
    dataEpics
}

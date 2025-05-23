/**
 * Enumeration of reducers which are parts of app's store
 */

import screenReducer, {initialState as screenInitialState} from './screen'
import dataReducer, {initialState as dataInitialState} from './data'
import viewReducer, {initialState as viewInitialState} from './view'
import sessionReducer, {initialState as sessionInitialState} from './session'
import {TeslerClientReducersMapObject} from '../interfaces/store'
import {AppReducers} from '../interfaces/reducers'

export const reducers: TeslerClientReducersMapObject<AppReducers, any> = {
    screen: {
        initialState: screenInitialState,
        reducer: screenReducer
    },
    data: {
        initialState: dataInitialState,
        reducer: dataReducer
    },
    view: {
        initialState: viewInitialState,
        reducer: viewReducer
    },
    session: {
        initialState: sessionInitialState,
        reducer: sessionReducer
    }
}

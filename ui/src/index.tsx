import './imports/shim'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from '@tesler-ui/core'
import {ConfigProvider} from 'antd'
import enUs from 'antd/es/locale-provider/en_US'
import {epics} from './epics'
import {reducers} from './reducers'
import Layout from './components/AppLayout/AppLayout'
import {axiosInstance} from './api/session'
import './antd.less'
import './imports/rxjs'
import {middlewares} from './middlewares'
import smLanguageResources from './assets/i18n'
import {initLocale} from './imports/i18n'
import {getLocale, lang} from './locale'
import configureNotifications from './utils/configureNotifications'
import {customWidgets} from './components/customWidgets'

initLocale(lang || 'en', smLanguageResources)

configureNotifications()

const App = (
    <Provider
        customMiddlewares={middlewares}
        customReducers={reducers}
        customEpics={epics}
        customWidgets={customWidgets}
        axiosInstance={axiosInstance}
        langDictionary={smLanguageResources}
        lang={getLocale()}
    >
        <ConfigProvider locale={enUs}>
            <Layout />
        </ConfigProvider>
    </Provider>
)

render(App, document.getElementById('root'))

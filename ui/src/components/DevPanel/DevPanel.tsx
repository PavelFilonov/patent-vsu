import React from 'react'
import {DevToolsPanel} from '@tesler-ui/core'
import {getOptions} from '../../app-options'
import {LOCAL_DEVELOPMENT} from '../../constants'
import styles from './DevPanel.less'

export const DevPanel: React.FunctionComponent = () => {
    const branchName = getOptions().branchName.toUpperCase()
    const showCondition = branchName === LOCAL_DEVELOPMENT
    return <>{showCondition && <DevToolsPanel className={styles.container} />}</>
}

export default React.memo(DevPanel)

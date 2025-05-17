import React from 'react'
import cn from 'classnames'
import {useSelector} from 'react-redux'
import {AppState} from '../../../interfaces/reducers'
import styles from './LoadingProgress.less'

const LoadingProgress: React.FunctionComponent = () => {
    const allBc = useSelector((store: AppState) => store.screen.bo.bc)
    const isLoading = Object.values(allBc).some(i => i.loading)

    return (
        <div>
            <div
                className={cn(styles.sabMenu, {
                    [styles.loading]: isLoading
                })}
            />
        </div>
    )
}

export default React.memo(LoadingProgress)

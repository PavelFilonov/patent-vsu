import React from 'react'
import cn from 'classnames'
import styles from './SmSpinReplacer.less'

interface SmSpinReplacerProps {
    spinning: boolean
}

const SmSpinReplacer: React.FunctionComponent<SmSpinReplacerProps> = props => {
    const {spinning, children} = props
    return <div className={cn({[styles.spinning]: spinning})}>{children}</div>
}

export default React.memo(SmSpinReplacer)

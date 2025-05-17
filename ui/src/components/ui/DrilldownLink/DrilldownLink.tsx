import React from 'react'
import cn from 'classnames'
import {ActionLink} from '@tesler-ui/core'
import styles from './DrilldownLink.less'

interface DrilldownLinkProps {
    className?: string
    onDrillDown?: () => void
    children: React.ReactNode
}

export const DrilldownLink: React.FunctionComponent<DrilldownLinkProps> = props => {
    const {className, onDrillDown, children} = props
    return onDrillDown ? (
        <ActionLink className={cn(styles.actionLink, className)} onClick={onDrillDown}>
            {children}
        </ActionLink>
    ) : (
        (children as React.ReactElement<DrilldownLinkProps>)
    )
}

export default React.memo(DrilldownLink)

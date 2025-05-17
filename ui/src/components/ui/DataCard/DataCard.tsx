import React from 'react'
import cn from 'classnames'
import styles from './DataCard.less'

interface DataCardProps {
    header?: React.ReactNode
    body?: React.ReactNode
    footer?: React.ReactNode
    active?: boolean
    className?: string
    onClick?: () => void
}
const DataCard: React.FunctionComponent<DataCardProps> = props => {
    const {header, body, footer, active, className, onClick} = props
    return (
        <div
            tabIndex={0}
            role="button"
            onKeyUp={onClick}
            onClick={onClick}
            className={cn(
                styles.dataCardContainer,
                {
                    [styles.active]: active
                },
                className
            )}
        >
            <div className={cn(styles.w100)}>{header}</div>
            <div className={cn(styles.w100)}>{body}</div>
            <div className={cn(styles.w100)}>{footer}</div>
        </div>
    )
}

export default React.memo(DataCard)

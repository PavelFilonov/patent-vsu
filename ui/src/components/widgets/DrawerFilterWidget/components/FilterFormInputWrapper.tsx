import React from 'react'
import cn from 'classnames'
import styles from './FilterFormInputWrapper.less'

export interface WrapperProps {
    skipTitle?: boolean
    title: string
    children: React.ReactNode
}

const FilterFormInputWrapper: React.FunctionComponent<WrapperProps> = props => {
    const {title, children, skipTitle} = props
    return (
        <div className={cn(styles.filterFormInputWrapper)}>
            {!skipTitle && <span className={styles.header}>{title}</span>}
            {children}
        </div>
    )
}

FilterFormInputWrapper.displayName = 'FilterFormInputWrapper'

export default React.memo(FilterFormInputWrapper)

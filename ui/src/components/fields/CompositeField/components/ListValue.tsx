import React, {FunctionComponent} from 'react'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import cn from 'classnames'
import styles from './ListValue.less'

export interface ListValueProps {
    value: MultivalueSingleValue[]
    ignoreHint?: boolean
    className?: string
    inPopover?: boolean
    boldTitle?: boolean
}

export const ListValue: FunctionComponent<ListValueProps> = props => {
    const {value, className, inPopover, boldTitle, ignoreHint} = props
    if (value.length === 0) {
        return null
    }
    return (
        <div className={styles.contentList}>
            {value.map(item => {
                return (
                    <div className={cn(styles.container, className)} key={item.id}>
                        <div className={cn({[styles.name]: boldTitle})}>{item.value}</div>
                        {item.options?.hint && !ignoreHint && (
                            <div
                                className={cn(styles.hint, {
                                    [styles.lineClamp]: !inPopover
                                })}
                            >
                                {item.options?.hint}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default React.memo(ListValue)

import React from 'react'
import {Popover} from 'antd'
import cn from 'classnames'
import {PopoverProps} from 'antd/lib/popover'
import styles from './PopUpHints.less'

export interface PopUpProps extends PopoverProps {
    hints?: string[]
    title?: string
    iconClassName?: string
    divClassName?: string
}

const PopUpHints = (props: PopUpProps) => {
    const {hints, iconClassName, title, divClassName, ...rest} = props
    if (!hints) {
        return null
    }
    return (
        <Popover
            {...rest}
            content={
                <div className={divClassName}>
                    {title && <h2 className={styles.hintHeader}>{title}</h2>}
                    {hints?.length > 0 &&
                        hints.map(i => {
                            return (
                                <p key={i} className={styles.hint}>
                                    {i}
                                </p>
                            )
                        })}
                </div>
            }
        >
            <div className={cn(styles.questionIcon, iconClassName)} />
        </Popover>
    )
}
export default React.memo(PopUpHints)

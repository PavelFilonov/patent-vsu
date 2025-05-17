import React from 'react'
import cn from 'classnames'
import dragIcon from './img/drag.svg'
import styles from './DragIcon.less'

type Props = {
    className?: string
}

const DragIcon: React.FC<Props> = ({className}) => {
    return <img src={dragIcon} alt="dragIcon" className={cn(styles.dragIcon, className)} />
}

export default DragIcon

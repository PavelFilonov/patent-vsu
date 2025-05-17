import React from 'react'
import cn from 'classnames'
import {Badge, Icon} from 'antd'
import {useTranslation} from '@tesler-ui/core'
import styles from './DrawerControlButton.less'
import FilterOutlinedIcon from './FilterOutlinedIcon'
import Button from '../../../ui/Button/Button'

interface DrawerControlButtonProps {
    openDrawer: () => void
    handleReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    filterLength: number
}

function DrawerControlButton({openDrawer, handleReset, filterLength}: DrawerControlButtonProps) {
    const {t} = useTranslation()
    const fillFilter = filterLength > 0

    return (
        <div className={cn(styles.filterButtonsBlock)}>
            <Button onClick={openDrawer} type="link" size="small" className={cn(styles.operation)}>
                <Icon className={styles.icon} component={FilterOutlinedIcon} />
                <span className={cn(styles.filterLabel)}>{t('Фильтры')}</span>
            </Button>
            {fillFilter && (
                <>
                    <Badge count={filterLength} />
                    <Icon onClick={handleReset} type="close" className={cn(styles.filterCloseIcon)} />
                </>
            )}
        </div>
    )
}

export default React.memo(DrawerControlButton)

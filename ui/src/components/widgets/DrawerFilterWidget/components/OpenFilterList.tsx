import React from 'react'
import {useTranslation} from '@tesler-ui/core'
import {Badge} from 'antd'
import {SmWidgetMeta} from '../../../../interfaces/widget'
import {FilterableField} from '../interfaces'
import OpenFilterItem from './OpenFilterItem'
import styles from './OpenFilterList.less'
import SimpleControlLink from '../../../ui/SimpleControlLink/SimpleControlLink'

interface OpenFilterListProps {
    filterFields: FilterableField[]
    meta: SmWidgetMeta
    filterLength: number
    onReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const OpenFilterList = ({filterFields, filterLength, onReset, meta}: OpenFilterListProps) => {
    const {t} = useTranslation()
    const showBottomBar = filterLength > 0

    return (
        <>
            {filterFields.map((field: FilterableField) => {
                const fieldMeta = meta.fields.find(item => item.key === field.key)
                return (
                    <OpenFilterItem
                        widgetName={meta.name}
                        bcName={meta.bcName}
                        name={field.key}
                        key={field.key}
                        title={field.title}
                        fieldType={field.type}
                        filterValues={field.filterValues}
                        fieldMeta={fieldMeta}
                    />
                )
            })}
            {showBottomBar && (
                <div className={styles.bottomBar}>
                    <div className={styles.filtersInfo}>
                        {t('Выбранные фильтры')}
                        <Badge className={styles.badge} count={filterLength} />
                    </div>
                    <SimpleControlLink onClick={onReset} label={t('Сбросить фильтры')} iconType="close-circle" />
                </div>
            )}
        </>
    )
}

export default React.memo(OpenFilterList)

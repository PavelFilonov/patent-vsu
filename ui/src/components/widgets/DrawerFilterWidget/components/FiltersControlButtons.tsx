import React from 'react'
import cn from 'classnames'
import {useTranslation} from '@tesler-ui/core'
import styles from './FiltersControlButtons.less'
import SimpleControlLink from '../../../ui/SimpleControlLink/SimpleControlLink'
import {NUMBER_DEFAULT_FILTERS} from '../consts'
import SubmitButtonWrapper from './SubmitButtonWrapper'

interface FiltersControlButtonsProps {
    bcName: string
    filterLength: number
    filterFieldsLength: number
    isExtraFiltersShown: boolean
    handleShowExtraFilters: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    onSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    handleReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const FiltersControlButtons: React.FunctionComponent<FiltersControlButtonsProps> = props => {
    const {bcName, filterLength, filterFieldsLength, isExtraFiltersShown, handleShowExtraFilters, onSubmit, handleReset} = props
    const {t} = useTranslation()
    const showReset = filterLength > 0
    const showMoreFilterButton = filterFieldsLength > NUMBER_DEFAULT_FILTERS && !isExtraFiltersShown
    const showLessFilterButton = filterFieldsLength > NUMBER_DEFAULT_FILTERS && isExtraFiltersShown
    return (
        <div className={cn(styles.submitButtonsBlock)}>
            {showMoreFilterButton && (
                <SimpleControlLink onClick={handleShowExtraFilters} label={t('More Filters')} className={cn(styles.mb16)} />
            )}
            {showLessFilterButton && (
                <SimpleControlLink onClick={handleShowExtraFilters} label={t('Less Filters')} className={cn(styles.mb16)} />
            )}
            <div className={cn(styles.submitButtonWrapper, styles.mb16)}>
                <SubmitButtonWrapper bcName={bcName} onSubmit={onSubmit} />
            </div>
            {showReset && <SimpleControlLink onClick={handleReset} label={t('Сбросить фильтры')} iconType="close-circle" />}
        </div>
    )
}

export default React.memo(FiltersControlButtons)

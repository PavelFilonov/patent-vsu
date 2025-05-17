import React from 'react'
import {SmField} from '../../../interfaces/widget'
import SimpleControlLink from '../../ui/SimpleControlLink/SimpleControlLink'
import IconField from '../../ui/IconField/IconField'
import styles from './WithHintIconField.less'
import {NO_DATA_HYPHEN} from '../../../constants'

interface WithHintIconFieldProps {
    meta: SmField
    value: {
        value: string
        hint?: string
        iconType?: string
        icon?: string
    }
    onDrillDown: () => void
}

const WithHintIconField: React.FunctionComponent<WithHintIconFieldProps> = props => {
    const {meta, value, onDrillDown} = props
    const label = value?.value ?? NO_DATA_HYPHEN
    return (
        <div className={styles.container}>
            {meta.drillDown ? <SimpleControlLink onClick={onDrillDown} label={label} className={styles.link} /> : label}
            {value?.iconType && value?.icon && <IconField name={value.icon} type={value.iconType} className={styles.icon} />}
            {value?.hint && <span className={styles.hint}>{value.hint}</span>}
        </div>
    )
}

export default React.memo(WithHintIconField)

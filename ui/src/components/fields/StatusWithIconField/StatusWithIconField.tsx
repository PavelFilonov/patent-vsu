import React from 'react'
import {DataValue} from '@tesler-ui/core/interfaces/data'
import IconField from '../../ui/IconField/IconField'
import styles from './StatusWithIconField.less'

interface StatusWithIconFieldProps {
    value: DataValue
}

const StatusWithIconField: React.FunctionComponent<StatusWithIconFieldProps> = props => {
    const {value} = props
    return (
        <div className={styles.container}>
            <IconField type="result" name={value as string} className={styles.icon} />
            {value}
        </div>
    )
}

export default StatusWithIconField

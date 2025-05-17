import React, {useCallback, useMemo} from 'react'
import {WidgetField} from '@tesler-ui/core/interfaces/widget'
import styles from './MultipleCheckboxField.less'
import ColoredCheckbox from '../../ui/ColoredChecbox/ColoredCheckbox'

interface SingleCheckboxValue {
    id: string | null
    statusCd: string
    selected: boolean
    statusBgColor: string
}

interface MultipleCheckboxFieldProps {
    meta: WidgetField
    widgetName: string
    value: SingleCheckboxValue[]
    onChange: (value: SingleCheckboxValue[]) => void
}

const MultipleCheckboxField: React.FC<MultipleCheckboxFieldProps> = ({value, onChange}) => {
    const handleChangeCheckbox = useCallback(
        linkedStatus => {
            const newValues = value.map(({id, selected, statusCd, statusBgColor}) => ({
                id,
                statusCd,
                statusBgColor,
                selected: linkedStatus === statusCd ? !selected : selected
            }))
            onChange(newValues)
        },
        [onChange, value]
    )

    const values = useMemo(() => {
        return value?.map(item => (
            <ColoredCheckbox
                selected={item.selected}
                onChange={() => handleChangeCheckbox(item.statusCd)}
                className={styles.checkbox}
                key={item.statusCd}
                value={item.statusCd}
                backgroundColor={item.statusBgColor}
            />
        ))
    }, [value, handleChangeCheckbox])

    return <div className={styles.row}>{values}</div>
}

export default MultipleCheckboxField

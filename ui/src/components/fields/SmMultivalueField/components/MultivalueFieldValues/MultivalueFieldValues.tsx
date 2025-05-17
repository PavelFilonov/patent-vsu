import React from 'react'
import {List, Button} from 'antd'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import styles from './MultivalueFieldValues.less'

interface MultivalueFieldValuesProps {
    values: MultivalueSingleValue[]
    handleDelete: (recordId: string) => void
}

const MultivalueFieldValues: React.FunctionComponent<MultivalueFieldValuesProps> = (props: MultivalueFieldValuesProps) => {
    const {values, handleDelete} = props
    return (
        <List
            dataSource={values}
            rowKey="id"
            split={false}
            renderItem={item => (
                <List.Item key={item.id} className={styles.multivalueValue}>
                    {item.value}
                    <Button icon="close" type="link" onClick={() => handleDelete(item.id)} className={styles.deleteIcon} />
                </List.Item>
            )}
        />
    )
}

export default React.memo(MultivalueFieldValues)

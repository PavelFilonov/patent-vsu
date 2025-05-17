import React from 'react'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import cn from 'classnames'
import {WidgetFormField} from '@tesler-ui/core/interfaces/widget'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import style from './HeaderWidget.less'

const HeaderFields: React.FunctionComponent<{
    fields: WidgetFormField[]
    data: DataItem
}> = props => {
    const {data, fields} = props
    const values =
        data &&
        fields
            .filter(field => !field.hidden && field.type !== FieldType.hidden)
            .map(field => data[field.key])
            .filter(i => i !== null)
    const row = React.useMemo(() => {
        return values?.map((item, index) => {
            return (
                <span
                    key={JSON.stringify(item)}
                    className={cn(style.headerField, {
                        [style.grey]: index % 2 !== 0 // todo need another condition
                    })}
                >
                    {item}
                </span>
            )
        })
    }, [values])
    if (!data || !fields || !values.length) {
        return null
    }
    return <>{row}</>
}
export default React.memo(HeaderFields)

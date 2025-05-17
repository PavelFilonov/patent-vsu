import React from 'react'
import {buildBcUrl, Dictionary} from '@tesler-ui/core'
import {DictionaryProps} from '@tesler-ui/core/components/ui/Dictionary/Dictionary'
import {useSelector} from 'react-redux'
import cn from 'classnames'
import {AppState} from '../../../interfaces/reducers'
import styles from './SmDictionary.less'

const SmDictionary: React.FunctionComponent<DictionaryProps> = props => {
    const {value, meta, onChange, widgetName, backgroundColor, className} = props
    const bcName = useSelector((state: AppState) => state.view.widgets?.find(i => i.name === widgetName)?.bcName)
    const bcUrl = buildBcUrl(bcName, true)
    const rowMeta = useSelector((state: AppState) => bcUrl && state.view.rowMeta[bcName]?.[bcUrl])
    const rowFieldMeta = rowMeta?.fields.find(field => field.key === meta.key)
    if (meta.bgColorKey) {
        return (
            <div
                className={cn(className, {[styles.coloredValue]: meta.bgColorKey})}
                style={backgroundColor ? {color: backgroundColor} : null}
            >
                {value}
            </div>
        )
    }
    return <Dictionary {...props} value={value} values={rowFieldMeta ? rowFieldMeta.values : []} fieldName={meta.key} onChange={onChange} />
}

SmDictionary.displayName = 'SmDictionary'

export default React.memo(SmDictionary)

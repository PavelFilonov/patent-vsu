import React from 'react'
import {MultivalueFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import cn from 'classnames'
import {MultiValueListRecord} from '@tesler-ui/core'
import style from './MultiValueList.less'
import {NO_DATA_HYPHEN} from '../../../constants'

export interface MultiValueListProps {
    fieldTitle?: React.ReactNode
    field: MultivalueFieldMeta
    data: MultivalueSingleValue[]
    noLineSeparator: boolean
    isColumnDirection?: boolean
    className?: string
}

const MultiValueList: React.FunctionComponent<MultiValueListProps> = props => {
    const {fieldTitle, field, data, noLineSeparator, isColumnDirection, className} = props
    let fieldData
    if (data.length === 0) {
        fieldData = NO_DATA_HYPHEN
    } else {
        fieldData = data.map(multivalueSingleValue => {
            return <MultiValueListRecord key={multivalueSingleValue.id} isFloat={false} multivalueSingleValue={multivalueSingleValue} />
        })
    }

    return (
        <div
            key={`${field.key}_${field.label}`}
            className={cn(className, style.fieldAreaBase, {
                [style.noFieldSeparator]: noLineSeparator,
                [style.fieldAreaDirection]: isColumnDirection
            })}
        >
            {fieldTitle && (
                <div
                    className={cn(style.labelAreaBase, {
                        [style.lableDirection]: isColumnDirection
                    })}
                >
                    {fieldTitle}
                </div>
            )}
            <div className={style.fieldDataBase}>{fieldData}</div>
        </div>
    )
}

export default React.memo(MultiValueList)

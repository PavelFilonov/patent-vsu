import React, {FunctionComponent} from 'react'
import {DataItem, DataValue, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {connect} from 'react-redux'
import {Popover, Typography} from 'antd'
import cn from 'classnames'
import {$do} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import styles from './CompositeField.less'
import {CompositeFieldMeta, SmField} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import ListValue from './components/ListValue'
import DrilldownLink from '../../ui/DrilldownLink/DrilldownLink'

interface CompositeFieldData extends SmField {
    value: DataValue
}

export interface CompositeFieldStoreProps {
    bcName: string
    record: DataItem
    fields: SmField[]
}
export interface CompositeFieldActionsProps {
    onDrillDown: (widgetName: string, cursor: string, bcName: string, fieldKey: string) => void
}

export interface CompositeFieldOwnProps {
    cursor: string
    data?: DataItem
    widgetName: string
    meta: CompositeFieldMeta
    disableDrillDown?: boolean
    className?: string
    metaError?: string
    disabled?: boolean
    readOnly?: boolean
    backgroundColor?: string
    value: DataValue
    onBlur?: () => void
}

export interface CompositeFieldProps extends CompositeFieldOwnProps, CompositeFieldStoreProps, CompositeFieldActionsProps {}

const ROWS_NUMBER = 4
const MAX_HEIGHT = 119
const ellipsisConfig = {rows: ROWS_NUMBER}
function useClientRect() {
    const [rect, setRect] = React.useState(null)
    const ref = React.useCallback(node => {
        if (node !== null) {
            setRect(node.getBoundingClientRect())
        }
    }, [])
    return [rect, ref]
}

export const CompositeField: FunctionComponent<CompositeFieldProps> = props => {
    const {bcName, record, fields, onDrillDown, cursor, widgetName, meta, disableDrillDown} = props
    const [rect, ref] = useClientRect()
    const fieldsData: CompositeFieldData[] = React.useMemo(
        () =>
            fields?.map(field => {
                return {
                    ...field,
                    value: record?.[field.key]
                }
            }),
        [fields, record]
    )
    const fieldContent: React.ReactChild[] = []
    const popoverContent: React.ReactChild[] = []
    let popoverContentSumLength = 0
    let showedContentLength = 0

    const handleDrillDown = React.useMemo(
        () => (drillDown: boolean, filedKey: string) => {
            return !disableDrillDown && drillDown ? () => onDrillDown(widgetName, cursor, bcName, filedKey) : null
        },
        [onDrillDown, disableDrillDown, widgetName, cursor, bcName]
    )
    fieldsData.forEach((fieldData, index) => {
        const isBold = index % 2 === 0
        const clName = cn({
            [styles.bold]: isBold
        })
        if (Array.isArray(fieldData.value)) {
            const cutValue = fieldData.value.slice(0, ROWS_NUMBER)
            fieldContent.push(
                <ListValue
                    ignoreHint={meta.ignoreHint}
                    key={fieldData.key}
                    className={clName}
                    value={cutValue as MultivalueSingleValue[]}
                />
            )
            popoverContent.push(
                <ListValue
                    ignoreHint={meta.ignoreHint}
                    key={fieldData.key}
                    className={clName}
                    value={fieldData.value as MultivalueSingleValue[]}
                    inPopover
                />
            )
            showedContentLength += cutValue.length
            popoverContentSumLength += fieldData.value.length
        } else {
            fieldContent.push(
                <DrilldownLink key={fieldData.key} onDrillDown={handleDrillDown(fieldData.drillDown, fieldData.key)}>
                    <Typography.Paragraph
                        ellipsis={ellipsisConfig}
                        className={cn(styles.maxWidth, styles.valueContainer, styles.text, clName)}
                    >
                        {fieldData.value}
                    </Typography.Paragraph>
                </DrilldownLink>
            )
            popoverContent.push(
                <div key={fieldData.key} className={cn(clName, styles.popoverTextContainer)}>
                    {fieldData.value}
                </div>
            )
            showedContentLength += 1
            popoverContentSumLength += 1
        }
    })

    const isPopoverShown = popoverContentSumLength > ROWS_NUMBER || rect?.height >= MAX_HEIGHT
    const getPrefix = () => {
        const restItems = popoverContentSumLength - showedContentLength
        return restItems > 0 ? `${restItems} ` : ''
    }
    return (
        <>
            <div ref={ref} className={styles.fieldContentContainer}>
                {fieldContent}
            </div>
            {isPopoverShown && (
                <Popover
                    placement="topLeft"
                    overlayClassName={cn(styles.popoverContainer, styles.text, styles.maxWidth)}
                    content={popoverContent}
                >
                    <div className={styles.popoverTriggerLabel}>{getPrefix()}more</div>
                </Popover>
            )}
        </>
    )
}

export function mapStateToProps(store: AppState, ownProps: CompositeFieldOwnProps): CompositeFieldStoreProps {
    const widget = store.view.widgets.find(item => item.name === ownProps.widgetName)
    const fields = ownProps.meta?.fields
    const bcName = widget?.bcName
    const record = store.data[bcName] && store.data[bcName].find(item => item.id === ownProps.cursor)

    return {
        bcName,
        fields,
        record
    }
}

function mapDispatchToProps(dispatch: Dispatch): CompositeFieldActionsProps {
    return {
        onDrillDown: (widgetName: string, cursor: string, bcName: string, fieldKey: string) => {
            dispatch($do.userDrillDown({widgetName, cursor, bcName, fieldKey}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompositeField)

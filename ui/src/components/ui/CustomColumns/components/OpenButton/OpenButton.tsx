import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {$do, buildBcUrl, useTranslation, useWidgetOperations} from '@tesler-ui/core'
import {OperationInclusionDescriptor} from '@tesler-ui/core/interfaces/operation'
import styles from './OpenButton.less'
import Button from '../../../Button/Button'
import {AppState} from '../../../../../interfaces/reducers'
import {SmListTableWidgetMeta} from '../../../../../interfaces/widget'
import {useOrderOfOperations} from '../../../../../hooks/useOrderOfOperations'

export interface OpenButtonProps {
    meta: SmListTableWidgetMeta
    selectedKey?: string
}

export const OpenButton = ({meta, selectedKey}: OpenButtonProps) => {
    const {bcName} = meta
    const {t} = useTranslation()
    const {operations, cursor} = useSelector((state: AppState) => {
        const bcUrl = buildBcUrl(bcName, true)
        const bc = state.screen.bo.bc[bcName]

        return {
            operations: state.view.rowMeta[bcName] && state.view.rowMeta[bcName][bcUrl] && state.view.rowMeta[bcName][bcUrl].actions,
            metaInProgress: !!state.view.metaInProgress[bcName],
            cursor: bc && bc.cursor
        }
    })

    const currentOperations = useOrderOfOperations(
        useWidgetOperations(operations, meta),
        meta.options?.actionGroups?.include as OperationInclusionDescriptor[]
    )

    const operation = currentOperations[0]

    const dispatch = useDispatch()

    const handleClick = useCallback(() => {
        if (selectedKey !== cursor) {
            dispatch($do.bcSelectRecord({bcName, cursor: selectedKey}))
        }
        setTimeout(() => dispatch($do.sendOperation({bcName, operationType: operation?.type, widgetName: meta.name})), 500)
    }, [bcName, cursor, dispatch, meta.name, operation?.type, selectedKey])

    return (
        <div className={styles.fieldContentContainer}>
            <Button className="openButtonField" type="saDefaultBlue" onClick={handleClick}>
                {t(operation?.text)}
            </Button>
        </div>
    )
}

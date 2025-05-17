import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import SimpleControlLink from '../../ui/SimpleControlLink/SimpleControlLink'
import {InfoPopupLinkMeta} from '../../../interfaces/widget'
import styles from './InfoPopupLink.less'
import {$smDo} from '../../../actions/actions'
import {AppState} from '../../../interfaces/reducers'

interface InfoPopupLinkProps {
    widgetName: string
    meta: InfoPopupLinkMeta
    value: string
    cursor: string
}

const selectRecordBeforeShowPopupWidgets = [WidgetTypes.List]

const InfoPopupLink: React.FunctionComponent<InfoPopupLinkProps> = ({widgetName, meta, value, cursor}) => {
    const dispatch = useDispatch()
    const widget = useSelector((state: AppState) => state.view.widgets.find(i => i.name === widgetName))
    const widgetType = widget?.type
    const bcName = widget?.bcName
    const handleClick = React.useCallback(() => {
        if (selectRecordBeforeShowPopupWidgets.includes(widgetType as WidgetTypes)) {
            dispatch($smDo.selectRecordAndOpenPopupByBcName({bcName, popupBcName: meta.popupBcName, cursor}))
        } else {
            dispatch($smDo.showViewPopup({bcName: meta.popupBcName}))
        }
    }, [dispatch, meta.popupBcName, bcName, cursor, widgetType])
    return <SimpleControlLink label={value} onClick={handleClick} className={styles.link} />
}

export default React.memo(InfoPopupLink)

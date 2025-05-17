import React from 'react'
import {Icon} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import cn from 'classnames'
import {BaseFieldProps} from '@tesler-ui/core/components/Field/Field'
import {AppState} from '../../../interfaces/reducers'
import styles from './FilesAttachmentField.less'
import {$smDo} from '../../../actions/actions'
import SeAddedFiles from '../../ui/AddedFiles/AddedFiles'

export function FilesAttachmentField(props: BaseFieldProps) {
    const {widgetName, disabled, readOnly} = props
    const dispatch = useDispatch()
    const bcName = useSelector((state: AppState) => state.view.widgets.find(i => i.name === widgetName)?.bcName)
    const loading = useSelector((state: AppState) => state.screen.bo.bc[bcName]?.loading)
    const cursor = useSelector((state: AppState) => state.screen.bo.bc[bcName]?.cursor)

    const handleSendFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target
        dispatch($smDo.smSeSendFiles({files, bcName, cursor}))
    }
    const notAllowed = disabled || readOnly
    if (notAllowed) {
        return <SeAddedFiles disabled={notAllowed} bcName={bcName} cursor={cursor} className={styles.mb0} />
    }
    return (
        <div className={cn(styles.fieldContainer)}>
            <div>
                <SeAddedFiles disabled={notAllowed} bcName={bcName} cursor={cursor} />
            </div>
            <div className={cn(styles.iconContainer)}>
                <label className={cn(styles.label)}>
                    <Icon spin={loading} type="file-add" />
                    <input disabled={notAllowed} type="file" style={{display: 'none'}} onChange={handleSendFiles} multiple />
                </label>
            </div>
        </div>
    )
}

export default React.memo(FilesAttachmentField)

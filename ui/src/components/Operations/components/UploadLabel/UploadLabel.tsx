import React from 'react'
import cn from 'classnames'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {Operation} from '@tesler-ui/core/interfaces/operation'
import styles from './UploadLabel.less'
import {AppState} from '../../../../interfaces/reducers'
import {$smDo} from '../../../../actions/actions'

interface UploadLabelOwnPros {
    className?: string
    disabled?: boolean
    multiple?: boolean
    operation: Operation
    accept?: string
    bcName: string
}
interface UploadLabelProps extends UploadLabelOwnPros {
    cursor: string
    onUploadFiles: (files: FileList, bcName: string, cursor: string) => void
}

/**
 * TODO upgrade if needed
 * @param props
 * @constructor
 */
const UploadLabel: React.FunctionComponent<UploadLabelProps> = props => {
    const {className, disabled, multiple, bcName, cursor, onUploadFiles, operation, accept} = props
    const handleSendFiles = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const {files} = e.target
            onUploadFiles(files, bcName, cursor)
        },
        [onUploadFiles, bcName, cursor]
    )
    return (
        <label className={cn(styles.label, className)}>
            {operation.text}
            <input
                disabled={disabled}
                type="file"
                style={{display: 'none'}}
                onChange={handleSendFiles}
                accept={accept}
                multiple={multiple}
            />
        </label>
    )
}
function mapStateToProps(store: AppState, ownProps: UploadLabelOwnPros) {
    const bc = store.screen.bo.bc[ownProps.bcName]
    return {
        cursor: bc.cursor
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onUploadFiles: (files: FileList, bcName: string, cursor: string) => dispatch($smDo.smSeSendFiles({files, bcName, cursor}))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadLabel)

import React from 'react'
import cn from 'classnames'
import {Tag} from 'antd'
import {Dispatch} from 'redux'
import {MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {buildBcUrl, connect} from '@tesler-ui/core'
import {AppState} from '../../../interfaces/reducers'
import styles from './AddedFiles.less'
import {$smDo} from '../../../actions/actions'
import {applyParams} from '../../../utils/api'
import {getDownloadFileEndpoint} from '../../../api/files'

interface AddedFilesOwnProps {
    disabled: boolean
    bcName: string
    cursor: string
    className?: string
}
interface AddedFilesProps extends AddedFilesOwnProps {
    screenName: string
    onDelete: (bcName: string, cursor: string, id: string) => void
    files: MultivalueSingleValue[]
}
const AddedFiles: React.FunctionComponent<AddedFilesProps> = props => {
    const {disabled, bcName, cursor, screenName, onDelete, files, className} = props
    const createDeletingHandler = React.useCallback(
        (id: string) => () => {
            onDelete(bcName, cursor, id)
        },
        [onDelete, bcName, cursor]
    )
    return (
        <div className={cn(styles.tagArea, styles.mb16, className)}>
            {files?.map(item => {
                return (
                    <Tag closable={!disabled} key={item.id} onClose={createDeletingHandler(item.id)}>
                        <a href={applyParams(getDownloadFileEndpoint(screenName, `${buildBcUrl(bcName)}/${cursor}`), {id: item.id})}>
                            {item.value}
                        </a>
                    </Tag>
                )
            })}
        </div>
    )
}
function mapStateToProps(state: AppState, ownProps: AddedFilesOwnProps) {
    return {
        screenName: state.screen.screenName,
        files: state.data[ownProps.bcName]?.find(i => i.id === ownProps.cursor)?.files
    }
}
function mapDispatchToStore(dispatch: Dispatch) {
    return {
        onDelete: (bcName: string, cursor: string, id: string) => dispatch($smDo.smSeDeleteFile({bcName, cursor, id}))
    }
}

AddedFiles.displayName = 'AddedFiles'

export default connect(mapStateToProps, mapDispatchToStore)(AddedFiles)

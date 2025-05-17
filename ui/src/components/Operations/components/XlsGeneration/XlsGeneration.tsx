import React from 'react'
import {Button, Dropdown, Icon, Menu, notification} from 'antd'
import {connect, useTranslation} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {SmField, SmWidgetMeta} from '../../../../interfaces/widget'
import {AppState} from '../../../../interfaces/reducers'
import {$smDo} from '../../../../actions/actions'
import getFields from '../../../../utils/getFields'
import styles from './XlsGeneration.less'
import {exportDataType} from '../../../../interfaces/exportData'
import {DocumentType} from '../../../../constants'

const moment = require('moment')

interface XlsGenerationOwnProps {
    meta: SmWidgetMeta
}
interface XlsGenerationProps extends XlsGenerationOwnProps {
    exportInProgress: boolean
    exportData: (bcName: string, fileName: string, fields: SmField[], type: exportDataType, title: string) => void
}

const XlsGeneration: React.FunctionComponent<XlsGenerationProps> = props => {
    const {meta, exportData, exportInProgress} = props
    const allFields = getFields(meta.fields)
    const xlsFields = React.useMemo(() => {
        const result: SmField[] = []
        allFields.forEach(i => {
            if (meta.options?.xlsGeneration?.fields?.includes(i.key)) {
                result.push(i)
            }
        })
        return result
    }, [allFields, meta.options?.xlsGeneration?.fields])
    const fileName = `${meta.options.xlsGeneration.title}_grid_${moment().format('YYYY.MM.DD')}`
    const handleExport = React.useCallback(
        (type: exportDataType) => () => {
            notification.open({
                key: `open${Date.now()}`,
                duration: 0,
                icon: <Icon type="warning" style={{color: '#FCB814'}} />,
                message: `${meta.options.xlsGeneration.title} Grid ${type} generation has been started. It could take a while. Do not leave page.`
            })
            exportData(meta.bcName, fileName, xlsFields, type, meta.options.xlsGeneration.title)
        },
        [meta, exportData, xlsFields, fileName]
    )
    const {t} = useTranslation()

    const menu = (
        <Menu>
            <Menu.Item onClick={handleExport(DocumentType.docx)}>{DocumentType.docx}</Menu.Item>
            <Menu.Item onClick={handleExport(DocumentType.xlsx)}>{DocumentType.xlsx}</Menu.Item>
        </Menu>
    )
    return exportInProgress ? (
        <Button loading className={styles.operation} />
    ) : (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" className={styles.operation}>
                <Icon type="download" className={styles.icon} />
                {t('Save to File')}
            </Button>
        </Dropdown>
    )
}
function mapStateToProps(state: AppState, ownProps: XlsGenerationOwnProps) {
    return {
        exportInProgress: state.view.smExportDataInProgress[ownProps.meta.bcName]
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return {
        exportData: (bcName: string, fileName: string, fields: SmField[], type: exportDataType, title: string) =>
            dispatch(
                $smDo.exportData({
                    bcName,
                    fileName,
                    fields,
                    type,
                    title
                })
            )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(XlsGeneration)

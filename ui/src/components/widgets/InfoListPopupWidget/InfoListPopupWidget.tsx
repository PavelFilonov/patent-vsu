import React from 'react'
import {PickListPopup as CorePickListPopup, buildBcUrl, $do} from '@tesler-ui/core'
import {WidgetTableMeta} from '@tesler-ui/core/interfaces/widget'
import {connect} from 'react-redux'
import {PickMap} from '@tesler-ui/core/interfaces/data'
import {RowMetaField} from '@tesler-ui/core/interfaces/rowMeta'
import {Dispatch} from 'redux'
import {Icon} from 'antd'
import cn from 'classnames'
import TableWidget from '../TableWidget/TableWidget'
import {AppState} from '../../../interfaces/reducers'
import Portal from '../../ui/Portal/Portal'
import {DrawerFilterWidget} from '../DrawerFilterWidget/DrawerFilterWidget'
import {
    // InfoListPopupWidgetMeta,
    SmListTableWidgetMeta,
    SmPaginationTypes,
    SmWidgetMeta,
    InfoListPopupWidgetMeta
} from '../../../interfaces/widget'
import styles from './InfoListPopupWidget.less'
import {DEFAULT_MODAL_WIDTH} from '../../../constants'
import {getDefaultModalBodyHeight} from '../../../utils/modal'
import Pagination from '../Pagination/Pagination'
import InfoLayout from './components/InfoLayout'

interface InfoListPopupWidgetOwnProps {
    meta: InfoListPopupWidgetMeta
}
interface InfoListPopupWidgetProps extends InfoListPopupWidgetOwnProps {
    onClose: (bcName: string) => void
    pickMap: PickMap
    cursor: string
    parentBCName: string
    bcLoading: boolean
    rowMetaFields: RowMetaField[]
}

export const InfoListPopupWidget: React.FunctionComponent<InfoListPopupWidgetProps> = props => {
    const {meta} = props
    const {bcName, options, name, fields} = meta
    const containerRef = React.useRef(null)
    const tableRef = React.useRef(null)

    // a search of DOM node for insertion of DrawerFilterWidget
    const findModalContent = () => tableRef?.current?.closest('.ant-modal-content')
    const tableComponent = (
        <div ref={tableRef} className={styles.tableContainer}>
            {options.drawerFilter !== false && (
                <div>
                    <DrawerFilterWidget meta={meta as SmWidgetMeta} selectContainer={findModalContent} />
                </div>
            )}
            {!options.layout ? (
                <TableWidget disablePagination meta={(meta as unknown) as SmListTableWidgetMeta} controlColumns={null} />
            ) : (
                <div className={styles.layoutContainer}>
                    <InfoLayout layout={options.layout} widgetName={name} bcName={bcName} fields={fields} />
                </div>
            )}
        </div>
    )
    const footerContent = (
        <div className={styles.pagination}>
            <Pagination bcName={meta.bcName} meta={meta} mode={SmPaginationTypes.pageNumbers} widgetName={meta.name} />
        </div>
    )
    const customComponents: {
        title?: React.ReactNode
        table?: React.ReactNode
        footer?: React.ReactNode
    } = {
        table: tableComponent,
        footer: footerContent
    }
    const modalWidth = meta.options?.modal?.width || DEFAULT_MODAL_WIDTH
    const modalBodyStyle = {
        height: meta.options?.modal?.bodyHeight || getDefaultModalBodyHeight(containerRef)
    }
    // a search of DOM node for insertion of close icon
    const findModalDiv = () => containerRef?.current?.querySelector('.ant-modal')
    return (
        <div ref={containerRef} className={cn(styles.corePickListPopupContainer, styles.closeIcon)}>
            <Portal getContainer={findModalDiv}>
                <Icon type="close" />
            </Portal>
            <CorePickListPopup
                closable={false}
                components={customComponents}
                widget={(meta as unknown) as WidgetTableMeta}
                bodyStyle={modalBodyStyle}
                width={modalWidth}
            />
        </div>
    )
}

function mapStateToProps(store: AppState, props: InfoListPopupWidgetOwnProps) {
    const {bcName} = props.meta
    const bcUrl = buildBcUrl(bcName, true)
    const fields = bcUrl && store.view.rowMeta[bcName]?.[bcUrl]?.fields
    const bc = store.screen.bo.bc[bcName]
    const parentBCName = bc?.parentName
    return {
        pickMap: store.view.pickMap,
        cursor: store.screen.bo.bc[parentBCName]?.cursor,
        parentBCName: bc?.parentName,
        bcLoading: bc?.loading,
        rowMetaFields: fields
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onClose: (bcName: string) => {
            dispatch($do.viewClearPickMap(null))
            dispatch($do.closeViewPopup({bcName}))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InfoListPopupWidget)

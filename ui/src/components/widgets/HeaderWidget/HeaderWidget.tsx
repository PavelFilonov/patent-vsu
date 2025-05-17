import React from 'react'
import {connect} from '@tesler-ui/core'
import {Store} from '@tesler-ui/core/interfaces/store'
import {DataItem} from '@tesler-ui/core/interfaces/data'
import {HeaderWidgetMeta} from '../../../interfaces/widget'
import HeaderFields from './HeaderFields'

export interface HeaderWidgetMapStateToProps {
    data: DataItem
}
export interface HeaderWidgetOwnProps {
    meta: HeaderWidgetMeta
}
export interface HeaderWidgetProps extends HeaderWidgetOwnProps, HeaderWidgetMapStateToProps {}
const HeaderWidget: React.FunctionComponent<HeaderWidgetProps> = props => {
    const {data, meta} = props
    return <HeaderFields data={data} fields={meta.fields} />
}

function mapStateToProps(state: Store, ownProps: HeaderWidgetOwnProps): HeaderWidgetMapStateToProps {
    const {bcName} = ownProps.meta
    const bc = state.screen.bo.bc[bcName]
    const bcCursor = bc && bc.cursor
    const bcData = state.data[bcName]
    return {
        data: bcData?.find(v => v.id === bcCursor)
    }
}

export default connect(mapStateToProps)(HeaderWidget)

import React from 'react'
import {Button, Dropdown, Icon, Menu} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {SmWidgetMeta} from '../../../interfaces/widget'
import {AppState} from '../../../interfaces/reducers'
import {$smDo} from '../../../actions/actions'
import styles from './SplitRateSorting.less'
import down from './img/down.svg'

interface SplitRateSortingProps {
    widgetMeta: SmWidgetMeta
}

function SplitRateSorting({widgetMeta}: SplitRateSortingProps) {
    const {bcName, fields, options, name} = widgetMeta
    const {splitRate} = options
    const {sorting} = splitRate
    const {fieldKey, labelsTuple} = sorting
    const sortKey = fields.find(i => i.key === fieldKey)
    const sorter = useSelector((state: AppState) => state.screen.sorters[bcName]?.find(item => item.fieldName === sortKey.key))
    const label = sorter?.direction === 'desc' ? labelsTuple[0] : labelsTuple[1]

    const dispatch = useDispatch()
    const createSortHandler = React.useCallback(
        (direction: 'asc' | 'desc') => () => {
            dispatch(
                $smDo.bcAddSorter({
                    bcName,
                    sorter: {
                        fieldName: sortKey.key,
                        direction
                    }
                })
            )
            dispatch(
                $smDo.bcForceUpdate({
                    bcName,
                    widgetName: name
                })
            )
        },
        [bcName, sortKey, name]
    )

    return (
        <Dropdown
            overlayClassName={styles.overlay}
            overlay={
                <Menu>
                    <Menu.Item key={labelsTuple[0]} onClick={createSortHandler('desc')}>
                        {labelsTuple[0]}
                    </Menu.Item>
                    <Menu.Item key={labelsTuple[1]} onClick={createSortHandler('asc')}>
                        {labelsTuple[1]}
                    </Menu.Item>
                </Menu>
            }
        >
            <Button type="link" className={styles.operation}>
                <Icon type="swap" theme="outlined" rotate={90} className={styles.icon} />
                {label}
                <img src={down} alt="down" className={styles.down} />
            </Button>
        </Dropdown>
    )
}

export default React.memo(SplitRateSorting)

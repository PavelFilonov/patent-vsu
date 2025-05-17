import React from 'react'
import {Checkbox} from 'antd'
import {connect, useTranslation} from '@tesler-ui/core'
import {Dispatch} from 'redux'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import styles from './DrawerFilterExtendedMode.less'
import {SmWidgetMeta} from '../../../../interfaces/widget'
import {AppState} from '../../../../interfaces/reducers'
import {$smDo} from '../../../../actions/actions'
import {VsuBcFilter} from '../../../../interfaces/filters'
import PopUpHints from '../../../ui/PopUpHints/PopUpHints'

interface DrawerFilterExtendedModeOwnProps {
    meta: SmWidgetMeta
}
interface DrawerFilterExtendedModeProps extends DrawerFilterExtendedModeOwnProps {
    mode: boolean
    filters: VsuBcFilter[]
    onRemoveExtendable: (bcName: string, filter: BcFilter) => void
    onChangeMode: (widgetName: string, mode: boolean) => void
}
const DrawerFilterExtendedMode: React.FunctionComponent<DrawerFilterExtendedModeProps> = props => {
    const {filters, onRemoveExtendable, meta, mode, onChangeMode} = props
    const handleChangeMode = React.useCallback(() => {
        filters?.forEach(i => {
            if (meta.options?.filtersExtension?.[i.fieldName]) {
                onRemoveExtendable(meta.bcName, i)
            }
        })
        onChangeMode(meta.name, !mode)
    }, [onChangeMode, onRemoveExtendable, filters, meta, mode])
    const {t} = useTranslation()
    return (
        <>
            {meta.options?.drawerFilterExtendedMode && (
                <div className={styles.wrapper}>
                    <Checkbox checked={mode} onChange={handleChangeMode}>
                        <span className={styles.checkboxLabel}>{t('Extended Filters')}</span>
                    </Checkbox>
                    {meta.options?.drawerFilterExtendedModeHints && (
                        <PopUpHints
                            overlayClassName={styles.popoverContainer}
                            title={meta.options?.drawerFilterExtendedModeHints?.header}
                            hints={meta.options?.drawerFilterExtendedModeHints?.hints}
                            iconClassName={styles.questionIcon}
                            placement="topRight"
                        />
                    )}
                </div>
            )}
        </>
    )
}
function mapStateToProps(state: AppState, ownProps: DrawerFilterExtendedModeOwnProps) {
    return {
        filters: state.screen.filters?.[ownProps.meta.bcName],
        mode: state.view.smDrawerFilterExtendedMode?.[ownProps.meta.name]
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onRemoveExtendable: (bcName: string, filter: BcFilter) => dispatch($smDo.bcRemoveFilter({bcName, filter})),
        onChangeMode: (widgetName: string, mode: boolean) => dispatch($smDo.smChangeDrawerFilterMode({widgetName, mode}))
    }
}
DrawerFilterExtendedMode.displayName = 'DrawerFilterExtendedModeOwnProps'
export default connect(mapStateToProps, mapDispatchToProps)(DrawerFilterExtendedMode)

import React from 'react'
import {Dispatch} from 'redux'
import {Col, Layout as AntLayout, Row, Spin} from 'antd'
import {$do, connect, ErrorPopup, ModalInvoke, View} from '@tesler-ui/core'
import {WidgetMeta, WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import {FieldType, SystemError, ViewState} from '@tesler-ui/core/interfaces/view'
import cn from 'classnames'
import LogicalMarkField from '../fields/LogicalMarkField/LogicalMarkField'
import Card from '../Card/Card'
import {SSO_AUTH} from '../../actions/actions'
import ViewHeader from '../ViewHeader/ViewHeader'
import AppBar from '../AppBar/AppBar'
import AppSideMenu from '../AppSideMenu/AppSideMenu'
import {AppState} from '../../interfaces/reducers'
import {SmFieldTypes, SmWidgetTypes} from '../../interfaces/widget'
import styles from './AppLayout.less'
import {getOptions} from '../../app-options'
import Login from '../Login/Login'
import CompositeField from '../fields/CompositeField/CompositeField'
import TextArea from '../ui/TextArea/TextArea'
import InfoField from '../fields/InfoField/InfoField'
import MultipleCheckboxField from '../fields/MultipleCheckboxField/MultipleCheckboxField'
import MultipleSelectField from '../fields/MultipleSelectField/MultipleSelectField'
import SmMultivalueField from '../fields/SmMultivalueField/SmMultivalueField'
import FramedInput from '../fields/FramedInput/FramedInput'
import InfoPopupLink from '../fields/InfoPopupLink/InfoPopupLink'
import HintLabelField from '../fields/HintLabelField/HintLabelField'
import StatusWithIconField from '../fields/StatusWithIconField/StatusWithIconField'
import IconifiedCheckboxField from '../fields/IconifiedCheckboxField/IconifiedCheckboxField'
import WithHintIconField from '../fields/WithHintIconField/WithHintIconField'
import LoadingProgress from '../ui/LoadingProgress/LoadingProgress'
import SmSpinReplacer from '../ui/SmSpinReplacer/SmSpinReplacer'
import CheckboxSelectField from '../fields/CheckboxSelectField/CheckboxSelectField'
import DevPanel from '../DevPanel/DevPanel'
import SinglePickField from '../fields/SinglePickField/SinglePickField'
import {customWidgets} from '../customWidgets'
import PickListField from '../fields/PickListField/PickListField'
import SmDictionary from '../fields/SmDictionary/SmDictionary'
import FilesAttachmentField from '../fields/FilesAttachmentField/FilesAttachmentField'
import SplitRateField from '../fields/SplitRateField/SplitRateField'
import ComplexCompositeField from '../fields/ComplexCompositeField/ComplexCompositeField'
import CopyableTextField from '../fields/CopyableTextField/CopyableTextField'

interface LayoutProps extends Pick<ViewState, 'modalInvoke'> {
    template: string
    sessionActive: boolean
    widgets: WidgetMeta[]
    error: SystemError
    loginError: string
    onErrorClose: () => void
    onSSOAuth: () => void
    menuVisible: boolean
    signOut: boolean
    screenName: string
}

const skipWidgetTypes = [
    WidgetTypes.HeaderWidget,
    WidgetTypes.SecondLevelMenu,
    SmWidgetTypes.HoverInfoList,
    SmWidgetTypes.HoverInfoForm,
    SmWidgetTypes.Compare,
    SmWidgetTypes.FormPopupWidget,
    SmWidgetTypes.Hidden
]

const customFields = {
    [SmFieldTypes.FilesAttachment]: FilesAttachmentField,
    [SmFieldTypes.CheckboxSelect]: CheckboxSelectField,
    [SmFieldTypes.WithHintIcon]: WithHintIconField,
    [SmFieldTypes.IconifiedCheckboxField]: IconifiedCheckboxField,
    [SmFieldTypes.ResultWithIcon]: StatusWithIconField,
    [SmFieldTypes.Composite]: CompositeField,
    [SmFieldTypes.Info]: InfoField,
    [SmFieldTypes.SinglePick]: SinglePickField,
    [SmFieldTypes.InfoPopupLink]: InfoPopupLink,
    [FieldType.text]: TextArea,
    [FieldType.dictionary]: SmDictionary,
    [FieldType.pickList]: PickListField,
    [SmFieldTypes.MultipleSelect]: MultipleSelectField,
    [SmFieldTypes.FramedInput]: FramedInput,
    [SmFieldTypes.MultivalueField]: SmMultivalueField,
    [SmFieldTypes.MultipleCheckbox]: MultipleCheckboxField,
    [SmFieldTypes.SplitRate]: SplitRateField,
    [SmFieldTypes.HintLabel]: HintLabelField,
    [SmFieldTypes.ComplexComposite]: ComplexCompositeField,
    [SmFieldTypes.CopyableText]: CopyableTextField,
    [SmFieldTypes.LogicalMark]: LogicalMarkField
}

const Layout: React.FunctionComponent<LayoutProps> = props => {
    const {sessionActive, error, modalInvoke, loginError, onErrorClose, onSSOAuth, signOut, screenName} = props
    React.useEffect(() => {
        if (!getOptions().noSSO && !sessionActive && !signOut) {
            onSSOAuth()
        }
    }, [sessionActive, signOut, onSSOAuth])

    const headerWidth = {
        width: '100%',
        maxWidth: '100%'
    }

    const branchName = getOptions().branchName.toUpperCase()
    const isProd = branchName === 'PROD'
    const needFullWidth = screenName === 'userManual'

    const isPopUp = error?.type === 1

    return !sessionActive ? (
        <div className={styles.spinContainer}>
            <div className={styles.spinCard}>
                {getOptions().noSSO && <Login />}
                {getOptions().noSSO !== true && loginError && (
                    <div className={styles.loginWithSsoErrorContainer}>
                        <div className={styles.errorText}>{loginError}</div>
                    </div>
                )}
                {error && <ErrorPopup title="Error" error={error} onClose={onErrorClose} />}
                {getOptions().noSSO !== true && !loginError && <Spin size="large" spinning tip="Вход в систему..." />}
            </div>
        </div>
    ) : (
        <div className={styles.Container}>
            <LoadingProgress />
            <AntLayout>
                <DevPanel />
                <div className={styles.errorPopup}>
                    {error && !isPopUp && <ErrorPopup title="Error" error={error} onClose={onErrorClose} />}
                </div>
                {modalInvoke && modalInvoke.confirmOperation?.type !== 'confirmText' && <ModalInvoke className={styles.modalInvoke} />}
                <AntLayout>
                    <AntLayout.Sider
                        className={cn(styles.sideMenu, {
                            [styles.devSideMenu]: !isProd
                        })}
                        theme="dark"
                        collapsed={false}
                        collapsedWidth={48}
                    >
                        <AppSideMenu isProd={isProd} />
                    </AntLayout.Sider>
                    <AntLayout className={styles.affixTargetWrapper}>
                        <AntLayout.Content>
                            <AntLayout.Header>
                                <div className={styles.headerWrapper}>
                                    <AppBar headerWidth={headerWidth} />
                                </div>
                            </AntLayout.Header>
                            <AntLayout.Content>
                                <Row>
                                    <ViewHeader headerWidth={headerWidth} />
                                </Row>
                                <Row type="flex" justify="center">
                                    <Col className={cn(styles.contentContainer, needFullWidth && styles.fullWidth)}>
                                        <div>
                                            <View
                                                customWidgets={customWidgets}
                                                customFields={customFields}
                                                skipWidgetTypes={skipWidgetTypes}
                                                card={Card}
                                                customSpinner={SmSpinReplacer}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </AntLayout.Content>
                        </AntLayout.Content>
                    </AntLayout>
                </AntLayout>
            </AntLayout>
        </div>
    )
}

function mapStateToProps(store: AppState) {
    return {
        template: store.screen.views.find(view => view.name === store.view.name)?.template,
        screenName: store.screen.screenName,
        signOut: store.session.signOut,
        sessionActive: store.session.active,
        widgets: store.view.widgets,
        menuVisible: store.screen.menuVisible,
        error: store.view.error,
        loginError: store.session.errorMsg,
        modalInvoke: store.view.modalInvoke
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onSSOAuth: () => {
            dispatch({type: SSO_AUTH})
        },
        onErrorClose: () => {
            dispatch($do.closeViewError(null))
        }
    }
}

Layout.displayName = 'AppLayout'

export default connect(mapStateToProps, mapDispatchToProps)(Layout)

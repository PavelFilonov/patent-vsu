import {CustomWidgetDescriptor, WidgetTypes} from '@tesler-ui/core/interfaces/widget'
import {SmWidgetTypes} from '../interfaces/widget'
import DrawerFilterWidget from './widgets/DrawerFilterWidget/DrawerFilterWidget'
import HeaderWidget from './widgets/HeaderWidget/HeaderWidget'
import InfoWidget from './widgets/InfoWidget/InfoWidget'
import InfoListPopupWidget from './widgets/InfoListPopupWidget/InfoListPopupWidget'
import StepsWidget from './widgets/StepsWidget/Steps'
import TableWidget from './widgets/TableWidget/TableWidget'
import DashboardSettingsWidget from './widgets/DashboardSettingsWidget/DashboardSettingsWidget'
import DrawerFormWidget from './widgets/DrawerFormWidget/DrawerFormWidget'
import ShowChangesToggleWidget from './widgets/ShowChangesToggleWidget/ShowChangesToggleWidget'
import ComparedInfoWidget from './widgets/ComparedInfoWidget/ComparedInfoWidget'
import CompareTableWidget from './widgets/CompareTableWidget/CompareTableWidget'
import CompareInfoListWidget from './widgets/CompareInfoListWidget/CompareInfoListWidget'
import MultipleSelectWidget from './widgets/MultipleSelectWidget/MultipleSelectWidget'
import Markdown from './widgets/Markdown/Markdown'

export const customWidgets: Record<string, CustomWidgetDescriptor> = {
    [SmWidgetTypes.DrawerFilterWidget]: DrawerFilterWidget,
    [SmWidgetTypes.Header]: HeaderWidget,
    [SmWidgetTypes.SecondHeader]: HeaderWidget,
    [SmWidgetTypes.Info]: InfoWidget,
    [SmWidgetTypes.InfoListPopup]: {component: InfoListPopupWidget, isPopup: true},
    [SmWidgetTypes.Steps]: StepsWidget,
    [WidgetTypes.List]: TableWidget,
    [SmWidgetTypes.DashboardSettings]: DashboardSettingsWidget,
    [SmWidgetTypes.DrawerForm]: DrawerFormWidget,
    [SmWidgetTypes.ShowChangesToggleWidget]: ShowChangesToggleWidget,
    [SmWidgetTypes.ComparedInfo]: ComparedInfoWidget,
    [SmWidgetTypes.CompareTableWidget]: CompareTableWidget,
    [SmWidgetTypes.CompareInfoList]: CompareInfoListWidget,
    [SmWidgetTypes.MultipleSelectWidget]: MultipleSelectWidget,
    [SmWidgetTypes.Markdown]: Markdown
}

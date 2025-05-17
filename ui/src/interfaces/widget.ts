import {
    DictionaryFieldMeta,
    PaginationMode,
    WidgetFieldsOrBlocks,
    WidgetFormField,
    WidgetListFieldBase,
    WidgetMeta,
    WidgetOptions,
    WidgetTableMeta,
    WidgetTypes
} from '@tesler-ui/core/interfaces/widget'
import {DataValue, MultivalueSingleValue} from '@tesler-ui/core/interfaces/data'
import {FieldType} from '@tesler-ui/core/interfaces/view'

export interface WidgetStepsMeta extends WidgetMeta {
    fields: DictionaryFieldMeta[]
}

export const emptyMultivalueField: MultivalueSingleValue[] = []

export const enum SmWidgetTypes {
    DrawerFilterWidget = 'DrawerFilterWidget',
    Header = 'Header',
    SecondHeader = 'SecondHeader',
    Info = 'Info',
    DashboardSettings = 'DashboardSettings',
    CheckboxAssocListPopup = 'CheckboxAssocListPopup',
    InfoListPopup = 'InfoListPopup',
    Steps = 'Steps',
    HoverInfoList = 'HoverInfoList',
    HoverInfoForm = 'HoverInfoForm',
    DrawerForm = 'DrawerForm',
    Compare = 'Compare',
    ComparedInfo = 'ComparedInfo',
    CompareInfoList = 'CompareInfoListWidget',
    CompareTableWidget = 'CompareTableWidget',
    ShowChangesToggleWidget = 'ShowChangesToggleWidget',
    FormPopupWidget = 'FormPopupWidget',
    Hidden = 'Hidden',
    SingleValuePopup = 'SingleValuePopup',
    MultipleSelectWidget = 'MultipleSelectWidget',
    Markdown = 'Markdown'
}

export const NO_TITLE_WIDGETS = [
    SmWidgetTypes.InfoListPopup,
    SmWidgetTypes.CompareTableWidget,
    SmWidgetTypes.ComparedInfo,
    SmWidgetTypes.MultipleSelectWidget
]

export type SmWidgetOptions = WidgetOptions &
    CardOptions &
    XlsExportOptions &
    ActionsThemeOptions &
    DrawerFilterOptions &
    TranslationOptions &
    ExtendedRowHints &
    ModalOptions &
    CheckboxFiltersOptions &
    SmShowConditionOptions &
    CompareListOptions &
    ComparedInfoOptions &
    InfoColumnOptions &
    CheckboxAssocListOptions &
    ChartOptions &
    ItemsListWidgetOptions &
    MultipleSelectWidgetOptions &
    SingleValueWidgetoptions &
    PaginationOptions &
    HintLabelOptions &
    WarningWidgetOptions &
    SplitRateOptions &
    SortableOptions &
    TableOptions &
    DotsColumnOptions &
    OpenButtonColumnOptions

export interface TableOptions {
    table?: {
        sorting?: boolean
    }
}

export type LADWidgetOptions = WidgetOptions &
    XlsExportOptions &
    ActionsThemeOptions &
    DrawerFilterOptions &
    TranslationOptions &
    ModalOptions &
    SmShowConditionOptions &
    CompareListOptions &
    ComparedInfoOptions &
    InfoColumnOptions &
    MultipleSelectWidgetOptions &
    SingleValueWidgetoptions &
    PaginationOptions &
    HintLabelOptions &
    WarningWidgetOptions &
    SortableOptions

export interface SmWidgetMeta extends WidgetMeta {
    fields: SmField[]
    descriptionDictionary?: {[language: string]: string}
    options?: SmWidgetOptions
}
export interface LADWidgetMeta extends WidgetMeta {
    fields: LADField[]
    options?: LADWidgetOptions
}
export interface SmTableWidgetMeta extends SmWidgetMeta {
    type: WidgetTypes.List | WidgetTypes.DataGrid
}
export interface SmListTableWidgetMeta extends WidgetTableMeta {
    options: SmWidgetOptions
}
export interface InfoListPopupWidgetMeta extends SmWidgetMeta {
    type: SmWidgetTypes.InfoListPopup
    options: SmWidgetOptions & {
        layout?: InfoLayout
    }
}

export interface InfoLayout {
    rows: Array<{
        cols: Array<{
            fieldKey: string
            span?: number
            offset?: number
        }>
    }>
}

export const enum SmFieldTypes {
    FilesAttachment = 'filesAttachment',
    /**
     * CheckboxSelect it's like antd's multiple select field without dropdown
     */
    CheckboxSelect = 'checkboxSelect',
    /**
     * ResultWithIcon uses in cases when need to display icon near "Passed" or "Failed"
     */
    ResultWithIcon = 'resultWithIcon',
    /**
     * Opens SingleValuePopupWidget
     */
    SinglePick = 'singlePick',
    WithHintIcon = 'withHintIcon',
    IconifiedCheckboxField = 'iconifiedCheckbox',
    Composite = 'composite',
    Info = 'info',
    InfoPopupLink = 'infoPopupLink',
    MultipleSelect = 'multipleSelect',
    FramedInput = 'framedInput',
    MultivalueField = 'multivalueField',
    MultipleCheckbox = 'multipleCheckbox',
    /**
     * Displays tuple of two fields: first is green, second is red
     */
    SplitRate = 'splitRate',
    /**
     * For purposes of filtering of `SplitRate` inner fields
     */
    Range = 'range',
    HintLabel = 'hintLabel',
    ComplexComposite = 'complexComposite',
    CopyableText = 'copyableText',
    LogicalMark = 'logicalMark'
}
export const enum LADFieldTypes {
    Info = 'info',
    MultivalueField = 'multivalueField'
}
export interface HeaderWidgetMeta extends WidgetMeta {
    type: SmWidgetTypes.Header
    fields: WidgetFormField[]
}

export interface CompareInfoListMeta extends WidgetMeta {
    type: SmWidgetTypes.CompareInfoList
    fields: SmField[]
    options: WidgetOptions & CompareInfoListOptions
}

export type WidgetInfoField = WidgetFormField & {
    drillDownTitle?: string
    drillDownTitleKey?: string
    hintKey?: string
}

export interface WidgetInfoOptions {
    fieldBorderBottom?: boolean
    footer?: string
}
export interface DrawerFilterOptions {
    drawerFilterCopyFilters?: {
        pivotWidgetName: string
        fieldsMapping: Record<string, string>
    }
    drawerFilterExtendedMode?: boolean
    drawerFilterExtendedModeHints?: {
        header?: string
        hints?: string[]
    }
    filtersExtension?: {
        [fieldKey: string]: Array<Record<string, DataValue>>
    }
    drawerFilter?: boolean
    filtersOrder?: string[]
    openFiltersOrder?: string[]
    printQuestions?: string
}
export interface TranslationOptions {
    translations?: {
        showTranslationsControl?: boolean
        languagePresentKey?: string
    }
}
export interface ExtendedRowHints {
    extendedRowHintKeys?: string[]
}
export interface ModalOptions {
    modal?: {
        bodyHeight?: number
        width?: number
    }
}
export interface MultipleSelectWidgetOptions {
    multipleSelect?: {
        selectLabel?: string
        hideSearch?: boolean
        standalone?: boolean
        assocName?: string
        primaryField?: string
    }
}
export interface SingleValueWidgetoptions {
    singleValue?: {
        primaryField: string
    }
}
export interface CheckboxFiltersOptions {
    checkboxFiltersList?: Array<{filterName: string; filterKey: string}>
}
export interface CompareListOptions {
    hideTableHeader?: boolean
}
export interface ComparedInfoOptions {
    disableShowChanges?: boolean
    drillDownBc?: string
}

export interface SmShowConditionOptions {
    showCondition?: ConditionalOption
    changeOrder?: ConditionalOption
}

interface ConditionalOption {
    key: string
    toggleLabel?: string
    toggleLabelHidden?: boolean
    params: {
        fieldKey: string
        defaultValue: DataValue
        value: DataValue
        orderColumnKey?: string
    }
}

export interface InfoColumnOptions {
    infoColumn?: {
        headerText?: string
        widgets: string[]
    }
}
export interface CompareInfoListOptions {
    showChangesBc?: string
}
export interface PaginationOptions {
    pagination?: {
        pagesToShow?: number
        limitOptions?: number[]
        hideSelectOptions?: boolean
    }
}
export interface ActionsThemeOptions {
    actionTheme?: Record<string, 'blue' | 'white' | 'link'>
}

export interface XlsExportOptions {
    xlsGeneration?: {
        title: string
        fields: string[]
    }
}

export interface HintLabelOptions {
    hintLabel?: string
}

export interface SortableOptions {
    isSortable?: boolean
}

export interface DotsColumnOptions {
    hideDotsColumn?: boolean
}

export interface OpenButtonColumnOptions {
    showOpenButton?: boolean
}

export interface SplitRateOptions {
    splitRate?: {
        sorting?: {
            enabled: boolean
            fieldKey: string
            labelsTuple: [string, string]
        }
    }
}

export interface WarningWidgetOptions {
    warningOptions?: {
        iconType?: string
        backgroundColor?: string
    }
}

export interface ItemsListWidgetOptions {
    itemListOptions?: {
        drillDownKey?: string
        titleKey?: string
        descriptionKey?: string
    }
}

export interface CheckboxAssocListOptions {
    checkboxAssocListOptions?: {
        valueKey: string
    }
}

export interface CardOptions {
    cardOptions?: {
        titleKey?: string
        hintPopUp?: {hintText?: string[]; hintDataKey?: string}
        helpUrl?: string
        helpLabel?: string
    }
}

interface CommonChartOptions {
    colorKey?: string
    valueKey: string
    drillDownKey?: string
    titleKey: string
}

export interface ChartOptions {
    chart?: {
        pieChart?: CommonChartOptions
        singleBarChart?: CommonChartOptions
    }
}
export interface WidgetInfoMeta extends WidgetMeta {
    type: SmWidgetTypes.Info
    fields: WidgetFieldsOrBlocks<WidgetInfoField>
    options?: WidgetOptions & WidgetInfoOptions
}
export interface WidgetInfoHoverMeta extends WidgetMeta {
    type: SmWidgetTypes.HoverInfoList
    fields: WidgetFieldsOrBlocks<WidgetInfoField>
    options?: WidgetOptions
}

export interface SmField extends WidgetListFieldBase {
    type: FieldType & SmFieldTypes
    fields?: SmField[]
    popupWithInputKey?: string
    inputPlaceHolder?: string
    secondTitle?: string
}
export interface LADField extends WidgetListFieldBase {
    type: FieldType & LADFieldTypes
    fields?: LADField[]
}
export type InfoFieldMeta = Omit<WidgetListFieldBase, 'type'> & {
    type: SmFieldTypes.Info
    fields: SmField[]
}
export type CompositeFieldMeta = Omit<WidgetListFieldBase, 'type'> & {
    ignoreHint?: boolean
    type: SmFieldTypes.Composite
    fields: SmField[]
}
export type ComplexCompositeFieldMeta = Omit<WidgetListFieldBase, 'type'> & {
    type: SmFieldTypes.ComplexComposite
    fields: SmField[]
    compositionType?: 'line' | 'remoteMark'
}
export type InfoPopupLinkMeta = SmField & {
    popupBcName?: string
}

export type LogicalMarkFieldMeta = Omit<SmField, 'type'> & {
    type: SmFieldTypes.LogicalMark
    iconType?: string
    iconColor?: string
}

export const enum SmPaginationTypes {
    pageNumbers = 'pageNumbers'
}

export type SmIconType = 'parent' | string

export type SmPaginationMode = PaginationMode | SmPaginationTypes

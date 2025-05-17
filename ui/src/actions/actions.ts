import {ActionsObservable as rActionsObservable} from 'redux-observable'
import {Observable} from 'rxjs/Observable'
import {Store} from 'redux'
import {
    ActionPayloadTypes as CoreActionPayloadTypes,
    AnyAction as CoreAnyAction,
    uActionsMap,
    AnyOfMap,
    createActionCreators,
    createActionTypes
} from '@tesler-ui/core'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {DataItem, DataValue, MultivalueSingleValue, PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {ChangeContext} from '../interfaces/context'
import {TeslerLoginResponse} from '../interfaces/store'
import {LaLanguage, Language} from '../interfaces/session'
import {AppState} from '../interfaces/reducers'
import {BcCountParamsMap} from '../interfaces/bcCount'
import {SmField} from '../interfaces/widget'
import {exportDataType} from '../interfaces/exportData'

export const MENU_VISIBLE = 'MENU_VISIBLE'
export const SSO_AUTH = 'SSO_AUTH'
export const ENTITY_VALUE = 'ENTITY_VALUE'

export function setMenuVisible(menuVisible: boolean) {
    return {
        type: 'MENU_VISIBLE',
        payload: menuVisible
    }
}

export function setPopupWithInputValue(popupWithInputValue: string) {
    return {
        type: 'ENTITY_VALUE',
        payload: popupWithInputValue
    }
}

const z = null as any

type NotificationType = {
    successTitle?: string
    successMessage?: string
    errorTitle?: string
    errorMessage?: string
}

/**
 * ActionName: PayloadType = z
 * @param ActionName Name for an action (redux action "type") and corresponding action creater action
 * @param PayloadType Typescript description for payload
 * @property z Mandatory to prevent typescript from erasing unused class fields (@see https://github.com/microsoft/TypeScript/issues/12437)
 */
export class SmActionPayloadTypes {
    smExample: null = z // do not use


    /**
     * Context switching
     */
    changeContext: ChangeContext = z

    changeCursor: {cursor: string} = z

    loginDone: TeslerLoginResponse = z

    changeBcFullTextFilter: {
        bcName: string
        fullTextFilterValue: string
    } = z

    /**
     * Initialization of language list for context switching
     */
    initLanguagesList: {languages: Language[]} = z

    initLaLanguagesList: {laLanguages: LaLanguage[]} = z

    smBcAddFilter: {
        widgetName: string
        bcName: string
        filter: BcFilter
    } = z

    bcForceUpdateActiveFilterLength: {
        bcName: string
    } = z

    bcResetActiveFilterLength: {
        bcName: string
    } = z

    changeSmShowChanges: {
        bcName: string
        showChanges: boolean
    } = z

    /**
     * It's ui analog of @tesler-ui/core's `showCondition`.
     * It provides ability to make widget showing depend on data from redux store
     * TODO Remove it if mechanism of `showCondition` in @tesler-ui/core was refactored
     */
    changeSmShowCondition: {
        key: string
        fieldKey: string
        value: DataValue
    } = z

    /**
     * Sends request for file upload
     */
    smSeSendFiles: {
        files: FileList
        bcName: string
        cursor: string
        dependentBcNames?: string[] // stores the names of the bc that need to be force updated
        notification?: NotificationType
    } = z

    /**
     * Sets uploaded file names to store
     */
    smSeSetFiles: {
        files: MultivalueSingleValue[]
        bcName: string
        cursor: string
    } = z

    /**
     * Survey execution: delete file by id
     */
    smSeDeleteFile: {
        bcName: string
        cursor: string
        id: string
    } = z

    getBcCount: {
        bcName: string
        params: BcCountParamsMap
    } = z

    setBcCount: {
        count: number
        bcName: string
    } = z

    setBcCountError: {
        bcName: string
    } = z

    changeBcLimit: {
        bcName: string
        limit: number
    } = z

    bcFetchDataRequestSavingCursors: {
        bcName: string
        widgetName: string
        ignorePageLimit?: boolean
    } = z

    seChooseAnswer: {
        widgetName: string
        bcName: string
        cursor: string
        dataItem: PendingDataItem
    } = z

    performDnd: {
        widgetName: string
        bcName: string
        cursors: string[]
        dataItems: PendingDataItem[]
    } = z

    /**
     * Changing mode of Drawer Filter
     */
    smChangeDrawerFilterMode: {
        widgetName: string
        mode: boolean
    } = z

    /**
     * Actions for exporting data to xlsx file
     */
    exportData: {
        type: exportDataType
        bcName: string
        fileName: string
        fields: SmField[]
        title: string
    } = z

    exportDataFailed: {
        bcName: string
    } = z

    exportExcel: {
        type: exportDataType
        items: DataItem[]
        bcName: string
        fileName: string
        title: string
        fields: SmField[]
    } = z

    exportDataDone: {
        bcName: string
    } = z

    associationsCompleted: null = z

    /**
     * synthetic action for saving associations and subsequent saving
     */
    saveAssociationsAndSave: {
        saveBcName: string
        bcNames: string[]
        widgetName: string
    } = z

    /**
     * Action for Dashboard setting widget (clears pending changes of popups widgets)
     */
    clearPopupsPendingChanges: {
        widgetName: string
    } = z

    /**
     * Survey execution: selection of question option in question card
     */
    surveyExecutionSetSelectedQuestionOption: {
        questionKey: string
        optionId: string
    } = z

    /**
     * Survey execution: It's like `surveyExecutionSetSelectedQuestionOption` with awaiting of prepared data
     */
    surveyExecutionAttemptSetSelectedQuestionOption: {
        questionKey: string
        optionId: string
        bcName: string
    } = z

    /**
     * Survey execution: clearing all selected question option radio buttons
     * Fired while `refine answers` process
     */
    surveyExecutionResetAnswers: null = z

    /**
     * Triggers combination of sequenced `bcSelectRecord` and `showViewPopup` actions
     */
    selectRecordAndOpenPopupByBcName: {
        bcName: string
        popupBcName: string
        cursor: string
    } = z
}

const smActionPayloadTypes = new SmActionPayloadTypes()
const coreActionPayloadTypes = new CoreActionPayloadTypes()

export const smActionTypes = createActionTypes(smActionPayloadTypes)
export const coreActionTypes = createActionTypes(coreActionPayloadTypes)

export const $smDo = createActionCreators({
    ...coreActionPayloadTypes,
    ...smActionPayloadTypes
})

export type SmActionsMap = uActionsMap<SmActionPayloadTypes> & uActionsMap<CoreActionPayloadTypes>

export type SmAnyAction = AnyOfMap<SmActionsMap> | CoreAnyAction

export interface ActionsObservable<T extends SmAnyAction> extends rActionsObservable<T> {
    /**
     * TODO
     *
     * @param key
     */
    ofType<K extends keyof (SmActionPayloadTypes & CoreActionPayloadTypes)>(...key: K[]): ActionsObservable<SmActionsMap[K]>
}
export type SmEpic = (action$: ActionsObservable<SmAnyAction>, store: Store<AppState>) => Observable<SmAnyAction>

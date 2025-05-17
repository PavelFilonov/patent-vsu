import {ScreenState} from '@tesler-ui/core/interfaces/screen'
import {VsuBcFilter} from './filters'

export interface VsuScreenState extends ScreenState {
    menuVisible: boolean
    filters: Record<string, VsuBcFilter[]>
    activeFiltersLengthList: Record<string, number>
    fullTextFilter: Record<string, string>
    popupWithInputValue: string
}

export enum SmPostInvokeType {
    refreshBcSaveCursors = 'refreshBcSaveCursors'
}

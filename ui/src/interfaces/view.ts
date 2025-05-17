import {ViewState} from '@tesler-ui/core/interfaces/view'
import {DataValue} from '@tesler-ui/core/interfaces/data'

export interface SmViewState extends ViewState {
    associationInProgress: boolean
    template?: string
    smDrawerFilterExtendedMode: {
        [widgetName: string]: boolean
    }
    smShowCondition: {
        [key: string]: {
            [fieldKey: string]: DataValue
        }
    }
    smShowChanges: {
        [key: string]: boolean
    }
    smExportDataInProgress: {
        [bcName: string]: boolean
    }
    smBcRecordsCount: Record<string, {count: number; error: boolean}>
}

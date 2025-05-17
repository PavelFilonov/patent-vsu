import {coreActions} from '@tesler-ui/core'
import {AnyAction} from '@tesler-ui/core/actions/actions'
import {BcMetaState} from '@tesler-ui/core/interfaces/bc'
import {WidgetField, MultivalueFieldMeta} from '@tesler-ui/core/interfaces/widget'
import {FieldType} from '@tesler-ui/core/interfaces/view'
import {PendingDataItem} from '@tesler-ui/core/interfaces/data'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {VsuScreenState} from '../interfaces/screen'
import {AppState} from '../interfaces/reducers'
import {ENTITY_VALUE, MENU_VISIBLE, smActionTypes} from '../actions/actions'
import {VsuBcFilter} from '../interfaces/filters'
import {SmField} from '../interfaces/widget'
import getFields from '../utils/getFields'

export const initialState: VsuScreenState = {
    screenName: '',
    bo: {
        activeBcName: null,
        bc: {} as Record<string, BcMetaState>
    },
    cachedBc: {},
    views: [],
    primaryView: '',
    filters: {},
    activeFiltersLengthList: {},
    fullTextFilter: {},
    sorters: {},
    menuVisible: true,
    popupWithInputValue: null
}

function handleMultivalueDisplayValues(
    widgetField: MultivalueFieldMeta,
    filter: VsuBcFilter,
    data: {
        [bcName: string]: {
            [cursor: string]: PendingDataItem // & {id: string, vstamp: number, _value: DataValue, _associate: boolean};
        }
    }
) {
    const {popupBcName} = widgetField
    if (Array.isArray(filter.value)) {
        // assert bad
    }
    const displayedValues: string[] =
        popupBcName &&
        (filter.value as ({key: string} | string)[]).map(
            i => Object.values(data?.[popupBcName])?.find(item => item.id === i)?._value as string
        )

    return {...filter, displayedValues}
}

export default function screenReducer(
    state: VsuScreenState = initialState,
    action: AnyAction | any,
    store: Readonly<AppState>
): VsuScreenState {
    switch (action.type as string) {
        case coreActions.logoutDone:
            return initialState
        case MENU_VISIBLE: {
            return {
                ...state,
                menuVisible: action.payload
            }
        }
        case ENTITY_VALUE: {
            return {
                ...state,
                popupWithInputValue: action.payload
            }
        }
        case coreActions.sendOperation: {
            return ['bulk-update'].includes(action.payload.operationType)
                ? {
                      ...state,
                      bo: {
                          ...state.bo,
                          bc: {
                              ...state.bo.bc,
                              [action.payload.bcName]: {
                                  ...state.bo.bc[action.payload.bcName],
                                  cursor: null
                              }
                          }
                      }
                  }
                : state
        }
        case smActionTypes.smBcAddFilter: {
            const {bcName, filter, widgetName} = action.payload
            const widgetFields = getFields(
                store.view.widgets.find(widget => widget.bcName === bcName && widget.name === widgetName)?.fields as SmField[]
            )
            const fieldWidgetDescription = widgetFields.find((field: WidgetField) => field.key === filter.fieldName) as WidgetField
            const hasDisplayedValue = store.view.popupData.bcName && fieldWidgetDescription.type === FieldType.multivalue
            if (!hasDisplayedValue) {
                const prevFilters = state.filters[bcName] || []
                const prevFilter = prevFilters.find(item => item.fieldName === filter.fieldName && item.type === filter.type)
                const newFilters = prevFilter
                    ? prevFilters.map(item => (item === prevFilter ? {...prevFilter, value: filter.value} : item))
                    : [...prevFilters, filter]
                return {
                    ...state,
                    bo: {
                        ...state.bo,
                        bc: {
                            ...state.bo.bc,
                            [action.payload.bcName]: {
                                ...state.bo.bc[action.payload.bcName],
                                page: 1
                            }
                        }
                    },
                    filters: {
                        ...state.filters,
                        [bcName]: newFilters
                    }
                }
            }
            // Handle multivalue fields
            const smPrevFilters = state.filters[bcName] || []
            const smPrevFilter = smPrevFilters.find(item => item.fieldName === filter.fieldName && item.type === filter.type)
            const smNewFilter = handleMultivalueDisplayValues(
                fieldWidgetDescription as MultivalueFieldMeta,
                filter,
                store.view.pendingDataChanges
            )
            const smNewFilters = smPrevFilter
                ? smPrevFilters.map(item => (item.fieldName === filter.fieldName ? smNewFilter : item))
                : [...smPrevFilters, smNewFilter]
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [bcName]: smNewFilters
                }
            }
        }
        case smActionTypes.changeBcFullTextFilter: {
            const {bcName, fullTextFilterValue} = action.payload
            return {
                ...state,
                fullTextFilter: {
                    ...state.fullTextFilter,
                    [bcName]: fullTextFilterValue
                }
            }
        }
        case smActionTypes.bcForceUpdateActiveFilterLength: {
            const {bcName} = action.payload
            let filterLength = 0
            state.filters[bcName]?.forEach((filter: BcFilter) => {
                if (Array.isArray(filter.value)) {
                    filterLength += filter.value.length
                } else {
                    filterLength += 1
                }
            })
            return {
                ...state,
                activeFiltersLengthList: {
                    ...state.activeFiltersLengthList,
                    [bcName]: filterLength
                }
            }
        }
        case smActionTypes.bcResetActiveFilterLength: {
            const {bcName} = action.payload

            return {
                ...state,
                activeFiltersLengthList: {
                    ...state.activeFiltersLengthList,
                    [bcName]: 0
                }
            }
        }
        case coreActions.selectView: {
            return {
                ...state,
                fullTextFilter: {}
            }
        }
        case coreActions.bcRemoveFilter: {
            // TODO:
            return state
        }
        case smActionTypes.changeBcLimit: {
            const {bcName, limit} = action.payload

            return {
                ...state,
                bo: {
                    ...state.bo,
                    bc: {
                        ...state.bo.bc,
                        [bcName]: {
                            ...state.bo.bc[bcName],
                            limit
                        }
                    }
                }
            }
        }
        default:
            return state
    }
}

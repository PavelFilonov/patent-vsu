import {buildBcUrl, fetchBcDataAll, getFilters} from '@tesler-ui/core'
import {Observable} from 'rxjs'
import {ApplicationErrorType} from '@tesler-ui/core/interfaces/view'
import {$smDo, smActionTypes, SmEpic} from '../../actions/actions'
import exportXlsx from '../../utils/exportXlsx'
import getSorters from '../../utils/getSorters'
import exportDocx from '../../utils/exportDocx'
import {DocumentType} from '../../constants'

export const exportDataEpic: SmEpic = ($action, store) =>
    $action.ofType(smActionTypes.exportData).mergeMap(action => {
        const {bcName, fileName, fields, type, title} = action.payload
        const state = store.getState()
        const {screenName} = state.screen
        const url = buildBcUrl(bcName)
        const filters = state.screen.filters[bcName] || []
        const sorters = state.screen.sorters[bcName]
        const params = {
            _limit: 1000,
            _export: 'Excel',
            ...getFilters(filters),
            ...getSorters(sorters)
        }
        return fetchBcDataAll(screenName, url, params)
            .mergeMap(data => {
                return Observable.of($smDo.exportExcel({items: data, bcName, fields, fileName, type, title}))
            })
            .catch(e => {
                console.error('Error while exporting to Excel', e)
                return Observable.concat(
                    Observable.of($smDo.exportDataDone({bcName})),
                    Observable.of(
                        $smDo.showViewError({
                            error: {
                                type: ApplicationErrorType.SystemError,
                                details: e.toString()
                            }
                        })
                    )
                )
            })
    })

export const createExcelEpic: SmEpic = ($action, store) =>
    $action.ofType(smActionTypes.exportExcel).mergeMap(action => {
        const {items, bcName, fileName, fields, type, title} = action.payload
        switch (type) {
            case DocumentType.docx:
                exportDocx(items, bcName, fileName, fields, title)
                break
            case DocumentType.xlsx:
            default:
                exportXlsx(items, bcName, fileName, fields, title)
        }
        return Observable.of($smDo.exportDataDone({bcName}))
    })

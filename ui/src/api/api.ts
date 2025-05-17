import {BcDataResponse} from '@tesler-ui/core/interfaces/data'
import {axiosGet, axiosPost, buildUrl} from '@tesler-ui/core'
import {AssociatedItem} from '@tesler-ui/core/interfaces/operation'
import {applyParams} from '../utils/api'

/**
 * It's a copy of core's fetchBcData for testing bcFetchDataSavingCursors
 *
 * @param screenName
 * @param bcUrl
 * @param params
 */
export function fetchBcData(screenName: string, bcUrl: string, params: Record<string, string | number> = {}) {
    const noLimit = params._limit === 0
    const queryStringObject = {
        ...params,
        _page: !noLimit && ('_page' in params ? params._page : 1),
        _limit: !noLimit && ('_limit' in params ? params._limit : 30)
    }
    const url = applyParams(buildUrl`data/${screenName}/` + bcUrl, queryStringObject)
    return axiosGet<BcDataResponse>(url)
}

export function associate(
    screenName: string,
    bcUrl: string,
    data: AssociatedItem[] | Record<string, AssociatedItem[]>,
    params?: Record<string, number>
) {
    const processedData = Array.isArray(data)
        ? data.map(item => ({
              id: item.id,
              vstamp: item.vstamp,
              associated: item._associate
          }))
        : data
    const url = applyParams(buildUrl`associate/${screenName}/` + bcUrl, params)
    return axiosPost<any>(url, processedData).map(response => response.data)
}

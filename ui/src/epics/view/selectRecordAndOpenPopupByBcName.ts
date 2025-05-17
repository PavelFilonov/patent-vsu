import {Observable} from 'rxjs/Observable'
import {$do, coreActions} from '@tesler-ui/core'
import {smActionTypes, SmEpic} from '../../actions/actions'

/**
 * Performs `bcSelectRecord` and `showViewPopup` consistently
 * @param action$
 * @param store
 */
export const selectRecordAndOpenPopupByBcName: SmEpic = (action$, store) =>
    action$.ofType(smActionTypes.selectRecordAndOpenPopupByBcName).mergeMap(action => {
        const {bcName, cursor, popupBcName} = action.payload
        return Observable.concat(
            Observable.of($do.bcSelectRecord({bcName, cursor})),
            Observable.race(
                action$
                    .ofType(coreActions.bcFetchRowMetaSuccess)
                    .filter(a => a.payload.bcName === bcName && a.payload.cursor === cursor)
                    .take(1)
                    .mergeMap(() => {
                        return Observable.of($do.showViewPopup({bcName: popupBcName}))
                    }),
                action$
                    .ofType(coreActions.bcFetchRowMetaFail)
                    .filter(a => a.payload.bcName === bcName)
                    .take(1)
                    .switchMap(() => {
                        return Observable.empty()
                    })
            )
        )
    })

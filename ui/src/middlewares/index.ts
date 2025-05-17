import {CustomMiddlewares, CoreMiddlewares} from '@tesler-ui/core/interfaces/customMiddlewares'
import {createSmAutosaveMiddleware} from './smAutosaveMiddleware'

type SmMiddlewares = Partial<CoreMiddlewares>

export const middlewares: CustomMiddlewares<SmMiddlewares> = {
    autosave: createSmAutosaveMiddleware()
}

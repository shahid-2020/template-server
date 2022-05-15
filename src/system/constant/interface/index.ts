import { Methods } from '../enum'

export interface IRouter {
  method: Methods
  path: string
  handlerName: string | symbol
  middlewares?: []
}

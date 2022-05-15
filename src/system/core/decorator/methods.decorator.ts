import { IRouter, MetadataKeys, Methods } from '@system/constant'

type MethodInput =
  | string
  | {
      path: string
      middlewares?: []
    }

const methodDecoratorFactory = (method: Methods) => {
  return (args: MethodInput): MethodDecorator => {
    return (target, propertyKey) => {
      const controllerClass = target.constructor
      const routers: IRouter[] = Reflect.hasMetadata(
        MetadataKeys.ROUTERS,
        controllerClass
      )
        ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
        : []

      let path = ''
      let middlewares: [] | undefined

      if (typeof args === 'string') {
        path = args
      } else {
        path = args.path
        middlewares = args?.middlewares
      }

      routers.push({
        method,
        path,
        middlewares,
        handlerName: propertyKey,
      })
      Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass)
    }
  }
}
export const Get = methodDecoratorFactory(Methods.GET)
export const Post = methodDecoratorFactory(Methods.POST)
export const Patch = methodDecoratorFactory(Methods.PATCH)
export const Put = methodDecoratorFactory(Methods.PUT)
export const Delete = methodDecoratorFactory(Methods.DELETE)

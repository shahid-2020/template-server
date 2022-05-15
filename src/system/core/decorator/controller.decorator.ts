import { MetadataKeys } from '@system/constant'

type ControllerInput =
  | string
  | {
      path: string
      version: number
      middlewares?: []
    }

export const Controller = (args: ControllerInput): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(
      MetadataKeys.BASE_PATH,
      typeof args === 'string' ? args : args.path,
      target
    )
    if (typeof args === 'string') {
      return
    }
    Reflect.defineMetadata(MetadataKeys.VERSION, args.version, target)
    Reflect.defineMetadata(
      MetadataKeys.BASE_MIDDLEWARES,
      args.middlewares,
      target
    )
  }
}

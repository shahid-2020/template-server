export * from './decorator/controller.decorator'
export * from './decorator/methods.decorator'

import express, { Application, Handler } from 'express'
import { IRouter, MetadataKeys } from '@system/constant'
import { container } from 'tsyringe'
import { logger } from '@shared/logger'

export const mapRoutes = async (app: Application, controllerClasses: any[]) => {
  controllerClasses.forEach((controllerClass) => {
    const controller: { [handleName: string]: Handler } =
      container.resolve(controllerClass)
    const basePath: string = Reflect.getMetadata(
      MetadataKeys.BASE_PATH,
      controllerClass
    )
    const version: string = Reflect.getMetadata(
      MetadataKeys.VERSION,
      controllerClass
    )
    const baseMiddlewares: string = Reflect.getMetadata(
      MetadataKeys.BASE_MIDDLEWARES,
      controllerClass
    )
    const routers: IRouter[] = Reflect.getMetadata(
      MetadataKeys.ROUTERS,
      controllerClass
    )

    const exRouter = express.Router()

    routers.forEach(({ method, path, handlerName, middlewares }) => {
      exRouter[method](path, controller[String(handlerName)].bind(controller))
      app.use(basePath, exRouter)
      logger.info(`${method.toLocaleUpperCase()} ${basePath + path}`)
    })
  })
}
//   const healthController = container.resolve(HealthController)
// app.use('/api/v1/health', healthController.routes())

// const info: Array<{ api: string, handler: string }> = [];
// +
// +    controllers.forEach((controllerClass) => {
// +      const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any;
// +
// +      const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
// +      const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);
// +
// +      const exRouter = express.Router();
// +
// +      routers.forEach(({ method, path, handlerName}) => {
// +        exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));
// +
// +        info.push({
// +          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
// +          handler: `${controllerClass.name}.${String(handlerName)}`,
// +        });
// +      });
// +
// +      this._instance.use(basePath, exRouter);
// +    });
// +
// +    console.table(info);
//    }
//  }

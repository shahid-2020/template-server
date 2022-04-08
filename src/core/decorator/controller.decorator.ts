import { autoInjectable } from 'tsyringe'

type controllerArgs = {
  path: string
  version: string
  middleware?: [Function]
}


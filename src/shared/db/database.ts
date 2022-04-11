import { singleton } from 'tsyringe'
import { createConnection } from 'typeorm'
import Logger from '@shared/logger'
import ormconfig from '@shared/config/ormconfig'

@singleton()
export default class Database {
  constructor(private readonly logger: Logger) {}
  public async connectPg(): Promise<void> {
    try {
      await createConnection(ormconfig)
      this.logger.info('Postgres Connected')
    } catch (error: any) {
      this.logger.error(`Postgres Error ${error.message}`)
    }
  }
}

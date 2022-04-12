import { ConnectionOptions } from 'typeorm'
import * as path from 'path'
import { configService } from '@config'

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [
    path.join(global.__basedir, 'src', '**', '*.entity.{ts,js}'),
    path.join(global.__basedir, '**', '*.entity.{ts,js}'),
  ],
  migrations: [
    path.join(global.__basedir, 'src', 'migrations', '*.{ts,js}'),
    path.join(global.__basedir, 'migrations', '*.{ts,js}'),
  ],
  cli: {
    migrationsDir: path.join(global.__basedir, 'migrations', '*.{ts,js}'),
  },
  migrationsRun: false,
  synchronize: true,
}

export default ormconfig

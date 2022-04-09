import { ConnectionOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  migrationsRun: true,
  synchronize: false,
}

export default ormconfig

import { ConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, "**", "*.entity.{ts,js}")],
  migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
  extra: {
    ssl: process.env.NODE_ENV === "development" ? false : true,
  },
  cli: {
    migrationsDir: path.join(__dirname, "migrations", "*.{ts,js}"),
  },
  migrationsRun: true,
  synchronize: false,
};

export default config;

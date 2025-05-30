import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "localhost",
  port: 1433,
  username: "sa",
  password: "YourStrong!Passw0rd",
  database: "master",
  synchronize: true,  // auto-create tables, use only for dev!
  logging: false,
  entities: ["src/entity/**/*.ts"],  // or path to your entities
  options: {
    encrypt: false,
  }
});
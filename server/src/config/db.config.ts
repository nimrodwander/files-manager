import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource: DataSource = new DataSource({
  type: "mssql",
  host: "localhost",
  port: 1433,
  username: "sa",
  password: "Abcd1234!",
  database: "master",
  synchronize: true, 
  logging: false,
  entities: ["src/entity/**/*.ts"],
  options: {
    encrypt: false,
  }
});
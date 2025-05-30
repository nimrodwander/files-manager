import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "localhost",
  port: 1433,
  username: "sa",
  password: "YourStrong!Passw0rd",
  database: "master",
  synchronize: true, 
  logging: false,
  entities: ["src/entity/**/*.ts"],
  options: {
    encrypt: false,
  }
});
import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { User } from "./models/User";

import "dotenv/config";
import { DeviceScheduler } from "./models/DeviceScheduler";
import { Device } from "./models/Device";
import { Sensor } from "./models/Sensor";
import { SensorData } from "./models/SensorData";

let connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [User, Device, DeviceScheduler, Sensor, SensorData],
  migrations: ["src/db/migrations/*.ts"]
};

export default new DataSource({
  ...connectionOptions
});

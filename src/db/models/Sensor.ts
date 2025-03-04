import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn
} from "typeorm";
import dataSource from "../dataSource";
import { Exclude } from "class-transformer";
import { IsEnum } from "class-validator";

export enum SENSOR_TYPE_ENUM {
  SENSOR_TEMPERATURE = "temperature",
  SENSOR_WATER_PH = "sensor.water.ph",
  SENSOR_WATER_TDS = "sensor.water.tds",
  SENSOR_WATER_EC = "sensor.water.ec"
}

@Entity("sensor")
@Index("sensor_search_vector_idx", ["search_vector"], { unique: true })
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  command: string; // Mã cảm biến (VD: "TEMP_01", "PH_02")

  @IsEnum(SENSOR_TYPE_ENUM)
  @Column()
  type: string; // Loại cảm biến (VD: "temperature", "pH", "TDS", "EC")

  @Column({ nullable: true })
  location?: string; // Vị trí lắp đặt (VD: "Bể nuôi số 1")

  @Column()
  unit: string; // Đơn vị đo (VD: "°C", "pH", "ppm", "mS/cm")

  @CreateDateColumn()
  createdAt: Date;

  // Trường search_vector, không cần phải insert trực tiếp vào cơ sở dữ liệu,
  // vì TypeORM sẽ tự động tính toán giá trị trong các phương thức @BeforeInsert/@BeforeUpdate
  @Exclude()
  @Column({ type: "tsvector", select: false })
  search_vector: string;

  // Tính toán và cập nhật search_vector khi thêm hoặc cập nhật khách hàng
  @BeforeInsert()
  @BeforeUpdate()
  async updateSearchVector() {
    const vector = await dataSource.query(
      `select to_tsvector('simple', unaccent('${this.name ?? ""}'))`
    );
    this.search_vector = vector[0].to_tsvector;
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import dataSource from "../dataSource";

export enum DEVICE_TYPE_ENUM {
  DEVICE_SWITCH = "switch",
  DEVICE_MOTOR = "motor"
}

export enum DEVICE_STATUS {
  FORWARD = "forward",
  REVERSE = "reverse",
  STOPPED = "stopped",
  RUNNING = "running"
}

@Entity("device")
@Index("device_search_vector_idx", ["search_vector"], { unique: true })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: DEVICE_TYPE_ENUM.DEVICE_SWITCH })
  type: string;

  @Column({ default: DEVICE_STATUS.STOPPED })
  status: string;

  @Column({ unique: true })
  command: string;

  // Trường search_vector, không cần phải insert trực tiếp vào cơ sở dữ liệu,
  // vì TypeORM sẽ tự động tính toán giá trị trong các phương thức @BeforeInsert/@BeforeUpdate
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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("device_scheduler")
export class DeviceScheduler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: number;
  
  @Column()
  scheduler: string;

  @Column({ default: true })
  status: boolean;
}

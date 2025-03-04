import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sensor } from "./Sensor";

@Entity("sensor_data")
export class SensorData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sensor, (sensor) => sensor.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "sensorId" })
    sensor: Sensor;

    @Column()
    sensorId: number; // Liên kết với bảng Sensor

    @Column("float")
    value: number; // Giá trị đo được

    @CreateDateColumn()
    timestamp: Date; // Thời gian ghi nhận dữ liệu
}

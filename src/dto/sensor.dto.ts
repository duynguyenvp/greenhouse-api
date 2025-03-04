import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SENSOR_TYPE_ENUM } from "src/db/models/Sensor";

export class CreateSensorDTO {
  @IsString()
  name: string;
  @IsString()
  command: string;
  @IsEnum(SENSOR_TYPE_ENUM)
  type: string;
  @IsString()
  unit: string;
  @IsOptional()
  location?: string;
}

export class CreateSensorDataDTO {
  @IsNumber()
  sensorId: number;
  @IsNumber()
  value: number;
}

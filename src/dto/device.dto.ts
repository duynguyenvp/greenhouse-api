import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";
import { Device, DEVICE_STATUS, DEVICE_TYPE_ENUM } from "../db/models/Device";
import { DeviceScheduler } from "../db/models/DeviceScheduler";

export class CreateDeviceDTO {
  @IsString()
  name: string;
  @IsString()
  command: string;
  @IsEnum(DEVICE_TYPE_ENUM)
  type: string;
  @IsEnum(DEVICE_STATUS)
  status: string;
}

export class CreateDeviceSchedulerDTO {
  @IsNumber()
  deviceId: number;
  @IsString()
  scheduler: string;
  @IsBoolean()
  status: boolean;
}

export default class DeviceResponseDTO {
  id: number;
  name: string;
  command: string;
  type: string;
  status: string;
  schedulers: DeviceScheduler[];

  constructor();
  constructor(
    id: number,
    name: string,
    command: string,
    type: string,
    status: string,
    schedulers: DeviceScheduler[]
  );
  constructor(
    id?: number,
    name?: string,
    command?: string,
    type?: string,
    status?: string,
    schedulers?: DeviceScheduler[]
  ) {
    if (id && name && command && type && status && schedulers) {
      this.id = id;
      this.name = name;
      this.command = command;
      this.type = type;
      this.status = status;
      this.schedulers = schedulers;
    } else {
      this.id = 0;
      this.name = "";
      this.command = "";
      this.type = DEVICE_TYPE_ENUM.DEVICE_SWITCH;
      this.status = DEVICE_STATUS.STOPPED;
      this.schedulers = [];
    }
  }

  static setSchedulersFromRawData(
    deviceDTO: Device,
    deviceSchedulers: DeviceScheduler[]
  ) {
    const schedulers = deviceSchedulers.filter(
      f => f.deviceId === deviceDTO.id
    );
    return { ...deviceDTO, schedulers } as DeviceResponseDTO;
  }
}

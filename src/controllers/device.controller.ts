import "dotenv/config";
import DeviceRepository from "../db/repositories/deviceRepository";
import DeviceResponseDTO, {
  CreateDeviceDTO,
  CreateDeviceSchedulerDTO
} from "../dto/device.dto";
import { Device } from "../db/models/Device";
import { DeviceScheduler } from "../db/models/DeviceScheduler";
import { removeEmptyFields } from "../utils/removeEmptyFields";
import PaginatedDevices from "../dto/paginatedDevices.dto";

export default class DeviceController {
  private deviceRepository: DeviceRepository;
  constructor(deviceRepository: DeviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  async createDevice(input: CreateDeviceDTO): Promise<Device> {
    const device = await this.deviceRepository.createDevice(input);
    return device;
  }

  async createDeviceScheduler(
    input: CreateDeviceSchedulerDTO
  ): Promise<DeviceScheduler> {
    const scheduler = await this.deviceRepository.createDeviceScheduler(input);
    return scheduler;
  }

  async updateDevice(id: number, data: Partial<Device>): Promise<Device> {
    const updateData = removeEmptyFields(data);
    return this.deviceRepository.updateDevice(id, updateData);
  }

  async updateDeviceScheduler(id: number, data: Partial<DeviceScheduler>): Promise<DeviceScheduler> {
    const updateData = removeEmptyFields(data);
    return this.deviceRepository.updateDeviceScheduler(id, updateData);
  }

  async deleteDevice(id: number): Promise<boolean> {
    await this.deviceRepository.deleteDevice(id);
    return true;
  }

  async deleteDeviceScheduler(id: number): Promise<boolean> {
    await this.deviceRepository.deleteScheduler(id);
    return true;
  }

  async getDevice(id: number): Promise<DeviceResponseDTO> {
    const device = await this.deviceRepository.getDeviceWithScheulers(id);
    if (!device) {
      throw new Error("Employee not found");
    }
    return device;
  }

  async getDevices(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<PaginatedDevices> {
    return this.deviceRepository.getDevices(pageIndex, pageSize, keyword);
  }
}

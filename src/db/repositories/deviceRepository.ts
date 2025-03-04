import { validate } from "class-validator";
import { DataSource, Repository } from "typeorm";
import { removeAccents } from "../../utils/removeAccents";
import { Device } from "../models/Device";
import PaginatedDevices from "../../dto/paginatedDevices.dto";
import { DeviceScheduler } from "../models/DeviceScheduler";
import DeviceResponseDTO, {
  CreateDeviceDTO,
  CreateDeviceSchedulerDTO
} from "../../dto/device.dto";

class DeviceRepository {
  private repository: Repository<Device>;
  private schedulerRepository: Repository<DeviceScheduler>;
  private _dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this._dataSource = dataSource;
    this.repository = dataSource.getRepository(Device);
    this.schedulerRepository = dataSource.getRepository(DeviceScheduler);
  }
  async findById(id: number) {
    const device = await this.repository.findOne({
      where: { id }
    });
    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }
    return device;
  }

  async findSchedulerById(id: number) {
    const scheduler = await this.schedulerRepository.findOne({
      where: { id }
    });
    if (!scheduler) {
      throw new Error(`Scheduler with id ${id} not found`);
    }
    return scheduler;
  }

  async findByName(name: string) {
    const device = await this.repository.findOne({
      where: { name }
    });
    if (!device) {
      throw new Error(`Device with email ${name} not found`);
    }
    return device;
  }

  private getDeviceSchedulers(deviceIds: number[]) {
    return this.schedulerRepository
      .createQueryBuilder("deviceScheduler")
      .where("deviceScheduler.deviceId IN (:...deviceIds)", {
        deviceIds: deviceIds
      })
      .getMany();
  }

  async getDeviceWithScheulers(id: number): Promise<DeviceResponseDTO> {
    const device = await this.findById(id);
    const rawSchedulers = await this.getDeviceSchedulers([id]);
    return DeviceResponseDTO.setSchedulersFromRawData(device, rawSchedulers);
  }
  // Lấy tất cả thiết bị
  async getDevices(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<PaginatedDevices> {
    const queryBuilder = this.repository.createQueryBuilder("device");
    if (keyword) {
      queryBuilder.where("device.search_vector @@ to_tsquery(:query)", {
        query: removeAccents(keyword).split(" ").join(" & ")
      });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [devices, total] = await queryBuilder.getManyAndCount();
    const rawSchedulers = await this.getDeviceSchedulers(
      devices.map(o => o.id)
    );
    const result = devices.map(device => {
      return DeviceResponseDTO.setSchedulersFromRawData(device, rawSchedulers);
    });
    return {
      pageIndex,
      pageSize,
      total,
      data: result
    };
  }

  async createDevice(createDeviceDTO: CreateDeviceDTO) {
    const errors = await validate(createDeviceDTO);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }
    const device = this.repository.create(createDeviceDTO);
    await this.repository.save(device);
    return device;
  }
  async createDeviceScheduler(
    createDeviceSchedulerDTO: CreateDeviceSchedulerDTO
  ) {
    const errors = await validate(createDeviceSchedulerDTO);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }
    const scheduler = this.schedulerRepository.create(createDeviceSchedulerDTO);
    await this.schedulerRepository.save(scheduler);
    return scheduler;
  }

  async updateDevice(id: number, updateData: Partial<Device>) {
    const device = await this.findById(id);
    const updatedDevice = Object.assign(device, updateData);
    await this.repository.save(updatedDevice);
    return updatedDevice;
  }

  async updateDeviceScheduler(
    id: number,
    updateData: Partial<DeviceScheduler>
  ) {
    const scheduler = await this.findSchedulerById(id);
    const updatedScheduler = Object.assign(scheduler, updateData);
    await this.schedulerRepository.save(updatedScheduler);
    return updatedScheduler;
  }

  async deleteScheduler(id: number) {
    const scheduler = await this.findSchedulerById(id);
    await this.schedulerRepository.remove(scheduler);
  }

  async deleteDevice(id: number) {
    return this._dataSource.transaction(async manager => {
      const deviceExists = await manager
        .createQueryBuilder(Device, "device")
        .where("device.id = :id", { id })
        .getOne();

      if (!deviceExists) {
        throw new Error("Device not found");
      }

      await manager.getRepository(Device).remove(deviceExists);
      await manager
        .createQueryBuilder()
        .delete()
        .from(DeviceScheduler)
        .where("deviceId = :id", { id })
        .execute();

      return id;
    });
  }
}

export default DeviceRepository;

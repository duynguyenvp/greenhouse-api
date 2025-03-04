import "dotenv/config";
import { removeEmptyFields } from "../utils/removeEmptyFields";
import SensorRepository from "../db/repositories/sensorRepository";
import { CreateSensorDataDTO, CreateSensorDTO } from "../dto/sensor.dto";
import { Sensor } from "../db/models/Sensor";
import { SensorData } from "../db/models/SensorData";
import { DeleteResult } from "typeorm";
import PaginatedSensors from "../dto/paginatedSensors.dto";

export default class SensorController {
  private sensorRepository: SensorRepository;
  constructor(sensorRepository: SensorRepository) {
    this.sensorRepository = sensorRepository;
  }

  async createSensor(input: CreateSensorDTO): Promise<Sensor> {
    const device = await this.sensorRepository.createSensor(input);
    return device;
  }

  async createSensorData(input: CreateSensorDataDTO): Promise<SensorData> {
    const sdata = await this.sensorRepository.createSensorData(input);
    return sdata;
  }

  async updateSensor(id: number, data: Partial<Sensor>): Promise<Sensor> {
    const updateData = removeEmptyFields(data);
    return this.sensorRepository.updateSensor(id, updateData);
  }

  async deleteSensor(id: number): Promise<DeleteResult> {
    return await this.sensorRepository.deleteSensor(id);
  }

  async getSensor(id: number): Promise<any> {
    const sensor = await this.sensorRepository.getSensor(id);
    if (!sensor) {
      throw new Error("Sensor not found");
    }
    return sensor;
  }

  async getLatestSensorDataByIds(ids: number[]) {
    return this.sensorRepository.getLatestSensorDataByIds(ids);
  }

  async getSensors(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<PaginatedSensors> {
    return this.sensorRepository.getSensors(pageIndex, pageSize, keyword);
  }
}

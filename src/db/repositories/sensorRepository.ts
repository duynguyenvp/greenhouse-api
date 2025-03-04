import { validate } from "class-validator";
import { DataSource, Repository } from "typeorm";
import { removeAccents } from "../../utils/removeAccents";
import { Sensor } from "../models/Sensor";
import { SensorData } from "../models/SensorData";
import { CreateSensorDataDTO, CreateSensorDTO } from "src/dto/sensor.dto";

class SensorRepository {
  private repository: Repository<Sensor>;
  private sensorDataRepository: Repository<SensorData>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Sensor);
    this.sensorDataRepository = dataSource.getRepository(SensorData);
  }
  async findById(id: number) {
    const device = await this.repository.findOne({
      where: { id }
    });
    if (!device) {
      throw new Error(`Sensor with id ${id} not found`);
    }
    return device;
  }

  async findByName(name: string) {
    const device = await this.repository.findOne({
      where: { name }
    });
    if (!device) {
      throw new Error(`Sensor with name ${name} not found`);
    }
    return device;
  }

  async getLatestSensorData() {
    return await this.sensorDataRepository
      .createQueryBuilder("sensorData")
      .innerJoin(
        qb =>
          qb
            .select("sensorId, MAX(timestamp) as maxTimestamp")
            .from(SensorData, "sd")
            .groupBy("sensorId"),
        "latest",
        "sensorData.sensorId = latest.sensorId AND sensorData.timestamp = latest.maxTimestamp"
      )
      .getMany();
  }

  async getLatestSensorDataByIds(sensorIds: number[]) {
    return await this.sensorDataRepository
      .createQueryBuilder("sensorData")
      .innerJoin(
        qb =>
          qb
            .select("sensorId, MAX(timestamp) as maxTimestamp")
            .from(SensorData, "sd")
            .where("sensorId IN (:...sensorIds)", { sensorIds })
            .groupBy("sensorId"),
        "latest",
        "sensorData.sensorId = latest.sensorId AND sensorData.timestamp = latest.maxTimestamp"
      )
      .getMany();
  }

  async getMultipleLatestSensorData(sensorIds: number[], limit: number = 10) {
    const latestData = await this.sensorDataRepository
      .createQueryBuilder("sensorData")
      .where("sensorData.sensorId IN (:...sensorIds)", { sensorIds })
      .orderBy("sensorData.sensorId", "ASC") // Nhóm theo cảm biến
      .addOrderBy("sensorData.timestamp", "DESC") // Lấy mới nhất trước
      .limit(sensorIds.length * limit) // Mỗi sensor lấy 10 bản ghi
      .getMany();
    return latestData;
  }

  async getSensor(id: number): Promise<any> {
    const sensor = await this.findById(id);
    const data = await this.getMultipleLatestSensorData([id]);
    return { ...sensor, data };
  }
  // Lấy tất cả thiết bị
  async getSensors(
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder("sensor");
    if (keyword) {
      queryBuilder.where("sensor.search_vector @@ to_tsquery(:query)", {
        query: removeAccents(keyword).split(" ").join(" & ")
      });
    }
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);
    const [sensors, total] = await queryBuilder.getManyAndCount();
    if (total === 0)
      return {
        pageIndex,
        pageSize,
        total,
        data: []
      };
    const data = await this.getMultipleLatestSensorData(sensors.map(o => o.id));
    const result = sensors.map(sensor => {
      const filteredData = data.filter(f => f.sensorId === sensor.id);
      return { ...sensor, data: filteredData };
    });
    return {
      pageIndex,
      pageSize,
      total,
      data: result
    };
  }

  async createSensor(createSensorDTO: CreateSensorDTO) {
    const errors = await validate(createSensorDTO);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }
    const device = this.repository.create(createSensorDTO);
    await this.repository.save(device);
    return device;
  }
  async createSensorData(createSensorDataDTO: CreateSensorDataDTO) {
    const errors = await validate(createSensorDataDTO);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }
    const sensorData = this.sensorDataRepository.create(createSensorDataDTO);
    await this.sensorDataRepository.save(sensorData);
    return sensorData;
  }

  async updateSensor(id: number, updateData: Partial<Sensor>) {
    const sensor = await this.findById(id);
    const updatedSensor = Object.assign(sensor, updateData);
    await this.repository.save(updatedSensor);
    return updatedSensor;
  }

  async deleteSensor(id: number) {
    return this.repository.delete(id);
  }
}

export default SensorRepository;

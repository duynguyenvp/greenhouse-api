import express from "express";

import logger from "../logger";
import dataSource from "../db/dataSource";
import SensorController from "../controllers/sensor.controller";
import SensorRepository from "../db/repositories/sensorRepository";

const router = express.Router();

const getController = () =>
  new SensorController(new SensorRepository(dataSource));

router.put("/create", async (req, res) => {
  try {
    const { name, command, type, unit, location } = req.body;
    const result = await getController().createSensor({
      name,
      command,
      type,
      unit,
      location
    });
    res.success(result);
  } catch (error: any) {
    logger.error("failed to create sensor:" + JSON.stringify(error));
    res.error("failed to create sensor", 500, error.message);
  }
});

router.put("/createSensorData", async (req, res) => {
  try {
    const { sensorId, value } = req.body;
    const result = await getController().createSensorData({
      sensorId,
      value
    });
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to add sensor data:" + JSON.stringify(error));
    res.error("Failed to add sensor data", 500, error.message);
  }
});

router.post("/update", async (req, res) => {
  try {
    const { id, name, command, type, unit, location } = req.body;
    const result = await getController().updateSensor(id, {
      name,
      command,
      type,
      unit,
      location
    });
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to update sensor:" + JSON.stringify(error));
    res.error("Failed to update sensor", 500, error.message);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await getController().deleteSensor(id);
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to delete sensor:" + JSON.stringify(error));
    res.error("Failed to delete sensor", 500, error.message);
  }
});

router.get("/getSensor/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getController().getSensor(Number(id));
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to get sensor:" + JSON.stringify(error));
    res.error("Failed to get sensor", 500, error.message);
  }
});

router.get("/getSensors/:pageIndex/:pageSize/:keyword?", async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex;
    const pageSize = req.params.pageSize;
    const keyword = req.params.keyword;
    const result = await getController().getSensors(
      Number(pageIndex),
      Number(pageSize),
      keyword ?? ""
    );
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to get sensors:" + JSON.stringify(error));
    res.error("Failed to get sensors", 500, error.message);
  }
});

export default router;

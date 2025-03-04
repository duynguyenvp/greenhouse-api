import express from "express";

import logger from "../logger";
import dataSource from "../db/dataSource";
import DeviceController from "../controllers/device.controller";
import DeviceRepository from "../db/repositories/deviceRepository";

const router = express.Router();

const getController = () =>
  new DeviceController(new DeviceRepository(dataSource));

router.put("/create", async (req, res) => {
  try {
    const { name, command, type, status } = req.body;
    const result = await getController().createDevice({
      name,
      command,
      type,
      status
    });
    res.success(result);
  } catch (error: any) {
    logger.error("device Creation failed:" + JSON.stringify(error));
    res.error("device Creation failed", 500, error.message);
  }
});

router.put("/createScheduler", async (req, res) => {
  try {
    const { deviceId, scheduler, status } = req.body;
    const result = await getController().createDeviceScheduler({
      deviceId,
      scheduler,
      status
    });
    res.success(result);
  } catch (error: any) {
    logger.error("Scheduler Creation failed:" + JSON.stringify(error));
    res.error("Scheduler Creation failed", 500, error.message);
  }
});

router.post("/updateScheduler", async (req, res) => {
  try {
    const { id, scheduler, status } = req.body;
    const result = await getController().updateDeviceScheduler(id, {
      scheduler,
      status
    });
    res.success(result);
  } catch (error: any) {
    logger.error("Scheduler Updation failed:" + JSON.stringify(error));
    res.error("Scheduler Updation failed", 500, error.message);
  }
});

router.post("/update", async (req, res) => {
  try {
    const { id, name, command, type, status } = req.body;
    const result = await getController().updateDevice(id, {
      name,
      command,
      type,
      status
    });
    res.success(result);
  } catch (error: any) {
    logger.error("Device Updation failed:" + JSON.stringify(error));
    res.error("Device Updation failed", 500, error.message);
  }
});

router.delete("/deleteDevice", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await getController().deleteDevice(id);
    res.success(result);
  } catch (error: any) {
    logger.error("Device Deletion failed:" + JSON.stringify(error));
    res.error("Device Deletion failed", 500, error.message);
  }
});

router.delete("/deleteScheduler", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await getController().deleteDeviceScheduler(id);
    res.success(result);
  } catch (error: any) {
    logger.error("Device Deletion failed:" + JSON.stringify(error));
    res.error("Device Deletion failed", 500, error.message);
  }
});

router.get("/getDevice/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getController().getDevice(Number(id));
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to get device:" + JSON.stringify(error));
    res.error("Failed to get device", 500, error.message);
  }
});

router.get("/getDevices/:pageIndex/:pageSize/:keyword?", async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex;
    const pageSize = req.params.pageSize;
    const keyword = req.params.keyword;
    const result = await getController().getDevices(
      Number(pageIndex),
      Number(pageSize),
      keyword ?? ""
    );
    res.success(result);
  } catch (error: any) {
    logger.error("Failed to get devices:" + JSON.stringify(error));
    res.error("Failed to get devices", 500, error.message);
  }
});

export default router;

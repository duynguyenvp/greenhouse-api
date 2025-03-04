import express from "express";

import logger from "../logger";
import verifyToken from "../middlewares/authentication";
import dataSource from "../db/dataSource";
import AuthController from "../controllers/auth.controller";
import UserRepository from "../db/repositories/userRepository";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, username, phone_number, password } = req.body;
    const authController = new AuthController(new UserRepository(dataSource));
    const result = await authController.register({
      name,
      username,
      phone_number,
      password
    });
    res.success(result);
  } catch (error: any) {
    logger.error("Registration failed:" + JSON.stringify(error));
    res.error("Registration failed", 500, error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const authController = new AuthController(new UserRepository(dataSource));
    const result = await authController.login({ username, password });
    res.success(result);
  } catch (error: any) {
    logger.error("Login failed: " + JSON.stringify(error));
    res.error("Login failed", 401, error.message);
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const authController = new AuthController(new UserRepository(dataSource));
    const result = await authController.refreshToken(refreshToken);

    res.success(result);
  } catch (error) {
    logger.error("Invalid refresh token: " + JSON.stringify(error));
    return res.error("Invalid refresh token.", 400);
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { id } = req.user ?? {};
    const authController = new AuthController(new UserRepository(dataSource));
    const result = await authController.profile({ id });
    res.success(result);
  } catch (error: any) {
    logger.error("Get profile failed: " + JSON.stringify(error));
    res.error("Get profile failed", 401, error.message);
  }
});

export default router;

import express from "express";
import auth from "./auth";
import device from "./device";
import sensor from "./sensor";

const router = express.Router();

router.use("/auth", auth);
router.use("/device", device);
router.use("/sensor", sensor);
router.get("/health-check", (_req, res) => {
  res.json({
    message: "I'm fine!!!"
  });
});

export default router;

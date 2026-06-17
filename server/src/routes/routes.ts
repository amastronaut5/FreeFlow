import { Router } from "express";
import { upload } from "../services/upload.js";
import { checkViolationsHandler } from "../controllers/vehicleController.js";
export const router = Router();

router.post("/image/checkViolations", upload.single('file'),checkViolationsHandler);
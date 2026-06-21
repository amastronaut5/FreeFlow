import { Router } from "express";
import { upload } from "../services/upload.js";
import { checkViolationsHandler } from "../controllers/vehicleController.js";
import { getViolationById, getViolations, searchViolations, updateViolationStatus } from "../controllers/crudControllers.js";
export const router = Router();

router.post("/image/checkViolations", upload.single('file'),checkViolationsHandler);
router.get("/violations", getViolations);
router.get("/violations/search", searchViolations);
router.get( "/violations/:id", getViolationById);
router.patch("/violations/:id/status", updateViolationStatus);
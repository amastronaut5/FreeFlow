import { detectVehicle } from "../services/detectVehicle.js";
import { detectViolations, getAllViolations } from "../services/detectViolations.js";
import { matchViolations } from "../services/matchViolations.js";
import fs from 'node:fs/promises';
import type{ Request, Response } from "express";
import { processMatchedVehicles } from "../services/processMatchedVehicles.js";

export const checkViolationsHandler =async(req:Request, res: Response)=>{
    let imagePath: string | undefined;
    try{
        imagePath = req.file?.path;
        if (!imagePath) {
          return res.status(400).json({
            success: false,
            message: "Please upload a valid image file",
          });
        }
        const vehicles = await detectVehicle(imagePath);
        const detected = await detectViolations(imagePath);
        const violations = getAllViolations(detected);
        const matchedVehicles = matchViolations(vehicles, violations);
        const imageBuffer = await fs.readFile(imagePath);
        const processedVehicles = await processMatchedVehicles(matchedVehicles, imageBuffer);

        
        return res.status(200).json({
        success: true,
        message: "Violations processed successfully",
        data: processedVehicles
      });
    }
    catch(err){
        console.error("Detection Error:", err);
        return res.status(500).json({
          success: false,
          message: "Error encountered! Please try again later",
        });
    }finally {
    if (imagePath) {
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }
  }
};
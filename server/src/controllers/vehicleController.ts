import { detectVehicle } from "../services/detectVehicle.js";
import { detectViolations, getAllViolations } from "../services/detectViolations.js";
import { matchViolations } from "../services/matchViolations.js";
import type{ Request, Response } from "express";
import { processMatchedVehicles } from "../services/processMatchedVehicles.js";
import { detectTripleRiding } from "../services/detectTripleRiding.js";
export const checkViolationsHandler =async(req:Request, res: Response)=>{
    try{
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
          return res.status(400).json({
            success: false,
            message: "Please upload a valid image file",
          });
        }
        console.log("Image received");
        const vehicles = await detectVehicle(imageBuffer);
        console.log("Vehicle detection done");
        const detected = await detectViolations(imageBuffer);
        console.log("Violation detection done");
        const tripleRidingViolations = await detectTripleRiding(imageBuffer);
        detected.tripleRidingViolations = tripleRidingViolations;
        console.log("Triple-Riding detection done");
        const violations = getAllViolations(detected);
        const matchedVehicles = matchViolations(vehicles, violations);
        console.log("Matching done");
        const processedVehicles = await processMatchedVehicles(matchedVehicles, imageBuffer);
        console.log("Processing done", processedVehicles.length);
        if (processedVehicles.length === 0) {
          return res.status(200).json({
            success: true,
            message: "No violations detected",
            data: [],
          });
        }
        return res.status(200).json({
        success: true,
        message: "Violations processed successfully! Navigate to the detection dashboard for details",
        data: processedVehicles
      });
    }
    catch(err){
        console.error("Detection Error:", err);
        return res.status(500).json({
          success: false,
          message: "Error encountered! Please try again later",
        });
    }
};
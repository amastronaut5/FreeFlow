import { detectPlate } from "../services/getPlateNumber.js";
import fs from 'node:fs/promises';
import type{ Request, Response } from "express";
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
        const result = await detectPlate(imagePath);
        return res.status(200).json({
            success: true,
            message: "Vehicle analyzed successfully",
            data: result,
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
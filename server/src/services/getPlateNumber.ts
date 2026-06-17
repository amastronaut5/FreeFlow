import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL;
const ai = new GoogleGenAI({
    apiKey: `${GEMINI_API_KEY}`
});

export async function detectPlate(filePath: string){
  const base64ImageFile = fs.readFileSync(`${filePath}`, {
      encoding: "base64",
  });
  
  const response = await ai.models.generateContent({
      model: `${GEMINI_MODEL}`,
      contents: [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64ImageFile,
          },
        },
        `
          Analyze this vehicle image.
              
          Return ONLY valid JSON in the format:
              
          {
            "vehicleType": "",
            "numberPlate": "",
            "confidence": 0
          }
              
          If no plate is detected:
              
          {
            "vehicleType": "",
            "numberPlate": null,
            "confidence": 0
          }
          `
      ],
      config: {
        responseMimeType: "application/json",
      },
  });
  const result = JSON.parse(response.text!);
  console.log(result);
  return result;
}
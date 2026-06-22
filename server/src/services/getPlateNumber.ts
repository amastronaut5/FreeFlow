import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export interface PlateDetectionResult {
  numberPlate: string | null;
  confidence: number;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function detectPlate(
  imageBuffer: Buffer,
  mimeType = "image/jpeg"
): Promise<PlateDetectionResult> {
  try {
    const imageBase64 =
      imageBuffer.toString("base64");

    const response =
      await ai.models.generateContent({
        model:
          process.env.GEMINI_MODEL!,

        contents: [
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },

          `
Analyze this traffic image and identify the vehicle registration number.

Rules:
- Return ONLY valid JSON.
- Remove all spaces from the plate number.
- Convert letters to uppercase.
- Confidence must be between 0 and 1.
- If the plate is unreadable or not visible, return null.
- Do not return markdown.
- Do not return explanations.

Example:

{
  "numberPlate": "PB02AB1234",
  "confidence": 0.95
}
          `,
        ],

        config: {
          responseMimeType:
            "application/json",
        },
      });

    const parsed = JSON.parse(
      response.text ?? "{}"
    );

    const numberPlate =
      parsed.numberPlate
        ?.replace(/\s+/g, "")
        ?.toUpperCase() ?? null;

    const confidence =
      typeof parsed.confidence ===
      "number"
        ? parsed.confidence
        : 0;

    if (
      !numberPlate ||
      confidence < 0.7
    ) {
      return {
        numberPlate: null,
        confidence,
      };
    }

    return {
      numberPlate,
      confidence,
    };
  } catch (error) {
    console.error(
      "Plate Detection Error:",
      error
    );

    return {
      numberPlate: null,
      confidence: 0,
    };
  }
}
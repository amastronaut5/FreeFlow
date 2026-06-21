import fs from "node:fs/promises";
import dotenv from "dotenv";

dotenv.config();

export interface VehicleDetection {
  class: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

function normalizeDetections(
  result: any
): VehicleDetection[] {
  const predictions =
    result.outputs[0]
      .model_output.predictions;

  return predictions
    .filter((prediction: any) =>
      [
        "car",
        "truck",
        "bus",
        "motorcycle",
      ].includes(prediction.class)
    )
    .map((prediction: any) => ({
      class: prediction.class,
      confidence:
        prediction.confidence,
      bbox: {
        x: prediction.x,
        y: prediction.y,
        width: prediction.width,
        height: prediction.height,
      },
    }));
}

export async function detectVehicle(
  imagePath: string
): Promise<VehicleDetection[]> {
  const imageBuffer =
    await fs.readFile(imagePath);

  const base64Image =
    imageBuffer.toString("base64");

  const response = await fetch(
    process.env
      .VEHICLE_MODEL_URL!,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        api_key:
          process.env
            .VEHICLE_DETECTION_API_KEY,

        inputs: {
          image: {
            type: "base64",
            value: base64Image,
          },
        },
      }),
    }
  );
  console.log(response)
  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      `Vehicle detection failed: ${error}`
    );
  }

  const result =
    await response.json();

  return normalizeDetections(
    result
  );
}
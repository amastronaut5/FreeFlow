import fs from "node:fs/promises";

export interface ViolationDetection {
  type: string;

  confidence: number;

  x: number;
  y: number;

  width: number;
  height: number;
}

export interface DetectedViolations {
  helmetViolations: ViolationDetection[];

  seatbeltViolations: ViolationDetection[];

  tripleRidingViolations: ViolationDetection[];

  wrongSideViolations: ViolationDetection[];

  redLightViolations: ViolationDetection[];

  illegalParkingViolations: ViolationDetection[];

  evidenceImage?: string;
}

function normalizeViolations(
  result: any
): DetectedViolations {
  const output =
    result.outputs?.[0];

  if (!output) {
    throw new Error(
      "Violations output not found"
    );
  }

  const helmetPredictions =
    output
      ?.helmet_model_1_output_2
      ?.flatMap(
        (item: any) =>
          item.predictions ?? []
      ) ?? [];

  const seatbeltPredictions =
    output
      ?.seatbelt_model_2_output
      ?.flatMap(
        (item: any) =>
          item.predictions ?? []
      ) ?? [];

  const helmetViolations =
    helmetPredictions
      .filter(
        (prediction: any) =>
          prediction.class ===
          "Without Helmet"
      )
      .map(
        (prediction: any): ViolationDetection => ({
          type:
            "helmet_non_compliance",

          confidence:
            prediction.confidence,

          x:
            prediction.parent_origin
              ? prediction.parent_origin
                  .offset_x +
                prediction.x
              : prediction.x,

          y:
            prediction.parent_origin
              ? prediction.parent_origin
                  .offset_y +
                prediction.y
              : prediction.y,

          width:
            prediction.width,

          height:
            prediction.height,
        })
      );

  const seatbeltViolations =
    seatbeltPredictions
      .filter(
        (prediction: any) =>
          prediction.class ===
            "No Seatbelt" ||
          prediction.class ===
            "Without Seatbelt"
      )
      .map(
        (prediction: any): ViolationDetection => ({
          type:
            "seatbelt_non_compliance",

          confidence:
            prediction.confidence,

          x:
            prediction.parent_origin
              ? prediction.parent_origin
                  .offset_x +
                prediction.x
              : prediction.x,

          y:
            prediction.parent_origin
              ? prediction.parent_origin
                  .offset_y +
                prediction.y
              : prediction.y,

          width:
            prediction.width,

          height:
            prediction.height,
        })
      );

  console.log(
    "Helmet Violations:",
    helmetViolations
  );

  console.log(
    "Seatbelt Violations:",
    seatbeltViolations
  );

  const evidenceImage =
    output
      ?.bounding_box_visualization_output?.[0]
      ?.value;

  return {
    helmetViolations,

    seatbeltViolations,

    tripleRidingViolations:
      [],

    wrongSideViolations:
      [],

    redLightViolations:
      [],

    illegalParkingViolations:
      [],

    evidenceImage,
  };
}

export function getAllViolations(
  detected: DetectedViolations
): ViolationDetection[] {
  return [
    ...detected.helmetViolations,

    ...detected.seatbeltViolations,

    ...detected.tripleRidingViolations,

    ...detected.wrongSideViolations,

    ...detected.redLightViolations,

    ...detected.illegalParkingViolations,
  ];
}

export async function detectViolations(
  imagePath: string
): Promise<DetectedViolations> {
  try {
    const imageBuffer =
      await fs.readFile(
        imagePath
      );

    const base64Image =
      imageBuffer.toString(
        "base64"
      );

    const response =
      await fetch(
        process.env
          .VIOLATION_MODEL_URL!,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            api_key:
              process.env
                .VIOLATION_MODEL_API_KEY,

            inputs: {
              image: {
                type: "base64",

                value:
                  base64Image,
              },
            },
          }),
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Violation detection failed (${response.status}): ${errorText}`
      );
    }

    const result =
      await response.json();

    return normalizeViolations(
      result
    );
  } catch (error) {
    console.error(
      "Violation Detection Error:",
      error
    );

    throw error;
  }
}
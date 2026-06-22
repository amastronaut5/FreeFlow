import { cropOffendingVehicle } from "./cropOffendingVehicle.js";
import { detectPlate } from "./getPlateNumber.js";
import { uploadEvidence } from "./uploadEvidence.js";
import { saveViolation } from "./saveViolation.js";

import type { MatchedVehicleViolation } from "./matchViolations.js";

export async function processMatchedVehicles(
  matchedVehicles: MatchedVehicleViolation[],
  imageBuffer: Buffer
): Promise<any[]> {

  const results =
    await Promise.all(
      matchedVehicles.map(
        async (
          match,
          index
        ) => {
          try {
            const crop =
              await cropOffendingVehicle(
                imageBuffer,
                match.vehicle
              );

            const plateResult =
              await detectPlate(
                crop
              );

            const plateNumber =
              plateResult.numberPlate ??
              "NOT_DETECTED";

            console.log(
              `Vehicle ${index} OCR Result:`,
              {
                plateNumber,
                confidence:
                  plateResult.confidence,
              }
            );

            const evidenceImageUrl =
              await uploadEvidence(
                crop
              );

            const savedViolation =
              await saveViolation({
                plateNumber,

                vehicleType:
                  match.vehicle.class,

                violations:
                  match.violations,

                evidenceImageUrl,
              });

            return savedViolation;
          } catch (error) {
            console.error(
              `Failed processing vehicle ${index}:`,
              error
            );

            return null;
          }
        }
      )
    );

  return results.filter(
    Boolean
  );
}
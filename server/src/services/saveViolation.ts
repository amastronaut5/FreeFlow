import { ViolationModel } from "../models/Violation.js";

interface SaveViolationParams {
  plateNumber: string | null;

  vehicleType: string;

  violations: {
    type: string;
    confidence: number;
  }[];

  evidenceImageUrl: string;

  location?: string;
}

export async function saveViolation({
  plateNumber,
  vehicleType,
  violations,
  evidenceImageUrl,
  location = "Unknown",
}: SaveViolationParams) {
  return ViolationModel.create({
    plateNumber:
      plateNumber ?? "",

    vehicleType,

    violations,

    evidenceImageUrl,

    location,

    status: "Pending",

    detectedAt: new Date(),
  });
}
import mongoose, { Schema } from "mongoose";

interface IDetectedViolation {
  type: string;
  confidence: number;
}

export interface IViolation {
  plateNumber: string;
  vehicleType: string;

  violations: IDetectedViolation[];

  evidenceImageUrl: string;
  location: string;

  status: "Pending" | "Confirmed" | "Dismissed";

  detectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const detectedViolationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  { _id: false }
);
const violationSchema = new Schema<IViolation>(
  {
    plateNumber: {
      type: String,
      default: "",
      index: true,
    },

    vehicleType: {
      type: String,
      required: true,
    },

    violations: {
      type: [detectedViolationSchema],
      required: true,
      default: [],
    },

    evidenceImageUrl: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Unknown",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Dismissed"],
      default: "Pending",
    },

    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
export const ViolationModel =
  mongoose.model<IViolation>(
    "Violation",
    violationSchema
  );
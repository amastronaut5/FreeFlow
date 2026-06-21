import type{ Dispatch, SetStateAction } from "react";
export interface DetectedViolation {
  type: string;
  confidence: number;
}

export interface Detection {
  _id: string;
  plateNumber: string;
  vehicleType: string;
  evidenceImageUrl: string;
  location: string;
  status: "Pending" | "Confirmed" | "Dismissed";
  detectedAt: string;
  violations: DetectedViolation[];
}
export interface DetectionsProps {
  violations: Detection[];
  setViolations: Dispatch<
    SetStateAction<Detection[]>
  >;
}
export interface StatsGridProps {
  violations: Detection[];
}

export interface DetectionsPageProps
  extends DetectionsProps {
  loading: boolean;
}
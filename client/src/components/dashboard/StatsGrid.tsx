import StatCard from "./StatCard";
import type{ StatsGridProps } from "../../types/Detection";

export default function StatsGrid({
  violations,
  }: StatsGridProps) {
  const totalDetections =
    violations.length;

  const confirmedViolations =
    violations.filter(
      (v) => v.status === "Confirmed"
    ).length;

  const pendingViolations =
    violations.filter(
      (v) => v.status === "Pending"
    ).length;

  const confidences =
    violations.flatMap((v) =>
      v.violations.map(
        (violation) =>
          violation.confidence
      )
    );

  const averageConfidence =
    confidences.length > 0
      ? (
          confidences.reduce(
            (sum, confidence) =>
              sum + confidence,
            0
          ) /
          confidences.length
        ) * 100
      : 0;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Detections"
        value={totalDetections}
      />

      <StatCard
        title="Confirmed Violations"
        value={confirmedViolations}
      />

      <StatCard
        title="Pending Review"
        value={pendingViolations}
      />

      <StatCard
        title="Average Confidence"
        value={`${averageConfidence.toFixed(
          1
        )}%`}
      />
    </section>
  );
}
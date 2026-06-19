import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Detections"
        value="--"
        change="+0%"
      />

      <StatCard
        title="Confirmed Violations"
        value="--"
        change="+0%"
      />

      <StatCard
        title="Dismissed Cases"
        value="--"
        change="+0%"
      />

      <StatCard
        title="Average Confidence"
        value="--%"
        change="+0%"
      />
    </section>
  );
}
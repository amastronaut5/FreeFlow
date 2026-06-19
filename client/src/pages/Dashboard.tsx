import StatsGrid from "../components/dashboard/StatsGrid";
import ChartSection from "../components/dashboard/ChartSection";

export default function Dashboard() {
  return (
    <div className="space-y-6 my-5 mx-5">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-foreground mt-5">
          Dashboard
        </h1>

        <p className="mt-1 text-muted mb-5">
          Monitor traffic violations and analytics
        </p>
      </div>

      {/* Statistics */}

      <StatsGrid />

      {/* Charts */}

      <ChartSection />
    </div>
  );
}
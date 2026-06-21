import type { StatsGridProps } from "../../types/Detection";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell} from "recharts";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function ChartSection({
  violations,
}: StatsGridProps) {
  const trendData = Object.values(
    violations.reduce(
      (acc, violation) => {
        const date = new Date(
          violation.detectedAt
        ).toLocaleDateString();

        if (!acc[date]) {
          acc[date] = {
            date,
            count: 0,
          };
        }

        acc[date].count++;

        return acc;
      },
      {} as Record<
        string,
        {
          date: string;
          count: number;
        }
      >
    )
  ).sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  const distributionData = Object.entries(
    violations
      .flatMap((v) => v.violations)
      .reduce((acc, violation) => {
        acc[violation.type] =
          (acc[violation.type] || 0) + 1;

        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* Violation Trends */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Violation Trends
          </h2>

          <p className="text-sm text-muted">
            Track violations over time
          </p>
        </div>

        <div className="h-75">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Violation Distribution */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Violation Distribution
          </h2>

          <p className="text-sm text-muted">
            Breakdown by violation type
          </p>
        </div>

        <div className="h-75">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
              >
                {distributionData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
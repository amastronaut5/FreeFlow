export default function ChartSection() {
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

        <div className="flex h- items-center justify-center rounded-xl border border-dashed border-border bg-background">
          <span className="text-muted">
            Line Chart Placeholder
          </span>
        </div>
      </div>

      {/* Distribution */}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Violation Distribution
          </h2>

          <p className="text-sm text-muted">
            Breakdown by violation type
          </p>
        </div>

        <div className="flex h- items-center justify-center rounded-xl border border-dashed border-border bg-background">
          <span className="text-muted">
            Pie Chart Placeholder
          </span>
        </div>
      </div>
    </section>
  );
}
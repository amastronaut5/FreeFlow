interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down";
}

export default function StatCard({
  title,
  value,
  change,
  trend = "up",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-card-foreground">
            {value}
          </h3>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            trend === "up"
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {change}
        </div>
      </div>
    </div>
  );
}
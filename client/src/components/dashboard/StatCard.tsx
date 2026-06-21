interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <p className="text-sm text-muted">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-card-foreground">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-sm text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
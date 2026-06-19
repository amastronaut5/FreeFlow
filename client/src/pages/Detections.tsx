import { Eye } from "lucide-react";
export default function Detections() {
  return (
    <div className="space-y-6 my-5 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Detections
          </h1>

          <p className="mt-1 text-muted">
            Review and manage detected violations
          </p>
        </div>

        <button className="rounded-xl bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90">
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex-1">
            <input
              placeholder="Search detections..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">
              All
            </button>

            <button className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-background">
              Unreviewed
            </button>

            <button className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-background">
              Confirmed
            </button>

            <button className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-background">
              Dismissed
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full">
          <thead className="border-b border-border bg-background">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Image
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Violation
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Location
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Time
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Confidence
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Row Skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-border transition hover:bg-background"
              >
                <td className="px-6 py-4">
                  <div className="h-16 w-24 rounded-lg bg-secondary" />
                </td>

                <td className="px-6 py-4">
                  <div>
                    <div className="h-4 w-32 rounded bg-secondary" />
                    <div className="mt-2 h-3 w-20 rounded bg-secondary" />
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-40 rounded bg-secondary" />
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-20 rounded bg-secondary" />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-10 rounded bg-secondary" />

                    <div className="h-2 w-24 rounded-full bg-secondary" />
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-8 w-24 rounded-full bg-warning/20" />
                </td>

                <td className="px-6 py-4">
                    <button onClick={() => {}} className=" flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-all hover:bg-background   hover:border-primary ">
                        <Eye size={16} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
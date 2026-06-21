import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
          <AlertTriangle
            size={40}
            className="text-primary"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-extrabold text-foreground">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-foreground">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-muted">
          The page you're looking for
          doesn't exist or may have
          been moved.
        </p>

        {/* Action */}
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
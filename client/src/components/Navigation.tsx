import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold hover:text-indigo-200 transition">
            🚗 FreeFlow
          </Link>

          <div className="flex gap-6">
            <Link
              to="/"
              className="hover:text-indigo-200 transition font-medium"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="hover:text-indigo-200 transition font-medium"
            >
              Upload
            </Link>
            <Link
              to="/history"
              className="hover:text-indigo-200 transition font-medium"
            >
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

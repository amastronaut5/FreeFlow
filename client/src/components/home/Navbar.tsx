import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className=" flex items-center justify-between rounded-2xl border border-border bg-card/80 px-6 py-4 shadow-sm backdrop-blur-xl"
        >
          {/* Logo */}
            <div>
              <h1
                className=" text-2xl font-extrabold tracking-tight text-sidebar"
              >
                FreeFlow
              </h1>
          </div>
          {/* Actions */}

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className=" rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
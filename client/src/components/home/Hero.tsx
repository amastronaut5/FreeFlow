import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[85vh] items-center">
      <div className="max-w-5xl">
        {/* Badge */}

        <div
          className=" mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary
        "
        >
          AI Powered Traffic Monitoring
        </div>

        {/* Heading */}

        <h1
          className=" text-7xl font-extrabold leading-[0.95] tracking-tight text-sidebar xl:text-8xl
        "
        >
          Smart Traffic
          <br />

          <span
            className=" bg-linear-to-r from-primary via-[#8b7dff] to-primary bg-clip-text text-transparent"
          >
            Violation Detection
          </span>
        </h1>

        {/* Description */}

        <p
          className=" mt-8 max-w-3xl text-xl leading-relaxed text-muted
        "
        >
          Detect helmet violations, triple riding,
          wrong-side driving and illegal parking
          using AI-powered computer vision.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105
          "
          >
            Get Started
          </button>

          <button
            className="cursor-pointer rounded-2xl border border-border bg-card px-8 py-4 text-lg font-medium transition-all hover:bg-secondary
          "
          >
            Watch Demo
          </button>
        </div>

      </div>
    </section>
  );
}
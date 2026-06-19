import { Upload } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}

      <div className="mb-10 flex justify-center items-center flex-col">
        <h1 className="text-4xl font-bold text-foreground">
          Upload Evidence
        </h1>

        <p className="mt-3 max-w-2xl text-muted text-center">
          Upload traffic images captured by surveillance cameras and let
          GridLockr automatically detect violations using AI.
        </p>
      </div>

      {/* Upload Hero */}

      <div className="mb-10 flex justify-center">
        <div
          className=" relative w-full max-w-5xl overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-card p-16 text-center shadow-sm transition-all duration-300 hover:border-primary hover:shadow-xl">
          {/* Glow Effect */}

          <div className=" absolute inset-0 bg-primary/5 blur-3xl"/>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className=" mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10"
            >
              <Upload
                size={48}
                className="text-primary"
              />
            </div>

            <h2 className="text-3xl font-bold text-card-foreground">
              Drag & Drop Images
            </h2>

            <p className="mt-4 max-w-xl text-lg text-muted">
              Upload JPG, PNG or WEBP images and run AI-powered
              traffic violation detection.
            </p>

            <button
              className=" mt-8 rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-all hover:scale-105"
            >
              Browse Files
            </button>

            <p className="mt-4 text-sm text-muted">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}

      <div className="flex justify-center">
        <button className=" rounded-2xl bg-primary px-12 py-4 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg">
          Start Analysis
        </button>
      </div>
    </div>
  );
}
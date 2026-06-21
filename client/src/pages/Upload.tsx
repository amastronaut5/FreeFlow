import { Upload, ImageIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Loader } from "lucide-react";
const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface UploadPageProps {
  fetchViolations: () => Promise<void>;
}
export default function UploadPage({
  fetchViolations,
}: UploadPageProps) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string>("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
  return () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };
  }, [preview]);
  async function submitImage() {
    setLoading(true);
    const file = imageRef.current?.files?.[0];
    if(!file){
        setMessage("File not found!");
        setLoading(false);
        return;
    }
    try{
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_BACKEND_URL}/image/checkViolations`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to analyze image");
        }
        await fetchViolations();
        setMessage(data.message);

        console.log(data.data);
    }
    catch(err){
      console.error(err);

      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
    finally{
      setLoading(false);
      setTimeout(()=>{
        setMessage("");
        setFileName("");
        setPreview("");
      }, 2000);
      if (imageRef.current) {
        imageRef.current.value = "";
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      {message && (
        <div className="fixed top-4 left-1/2 z-50 bg-sidebar text-white px-6 py-4 rounded-2xl shadow-lg">
          {message}
        </div>
      )}
      <div className="mb-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Upload Image
        </h1>

        <p className="mt-3 max-w-2xl text-center text-muted-foreground">
          Upload surveillance images and let AI automatically detect
          traffic violations, vehicles, and incidents.
        </p>
      </div>

      {/* Upload Card */}

      <div className="flex justify-center">
        <div
          onClick={() =>{
            if (!loading) {
              imageRef.current?.click();
            }
          }}
          className="group relative w-full max-w-4xl cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-card p-14 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-xl"
        >
          {/* Glow */}

          <div className="absolute inset-0 bg-primary/5 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
              <Upload size={42} className="text-primary" />
            </div>

            <h2 className="text-2xl font-semibold">
              Upload Traffic Image
            </h2>

            <p className="mt-3 max-w-xl text-center text-muted-foreground">
              Drag and drop your image here or click anywhere
              inside this box to browse files.
            </p>

            <input
              ref={imageRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) =>{
                const file = e.target.files?.[0];
                if (!file) return;
                
                setFileName(file.name);
                if (preview) {
                  URL.revokeObjectURL(preview);
                }
                const newUrl = URL.createObjectURL(file);
                setPreview(newUrl);
              }
              }
            />
            <button
              className="cursor-pointer mt-8 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-all hover:scale-105"
            >
              Browse Images
            </button>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-6 max-h-64 rounded-2xl border"
              />
            )}
            {fileName && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border bg-muted/40 px-4 py-2">
                <ImageIcon size={18} />
                <span className="text-sm font-medium">
                  {fileName}
                </span>
              </div>
            )}

            <p className="mt-6 text-sm text-muted-foreground">
              JPG, PNG • Max size 10MB
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}

      <div className="mt-10 flex justify-center">
        <button
          onClick={submitImage} disabled={!fileName || loading}
          className="cursor-pointer rounded-2xl bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading?(<Loader className="h-5 w-5 animate-spin"></Loader>):(<span>Start Analysis</span>)}
        </button>
      </div>
    </div>
  );
}
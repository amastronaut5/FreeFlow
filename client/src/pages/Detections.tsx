import { Eye, Loader2, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type{ Detection, DetectionsPageProps } from "../types/Detection";
import { getViolationLabel } from "../utils/violationLabels";
const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Detections({
  violations,
  setViolations,
  loading
  }: DetectionsPageProps) {
  const [selectedViolation, setSelectedViolation] = useState<Detection | null>(null);
  const [newStatus, setNewStatus] = useState<"Pending" | "Confirmed" | "Dismissed">("Pending");
  const [updating, setUpdating] = useState(false);
  const [exportReport, setExportReport] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
  "All" | "Pending" | "Confirmed" | "Dismissed"
>("All");
  const filteredViolations = violations.filter(
    (violation) => {
      const matchesSearch =
        violation.plateNumber
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        violation.vehicleType
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        violation.location
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        violation.violations.some((v) =>
          v.type
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
        );

      const matchesStatus =
        activeFilter === "All"
          ? true
          : violation.status ===
            activeFilter;

      return (
        matchesSearch && matchesStatus
      );
    }
  );
  const updateStatus = async () => {
    if (!selectedViolation) return;

    try {
      setUpdating(true);

      await axios.patch(
        `${API_BACKEND_URL}/violations/${selectedViolation._id}/status`,
        {
          status: newStatus,
        }
      );

      setViolations((prev) =>
        prev.map((v) =>
          v._id === selectedViolation._id
            ? { ...v, status: newStatus }
            : v
        )
      );
      setSelectedViolation(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };
  const exportPDF = async () => {
  try {
    setExportReport(true);

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.text("Traffic Violation Monitoring System", 14, 20);

    doc.setFontSize(14);
    doc.text("Violation Report", 14, 30);

    doc.setFontSize(10);
    doc.text(
      `Generated On: ${new Date().toLocaleString()}`,
      14,
      38
    );

    // Summary Statistics
    const total = violations.length;

    const pending = violations.filter(
      (v) => v.status === "Pending"
    ).length;

    const confirmed = violations.filter(
      (v) => v.status === "Confirmed"
    ).length;

    const dismissed = violations.filter(
      (v) => v.status === "Dismissed"
    ).length;

    doc.setFontSize(12);
    doc.text(`Total Violations: ${total}`, 14, 50);
    doc.text(`Pending: ${pending}`, 80, 50);
    doc.text(`Confirmed: ${confirmed}`, 130, 50);
    doc.text(`Dismissed: ${dismissed}`, 180, 50);

    // Table
    autoTable(doc, {
      startY: 60,

      head: [[
        "#",
        "Plate Number",
        "Vehicle",
        "Violations",
        "Location",
        "Status",
      ]],

      body: violations.map((v, index) => [
        index + 1,
        v.plateNumber || "N/A",
        v.vehicleType,
        v.violations
          .map((x) => x.type)
          .join(", "),
        v.location,
        v.status,
      ]),

      styles: {
        fontSize: 9,
      },

      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    doc.save(
      `traffic-violation-report-${Date.now()}.pdf`
    );
  } catch (error) {
    console.error(error);
  } finally {
    setExportReport(false);
  }
  };
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

        <button
          disabled={exportReport}
          onClick={exportPDF}
          className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-primary/80"
        >
          {exportReport ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Export Report"
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex-1">
            <input
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search detections..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("All")}
              className={`rounded-xl px-4 py-2 text-sm ${
                activeFilter === "All"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-background"
              }`}
            >
              All
            </button>
              
            <button
              onClick={() => setActiveFilter("Pending")}
              className={`rounded-xl px-4 py-2 text-sm ${
                activeFilter === "Pending"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-background"
              }`}
            >
              Unreviewed
            </button>
              
            <button
              onClick={() => setActiveFilter("Confirmed")}
              className={`rounded-xl px-4 py-2 text-sm ${
                activeFilter === "Confirmed"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-background"
              }`}
            >
              Confirmed
            </button>
              
            <button
              onClick={() => setActiveFilter("Dismissed")}
              className={`rounded-xl px-4 py-2 text-sm ${
                activeFilter === "Dismissed"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-background"
              }`}
            >
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
            {
              loading?(
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ):(
            
            filteredViolations.map((item) => (
              <tr
                key={item._id}
                className="border-b border-border transition hover:bg-background"
              >
                <td className="px-6 py-4">
                  <img
                    src={item.evidenceImageUrl}
                    alt="Violation"
                    className="h-16 w-24 rounded-lg object-contain"
                  />
                </td>

                <td className="px-6 py-4">
                  {item.violations
                    .map((v) =>
                      getViolationLabel(v.type)
                    )
                    .join(", ")}
                </td>

                <td className="px-6 py-4">
                  {item.location}
                </td>

                <td className="px-6 py-4">
                  {new Date(item.detectedAt).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {item.violations.map((v, idx) => (
                      <div key={idx}>
                        <p className="font-medium">
                          { getViolationLabel(v.type)}
                        </p>
                    
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{
                                width: `${v.confidence * 100}%`,
                              }}
                            />
                          </div>
                            
                          <span className="text-xs">
                            {(v.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.status === "Confirmed"
                        ? "bg-green-500/20 text-green-500"
                        : item.status === "Dismissed"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                    <button
                  onClick={() => {
                        setSelectedViolation(item);
                        setNewStatus(item.status);
                      }}
                      className="cursor-pointer flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-all hover:bg-background hover:border-primary"
                    >
                      <Eye size={16} />
                    </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        {selectedViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedViolation(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
              
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Violation Details
              </h2>
              
              <button
                onClick={() => setSelectedViolation(null)}
                className="cursor-pointer rounded-lg p-2 transition hover:bg-background"
              >
                <X size={20} />
              </button>
            </div>
              
            {/* Evidence Image */}
            <img
              src={selectedViolation.evidenceImageUrl}
              alt="Evidence"
              className="mb-6 aspect-video w-full rounded-xl object-contain"
            />
      
            {/* Vehicle Information */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  Vehicle Type
                </p>
              
                <p className="mt-1 font-semibold">
                  {selectedViolation.vehicleType}
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  Plate Number
                </p>
              
                <p className="mt-1 font-semibold">
                  {selectedViolation.plateNumber || "Not Detected"}
                </p>
              </div>
              
              <div className="col-span-2 rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  Location
                </p>
              
                <p className="mt-1 font-semibold">
                  {selectedViolation.location}
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  Detected At
                </p>
              
                <p className="mt-1 font-semibold">
                  {new Date(
                    selectedViolation.detectedAt
                  ).toLocaleString()}
                </p>
              </div>
                
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  Current Status
                </p>
                
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    selectedViolation.status === "Confirmed"
                      ? "bg-green-500/20 text-green-600"
                      : selectedViolation.status === "Dismissed"
                      ? "bg-red-500/20 text-red-600"
                      : "bg-yellow-500/20 text-yellow-600"
                  }`}
                >
                  {selectedViolation.status}
                </span>
              </div>
                  
            </div>
                  
            {/* Violations */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">
                Detected Violations
              </h3>
                  
              <div className="space-y-3">
                {selectedViolation.violations.map(
                  (violation, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">
                          {violation.type}
                        </span>
                  
                        <span className="font-semibold text-primary">
                          {(
                            violation.confidence * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                        
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${
                              violation.confidence * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
              
            {/* Status Update */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Update Status
              </label>
              
              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(
                    e.target.value as
                      | "Pending"
                      | "Confirmed"
                      | "Dismissed"
                  )
                }
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Pending">
                  Pending
                </option>
              
                <option value="Confirmed">
                  Confirmed
                </option>
              
                <option value="Dismissed">
                  Dismissed
                </option>
              </select>
            </div>
              
            {/* Footer */}
            <div className="flex justify-end gap-3">
              
              <button
                  onClick={() =>
                  setSelectedViolation(null)
                }
                className=" cursor-pointer rounded-xl border border-border px-5 py-2.5 font-medium transition hover:bg-background"
              >
                Cancel
              </button>
              
              <button
                 disabled={updating}
                onClick={updateStatus}
                className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Save Changes"}
              </button>
                
            </div>
                
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
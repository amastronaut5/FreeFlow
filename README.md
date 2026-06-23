<div align="center">

<img width="1056" height="576" alt="freeflow_logo" src="https://github.com/user-attachments/assets/a302fe3e-5b78-40ac-b99c-9ce71e664980" />

# GridLock 2.0

### A Hybrid Cloud-Edge Architecture for Automated Traffic Violation Detection

**GridLock 2.0 — Round 2 Submission · Theme 3 · Computer Vision for Traffic Enforcement**

[![Status](https://img.shields.io/badge/status-integration--verified-blue)]()
[![Architecture](https://img.shields.io/badge/architecture-hybrid--inference-orange)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey)]()

</div>

---

## Abstract

GridLock 2.0 is an end-to-end computer vision system that automatically detects, classifies, and documents traffic violations from photographic and video evidence. The system addresses a structural inefficiency in modern traffic enforcement: surveillance infrastructure now produces image volumes that exceed what manual review can process, leaving the majority of captured violations undocumented.

Rather than building a monolithic inference service, GridLock 2.0 is architected as a **hybrid cloud-edge pipeline**: vision-heavy stages (vehicle and road-user detection, multi-class violation recognition, severity classification) run on **managed Roboflow inference workflows**, while orchestration, evidentiary record-keeping, license plate recognition, analytics, and evaluation run on a **self-hosted backend service**. This split was a deliberate engineering decision, not a default — it isolates GPU-bound inference from CPU-bound business logic, lets each half scale and fail independently, and keeps the backend light enough to deploy on commodity infrastructure.

This document describes the system's architecture, module contracts, data flow, and current implementation status with the precision expected of a technical specification rather than a pitch deck.

---

## Table of contents

1. [System overview](#system-overview)
2. [Architecture](#architecture)
3. [Module specification](#module-specification)
4. [Data contracts](#data-contracts)
5. [Deployment topology](#deployment-topology)
6. [Dataset and model provenance](#dataset-and-model-provenance)
7. [Evaluation methodology](#evaluation-methodology)
8. [Implementation status](#implementation-status)
9. [Known limitations](#known-limitations)
10. [Repository structure](#repository-structure)
11. [Local development](#local-development)
12. [Team](#team)

---

## System overview

The pipeline processes a single traffic image through eight logical modules (M1–M8), organized into two execution environments:

| Module | Function | Environment |
|---|---|---|
| **M1** | Image preprocessing — contrast normalization, denoising, motion-blur correction | Backend (Python, OpenCV, Albumentations) |
| **M2** | Vehicle and road-user detection with multi-object tracking | Roboflow workflow (YOLOv26) |
| **M3** | Multi-class violation detection — six parallel sub-detectors | Roboflow workflow |
| **M4** | Violation merging, deduplication, and severity scoring | Roboflow workflow (fused with M3) |
| **M5** | License plate detection and OCR | Backend |
| **M6** | Evidence generation — annotated imagery and structured records | Backend |
| **M7** | Analytics and reporting | Backend |
| **M8** | Quantitative evaluation against ground truth | Backend |

No module was trained from scratch. Every vision component is either a pretrained checkpoint (YOLOv26, HuggingFace-hosted helmet/seatbelt detectors) fine-tuned via transfer learning, or a deterministic, rule-based transformation over model output (tracking-based wrong-side detection, geometric stop-line logic, zone-dwell-time parking logic). This is a stated design constraint: the system prioritizes composability and inference-time reliability over training novel models under hackathon time constraints.

---

## Architecture

The diagram below shows the complete request lifecycle: a client submits an image, the backend performs preprocessing and delegates detection/classification to Roboflow, Roboflow returns merged, scored violations, and the backend completes evidence generation and persistence before returning a structured record.

> **Diagram reference:** see `docs/architecture.svg` (exported from the project's interactive system diagram — regenerate via the diagramming notebook in `docs/` if modules change).

**Design rationale for the split:**

- **Inference isolation.** M2–M4 require GPU-accelerated object detection running across six parallel sub-models per frame. Hosting this on Roboflow's managed infrastructure means the backend never needs a GPU, never needs `torch`/`ultralytics` installed, and is not responsible for model-weight distribution or inference scaling.
- **Independent failure domains.** A Roboflow outage degrades detection but does not take down M5 (plate OCR on cached frames), M7 (historical analytics), or M8 (offline evaluation) — these continue operating against previously persisted records.
- **Deployment portability.** Because the backend does not bundle deep learning frameworks, it fits comfortably within free-tier compute (512MB–1GB RAM) on conventional PaaS providers, rather than requiring GPU-class hosting for the entire system.
- **Two network hops, not eight.** Although the architecture is described in eight modules, a client only ever talks to the backend; the backend talks to two Roboflow workflow endpoints. The eight-module decomposition is an internal contract, not eight public network calls.

---

## Module specification

### M1 — Image preprocessing

**Environment:** Backend · **Stack:** OpenCV, Albumentations, NumPy

Normalizes incoming imagery prior to inference:

- CLAHE-based local contrast enhancement (LAB color space, clip limit 2.0)
- Fast Non-Local Means denoising
- Conditional motion-blur correction (Laplacian-variance-triggered sharpening kernel, applied only below an empirically chosen blur threshold)

M1 output is persisted to disk and referenced by frame ID for all downstream modules; it does not block on a successful M2/M3 response, satisfying the independent-failure-domain property above.

### M2 — Vehicle and road-user detection

**Environment:** Roboflow workflow · **Model:** YOLOv26 (nano/640 variant) · **Tracker:** ByteTrack

Detects and localizes six classes (`car`, `truck`, `bus`, `motorcycle`, `person`, `traffic light`), applies class-conditional filtering for downstream sub-detectors, and maintains object identity across frames via ByteTrack for time-dependent violation logic (illegal parking, wrong-side driving).

### M3 — Violation detection

**Environment:** Roboflow workflow (deployed jointly with M4)

Six independently-specified sub-detectors execute over filtered detections from M2:

| Sub-detector | Method |
|---|---|
| Helmet non-compliance | Cropped-region object detection on rider ROIs |
| Seatbelt non-compliance | Cropped-region object detection on driver ROIs |
| Triple riding | Geometric occupancy count — persons whose centroid falls within an extended motorcycle bounding region, threshold ≥ 3 |
| Red-light violation | Conjunction of traffic-light-state classification and stop-line crossing event |
| Wrong-side driving | Tracked centroid displacement vector compared against permitted direction of travel |
| Illegal parking | Zone dwell-time exceeding a stationarity threshold within a defined no-parking polygon |

### M4 — Violation merging and severity scoring

**Environment:** Roboflow workflow (deployed jointly with M3)

Aggregates all six sub-detector outputs into a single flattened violation list with associated bounding-box detections for visualization, deduplicates per-violation-type, and is the point at which a structural correctness issue was identified and resolved during development (see [Implementation status](#implementation-status)).

### M5 — License plate recognition

**Environment:** Backend · **Stack:** YOLOv8-based plate detector, OCR engine with post-processing

Detects plate regions within vehicle bounding boxes returned by M2, applies geometric correction and adaptive thresholding to the cropped region, and extracts alphanumeric registration text with confidence scoring and character-set cleanup matched to regional plate formats.

### M6 — Evidence generation

**Environment:** Backend

Produces the system's evidentiary artifact: an annotated frame with severity-color-coded bounding boxes and violation labels, paired with a structured record (frame ID, timestamp, source reference, plate number, violation list, per-violation confidence, aggregate severity, and free-form metadata) persisted to a relational store.

### M7 — Analytics and reporting

**Environment:** Backend

Exposes aggregate and filterable views over the persisted violation record store: severity distribution, per-plate violation history, and time-series violation trends, intended to back a dashboard or reporting interface.

### M8 — Performance evaluation

**Environment:** Backend

Computes per-class precision, recall, and F1 against a held-out, manually labeled ground-truth set, plus system-level throughput benchmarking (frames-per-second, per-frame latency) for the M1→M2 path. Run offline, not part of the request-serving path.

---

## Data contracts

Every module boundary is defined by an explicit schema, validated at runtime. This is what allows M2–M4 to be relocated to managed infrastructure without requiring any change to M1, M5, M6, M7, or M8 — each module is contractually aware only of its immediate input and output shape, never of where its neighbor executes.

```
M1 output  →  M2 input   : preprocessed frame reference + dimensions
M2 output  →  M3 input   : tracked detections [{bbox, class, confidence, track_id}]
M3 output  →  M4 input   : per-sub-detector violation lists (six parallel streams)
M4 output  →  M6 input   : {confirmed_violations[], confidences[], severity, vehicle_bboxes[]}
M5 output  →  M6 input   : {plate_number, plate_bbox, plate_confidence}
M6 output  →  M7 input   : persisted structured violation record
```

Full JSON schema definitions live in `shared/schemas.py` (backend-local modules) and the Roboflow workflow's declared `inputs`/`outputs` block (`workflows/*.json`) for the managed modules.

---

## Deployment topology

```
Client application
       │  HTTPS
       ▼
Backend service  (self-hosted)
   ├─ M1  preprocessing
   ├─ M5  plate recognition
   ├─ M6  evidence generation  ──▶  persistent store
   ├─ M7  analytics
   └─ M8  evaluation
       │  REST (per-frame)
       ▼
Roboflow workflows  (managed)
   ├─ Workflow A — M2 detection + tracking
   └─ Workflow B — M3 violation detection + M4 scoring
```

The backend is the only component a client integrates against; Roboflow workflow URLs are an internal implementation detail of the backend, not part of the public contract. This matters for the submission's security posture — Roboflow API credentials never reach the client.

---

## Dataset and model provenance

No bespoke dataset was collected for this submission's primary detection task; the system instead composes existing, openly available models and the two datasets supplied for adjacent challenge themes:

| Source | Used for |
|---|---|
| YOLOv26 base weights | M2 vehicle/road-user detection backbone |
| HuggingFace-hosted helmet and seatbelt detectors | M3 compliance sub-detectors, used directly or fine-tuned |
| Theme 1 dataset (parking violation records) | Informs M3 illegal-parking zone definitions and M7 hotspot analytics |
| Theme 2 dataset (event congestion records) | Informs M7 contextual event-overlay analytics |

This provenance is stated explicitly because it is a defensible engineering position, not a limitation to obscure: composing validated, pretrained components reduces the risk surface relative to training novel detectors against an unvalidated dataset under hackathon time constraints.

---

## Evaluation methodology

M8 evaluates each violation class independently — precision, recall, and F1 are computed per class against a manually annotated validation set, rather than reporting a single blended accuracy figure that could mask poor performance in a low-frequency violation category. Throughput is reported separately as frames-per-second and per-frame latency for the M1→M2 path, measured on the deployment target's actual hardware rather than extrapolated.

At submission time, M8 has been implemented and validated against synthetic and small-sample inputs; full-scale evaluation against a held-out labeled set is the immediate next step prior to live demonstration (see status below).

---

## Implementation status

This section states verified fact, not aspiration — a technical reviewer should be able to reproduce every claim below.

| Component | Status |
|---|---|
| M2 detection workflow | Deployed on Roboflow, returns live predictions |
| M3+M4 violation workflow | Deployed on Roboflow, returns live predictions |
| Backend module contracts (M1, M5–M8) | Implemented, unit-tested locally |
| Frontend integration | Completed — frontend calls backend endpoints and renders responses |
| Backend public deployment | **Not yet deployed** — currently runs locally; deployment to a public host is the remaining step before live demo |
| M8 full-scale evaluation | Pending a labeled validation set of sufficient size |

A structural defect was identified during integration testing: the `Merge_Violations` step initially produced a nested-list structure (one inner list per detection crop) rather than a flat list of violation records whenever more than one person or vehicle appeared in frame, despite returning no error status. This was caught by inspecting actual API responses against expected schema shape — not by relying on the absence of a reported error — and corrected by flattening one nesting level inside the merge step before it reaches the scoring stage. This is recorded here deliberately: a system that reports "success" is not the same as a system that returns structurally correct output, and the evaluation process treated those as separate claims requiring separate verification.

---

## Known limitations

Stated plainly, in the interest of the same precision this document otherwise asks for:

- The backend is not yet publicly deployed; all integration verification to date has been against a local instance.
- M3's wrong-side-driving and illegal-parking sub-detectors depend on multi-frame tracking continuity; performance on single isolated images (as opposed to video sequences) is reduced for these two classes specifically.
- The seatbelt detector currently falls back to a generic, non-domain-fine-tuned checkpoint where a domain-specific one is unavailable; this is flagged in code and should be replaced before any claim of seatbelt-detection accuracy is made externally.
- Managed Roboflow inference introduces a network dependency and a free-tier execution time ceiling (20 seconds) and response size ceiling (6MB) per call — sufficient for single-image inference, not for batched video throughput at scale.

---

## Repository structure

The structure below is the intended full repository layout once the backend code (built separately — see `backend/main.py` and `backend/core.py` in the project's implementation history) and exported Roboflow workflow definitions are added alongside this documentation:

```
gridlock/
├── backend/
│   ├── main.py                 # FastAPI application, module endpoints
│   ├── core.py                 # M1, M5–M8 implementation
│   ├── config.example.yaml     # Template — copy to config.yaml, never commit the real one
│   ├── shared/
│   │   ├── schemas.py          # Pydantic data contracts
│   │   └── db.py                # Persistence layer
│   ├── requirements.txt
│   └── Dockerfile
├── workflows/
│   ├── m2_detection.json        # Exported Roboflow workflow definition
│   └── m3_m4_violations.json    # Exported Roboflow workflow definition
├── docs/
│   ├── architecture.svg
│   └── module-contracts.md
├── LICENSE
├── .gitignore
└── README.md
```

---

## Local development

```bash
git clone <repository-url>
cd gridlock/backend
pip install -r requirements.txt

# Configure Roboflow workflow credentials
cp config.example.yaml config.yaml
# edit config.yaml: api_key, workspace, workflow_id for both deployed workflows

uvicorn main:app --reload --port 8000
# Interactive API documentation: http://localhost:8000/docs
```

---

## Team

GridLock 2.0 is built by a three-person team with the following module ownership:

| Area | Scope |
|---|---|
| Pipeline & data | M1 preprocessing, dataset provenance, Roboflow workflow configuration |
| Computer vision | M2–M4 workflow design and tuning, M8 evaluation |
| Backend & integration | M5–M7, API contract design, frontend integration |

---

<div align="center">

*Submitted as part of GridLock 2.0 Round 2 — Theme 3.*

</div>

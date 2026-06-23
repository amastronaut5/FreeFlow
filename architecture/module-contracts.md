# Module contracts

This document is the authoritative schema reference for every module boundary in GridLock 2.0. If a module's implementation and this document disagree, this document is wrong and should be corrected — it is meant to be regenerated from the actual `shared/schemas.py` definitions and the deployed Roboflow workflows' declared `inputs`/`outputs`, not maintained by hand from memory.

---

## M1 → M2

**Producer:** Backend (`core.preprocess`)
**Consumer:** Roboflow detection workflow (via backend's `detect()` call)

```json
{
  "frame_id": "string, 8-char hex",
  "original_path": "string, filesystem path to source image",
  "cleaned_path": "string, filesystem path to CLAHE/denoised/deblurred image",
  "width": "integer, source image width in pixels",
  "height": "integer, source image height in pixels"
}
```

## M2 output (Roboflow detection workflow)

```json
{
  "tracked_detections": {
    "image": {"width": "integer|null", "height": "integer|null"},
    "predictions": [
      {
        "x": "float, center x",
        "y": "float, center y",
        "width": "float",
        "height": "float",
        "class": "string, one of: car|truck|bus|motorcycle|person|traffic light",
        "confidence": "float, 0-1",
        "tracker_id": "integer|null, ByteTrack identity"
      }
    ]
  }
}
```

## M3 + M4 output (Roboflow violation workflow)

```json
{
  "violations": [
    {
      "violation": "string, one of: helmet_non_compliance|seatbelt_non_compliance|triple_riding|red_light_violation|wrong_side_driving|illegal_parking",
      "confidence": "float, 0-1",
      "bbox": "[x1, y1, x2, y2] float array"
    }
  ],
  "violation_detections": {
    "image": {"width": "integer|null", "height": "integer|null"},
    "predictions": []
  },
  "helmet_violations": "array, flattened",
  "seatbelt_violations": "array, flattened",
  "triple_riding_violations": "array",
  "red_light_violations": "array",
  "wrong_side_violations": "array",
  "illegal_parking_violations": "array",
  "tracked_detections": "object, same shape as M2 output",
  "vision_events_error_status": "boolean",
  "vision_events_message": "string"
}
```

**Note:** `vision_events_error_status: false` indicates the event-logging side-effect succeeded — it is not a signal that the violation arrays above are structurally correct. See README §Implementation status for a documented case where this distinction mattered.

## M4 → M6

**Producer:** Backend, after parsing the Roboflow violation workflow response
**Consumer:** Backend (`core.generate_evidence`)

```json
{
  "frame_id": "string",
  "confirmed_violations": ["string", "..."],
  "confidences": ["float", "..."],
  "severity": "string, one of: NONE|LOW|MEDIUM|HIGH",
  "vehicle_bboxes": [{"x1": "float", "y1": "float", "x2": "float", "y2": "float"}]
}
```

## M5 → M6

**Producer:** Backend (`core.recognize_plate`)
**Consumer:** Backend (`core.generate_evidence`)

```json
{
  "frame_id": "string",
  "plate_number": "string|null",
  "plate_bbox": {"x1": "float", "y1": "float", "x2": "float", "y2": "float"} ,
  "plate_confidence": "float, 0-1"
}
```

## M6 output — persisted record

```json
{
  "frame_id": "string",
  "timestamp": "string, ISO 8601",
  "source_file": "string, filesystem path",
  "plate_number": "string|null",
  "violations": ["string", "..."],
  "confidences": ["float", "..."],
  "severity": "string",
  "annotated_image_path": "string, filesystem path",
  "metadata": {"plate_conf": "float"}
}
```

This record is the row schema for the persistence layer queried by M7 and M8.

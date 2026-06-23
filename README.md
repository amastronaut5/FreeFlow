# 🚦 FreeFlow – AI-Powered Traffic Violation Detection & Management System

FreeFlow is an intelligent traffic monitoring platform that automates the detection, processing, and management of traffic violations using Computer Vision and Generative AI.

The system analyzes traffic images, identifies vehicles, detects violations such as helmet non-compliance, seatbelt violations, and triple riding, extracts vehicle registration numbers using OCR, stores evidence securely, and provides a modern dashboard for traffic authorities to manage violations efficiently.

---

## 🌟 Key Features

### 🤖 AI-Powered Violation Detection

FreeFlow uses Roboflow Computer Vision models and workflows to automatically detect:

* No Helmet Violations
* Seatbelt Violations
* Triple Riding
* Vehicle Presence Detection
* Number Plate Regions

---

### 🚗 Vehicle Detection & Tracking

* Motorcycle Detection
* Car Detection
* Bus Detection
* Truck Detection

Each violation is automatically associated with its corresponding vehicle.

---


### 📸 Automated Evidence Generation

For every detected violation:

* Vehicle is isolated from the original image
* Evidence image is generated
* Uploaded to Cloudinary
* Linked to the violation record

This provides traceable proof for every detected violation.

---

### ☁️ Cloud Storage Integration

Evidence images are securely stored using Cloudinary.

Features:

* Fast image delivery
* Persistent storage
* CDN support
* Secure URLs

---

### 📊 Traffic Analytics Dashboard

Interactive dashboard with:

* Total Violations
* Pending Cases
* Confirmed Violations
* Dismissed Violations
* Violation Type Distribution
* Recent Detection Activity

---

### 🗂 Violation Management

Traffic officers can:

* View violation details
* Search violations
* Filter records
* Update status

Supported statuses:

```txt
Pending
Confirmed
Dismissed
```

---

# 🏗 System Architecture

```txt
Image Upload
      │
      ▼
Vehicle Detection
      │
      ▼
Violation Detection
      │
      ▼
Violation-Vehicle Matching
      │
      ▼
Vehicle Cropping
      │
      ▼
Gemini OCR
      │
      ▼
Cloudinary Upload
      │
      ▼
MongoDB Storage
      │
      ▼
Dashboard Visualization
```

---

# 🧠 Detection Pipeline

## Helmet Detection

```txt
Traffic Image
      │
      ▼
Motorcycle Detection
      │
      ▼
Helmet Detection
      │
      ▼
Violation Matching
```

---

## Seatbelt Detection

```txt
Vehicle Detection
      │
      ▼
Seatbelt Classification
      │
      ▼
Violation Creation
```

---

## Triple Riding Detection

Roboflow Workflow:

```txt
Image
      │
      ▼
Motorcycle Detection
      │
      ▼
Dynamic Crop
      │
      ▼
Occupancy Analysis
      │
      ▼
Triple Riding Detection
```

---

# 🛠 Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts
* Lucide React

---

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Multer
* Sharp
* Cloudinary

---

## AI & Computer Vision

### Roboflow

Used for:

* Vehicle Detection
* Helmet Detection
* Seatbelt Detection
* Triple Riding Detection
* Workflow Automation

### Google Gemini

Used for:

* Number Plate OCR
* Confidence Scoring

---

# 📁 Project Structure

```txt
FreeFlow
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   ├── types
│   │   └── assets
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── models
│   │   ├── routes
│   │   └── config
│
└── README.md
```

---

# 🗄 Database Schema

```ts
{
  plateNumber: string;

  vehicleType: string;

  violations: [
    {
      type: string;
      confidence: number;
    }
  ];

  evidenceImageUrl: string;

  location: string;

  status:
    | "Pending"
    | "Confirmed"
    | "Dismissed";

  detectedAt: Date;
}
```

---

# 🔌 API Endpoints

## Detection

```http
POST /api/v1/image/checkViolations
```

Upload image and perform violation detection.

---

## Violations

```http
GET /api/v1/violations
```

Retrieve all violations.

```http
GET /api/v1/violations/search
```

Search violations.

```http
GET /api/v1/violations/:id
```

Retrieve violation details.

```http
PATCH /api/v1/violations/:id/status
```

Update violation status.

---

# 🚀 Deployment

## Frontend

* Vercel

## Backend

* Render

## Database

* MongoDB Atlas

## Storage

* Cloudinary

---

# 🎯 Future Enhancements

* Wrong-Side Driving Detection
* Red Light Violation Detection
* Illegal Parking Detection
* Real-Time CCTV Stream Processing
* Automated Challan Generation
* Vehicle Owner Lookup
* Fine Calculation Engine
* Role-Based Access Control
* Notification System

---

## 📜 License

ISC License

---

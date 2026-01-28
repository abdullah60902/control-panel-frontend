# 🚨 Incident Reports Module - Complete Documentation

## 1. 📌 Overview

The **Incident Reports Module** provides a robust system for recording, tracking, and managing incidents within the facility. It ensures compliance with safety regulations and provides valuable insights through its 6-month overview analytics.

### ✅ Key Features
*   **Incident Reporting:** Structured forms for capturing detailed incident information.
*   **Incident Tracking:** Monitor open incidents and track their progression to resolution.
*   **Status Management:** Update statuses from "Open" to "Under Investigation" to "Resolved".
*   **6-Month Overview:** 📊 **NEW!** Visual summary of incident frequency over the last half-year.
*   **Export Capabilities:** Generate PDF and CSV reports for audits and external reporting.
*   **Attachment Support:** Securely upload pertinent photos, documents, and videos.

---

## 2. 🚀 Quick Start Guide (for Staff)

### ➕ Reporting a New Incident
1.  Navigate to **Incident Reports** in the sidebar.
2.  Click the purple **"Report New Incident"** button.
3.  **Fill in the Form:**
    *   **Patient:** Select the resident involved.
    *   **Date:** When the incident occurred.
    *   **Type:** (Fall, Medication Error, Behavioral, etc.)
    *   **Severity:** (Low, Medium, High)
    *   **Details:** Comprehensive description of the event.
    *   **Immediate Actions:** Steps taken immediately after the incident.
    *   **Staff Involved:** Select staff members present.
4.  **Attach Evidence:** Click "Attach Photo/Document" to upload files.
5.  Click **"Report Incident"**.

### 🔍 Tracking & Updating
*   **Filter:** Use the buttons (All, Open, Resolved) to filter the list.
*   **View Details:** Click the **Eye Icon (👁️)** to see the full report and attachments.
*   **Update Status:** Use the dropdown in the "Status" column to change progress (e.g., from "Open" to "Under Investigation").
*   **Edit:** Click the **Pencil Icon (✏️)** to add more details or outcomes.

### 📊 6-Month Overview
*   At the top of the dashboard, you will see a **6-Month Incident Overview**.
*   This section displays the total count of incidents recorded for each of the last 6 months.
*   **Use Case:** Use this to identify trends (e.g., "Are incidents increasing in winter months?").

### 📥 Exporting Reports
1.  Locate the incident in the list.
2.  Click the **Download Icon (⬇️)**.
3.  Select **"Export as PDF"** for a printable document or **"Export as CSV"** for a spreadsheet.

---

## 3. 🔌 API Reference (for Developers)

### Base URL: `http://localhost:3000`

### Authentication
All endpoints require a JWT Bearer Token in the header:
`Authorization: Bearer <your_token>`

### Endpoints

#### 1. Get All Incidents
*   **GET** `/incident/all`
*   **Response:** Returns an array of incident objects containing `client` (populated), `status`, `severity`, etc.

#### 2. Create Incident
*   **POST** `/incident/`
*   **Body (FormData):**
    *   `client`: ObjectId (Resident)
    *   `incidentDate`: Date string
    *   `incidentType`: String (Fall, etc.)
    *   `severity`: String (Low, Medium, High)
    *   `incidentDetails`: String
    *   `immediateActions`: String
    *   `peopleNotified`: String
    *   `staffInvolved`: ObjectId (HR Staff)
    *   `attachments`: File[] (optional)

#### 3. Update Incident
*   **PUT** `/incident/update/:id`
*   **Body:** Supports updating any field, including `status` and `outcomeStatus`.

#### 4. Delete Incident
*   **DELETE** `/incident/delete/:id`
*   **Response:** `{ "msg": "Incident deleted successfully" }`

### Data Model
```javascript
{
  _id: ObjectId,
  client: ObjectId (ref: "Client"),
  incidentDate: Date,
  incidentType: String, // "Fall", "Medication Error", etc.
  severity: String,     // "Low", "Medium", "High"
  status: String,       // "Open", "Under Investigation", "Resolved"
  reportedBy: String,
  incidentDetails: String,
  immediateActions: String,
  staffInvolved: ObjectId (ref: "HR"),
  attachments: [String], // URLs
  createdAt: Date
}
```

---

## 4. 🛠️ Implementation Details

### Frontend Architecture
*   **File:** `src/app/Incident-Reports/page.js`
*   **State Management:** Local React State (`useState`) for form data, filtering, and modals.
*   **Analytics Logic:** Uses `React.useMemo` to calculate the 6-month rolling window stats from the fetched `incidentData`.
*   **Styling:** Tailwind CSS with a dark mode theme (`bg-gray-800`).

### Analytics Calculation
The 6-month overview calculates totals dynamically on the frontend:
```javascript
const last6MonthsStats = React.useMemo(() => {
  // Generates last 6 month keys (e.g., "Jan 2026")
  // Filters incidentData by month/year match
  // Returns array of { label, count }
}, [incidentData]);
```

This ensures that the overview is always in sync with the current dataset without requiring a separate "analytics" API call.

# 💊 Medication Management & Records - Complete Documentation

## 1. 📌 Overview

This combined documentation covers two key modules related to medication:
1.  **Medication Management:** For setting up medication schedules, managing stock, and defining prescriptions.
2.  **Medication Records (eMAR):** For tracking the actual administration of medication (eMAR - Electronic Medication Administration Records).

### ✅ Key Features
*   **Inventory Management:** Track stock levels (`quantity`, `threshold`) and receive "Low Stock" alerts.
*   **Scheduling:** Define complex frequencies (e.g., "3x Daily") and specific administration times.
*   **eMAR Tracking:** Record every administration event (`Given: Yes/No`, Time, Caregiver).
*   **Safety Integration:** Attach prescriptions or photos of medication packaging.
*   **Reporting:** Export detailed medication histories and administration logs to PDF/CSV.

---

## 2. 🚀 Quick Start Guide (for Nurses/Care Staff)

### 🏥 Module 1: Medication Management (Setup)

**Creating a New Medication Plan:**
1.  Go to **Medication Management**.
2.  Click **"Add New Medication"** (if available) or the **Plus (+)** button.
3.  **Enter Details:**
    *   **Patient:** Select the resident.
    *   **Medication Name:** Full name (e.g., "Paracetamol 500mg").
    *   **Stock:** Current Quantity (e.g., 20) and Alert Threshold (e.g., 5).
    *   **Schedule:** Frequency (e.g., "Twice Daily") and Times (e.g., "08:00, 20:00").
4.  **Save.**

**Managing Stock:**
*   Watch for **Red Alerts** or **Toast Notifications** indicating low stock.
*   Edit the medication record to update the `Quantity` after restocking.

### 📝 Module 2: Medication Records (Administration)

**Recording Administration:**
1.  Go to **Medication Record**.
2.  Click **"Add Record"** or the **Plus (+)** button.
3.  **Log the Event:**
    *   **Patient & Medication:** Select the correct items.
    *   **Time:** Time administered.
    *   **Given?** Select "Yes" (Administered) or "No" (Refused/Missed).
    *   **Notes:** Add comments if refused.
4.  **Save.** This creates a permanent log entry.

**Exporting Histories:**
*   Use the **Download Icon** in either module to generate a PDF report for handover or doctor reviews.

---

## 3. 🔌 API Reference (for Developers)

### Base URL: `http://localhost:3000`

### Authentication
`Authorization: Bearer <your_token>`

### 🔹 Medication Management APIs

#### 1. Get/Create Medications
*   **GET** `/medications` - List all set up medications.
*   **POST** `/medications` - Create a new medication profile.
    *   **Body:** `client`, `medicationName`, `stock: { quantity, threshold }`, `schedule: { frequency, times[] }`.

#### 2. Update Stock/Schedule
*   **PUT** `/medications/:id`
*   **Use Case:** Updating stock count or changing dosage times.

#### 3. Low Stock Check
*   Frontend logic checks: `if (stock.quantity <= stock.threshold) triggerAlert()`.

### 🔹 Medication Records (eMAR) APIs

#### 1. Get Administration History
*   **GET** `/medication-administration`
*   **Query:** Filter by `client` or `date` (handled in frontend logic generally).

#### 2. Log Administration
*   **POST** `/medication-administration`
*   **Body:**
    *   `client`: ObjectId
    *   `medication`: ObjectId (Links to Management module)
    *   `given`: Boolean
    *   `time`: String (e.g., "08:00")
    *   `caregiverName`: String

### Data Model (Medication)
```javascript
{
  _id: ObjectId,
  client: ObjectId (ref: "Client"),
  medicationName: String,
  stock: {
    quantity: Number,
    threshold: Number
  },
  schedule: {
    frequency: String,
    times: [String] // ["08:00", "12:00"]
  },
  status: String, // "Active", "Discontinued"
  attachments: [String]
}
```

---

## 4. 🛠️ Implementation Details

### Frontend Architecture
*   **Files:**
    *   `src/app/Medication-Management/page.js`: Setup & Stock.
    *   `src/app/Medication-Record/page.js`: Administration Logs.
*   **Shared Components:** Utilizes shared `AuthContext` for user permissions.
*   **Alert System:** The global `Navbar` or Sidebar listens to the `hasLowStock` context flag to show a **Red Dot 🔴** notification when any medication is below threshold.

### CSV/PDF Export Logic
Both modules implement client-side generation using `jspdf` and `jspdf-autotable`.
*   **CSV:** Generates a blob and triggers a download link click.
*   **PDF:** Renders a table of selected fields and appends any image attachments at the bottom of the document.

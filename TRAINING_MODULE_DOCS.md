# 🎓 Training Module - Documentation

## 1. 📌 Overview

The **Training Module** allows for the precise tracking of staff qualifications, ensuring the workforce remains skilled and compliant with regulatory standards. It handles certification tracking, expiry monitoring, and certificate storage.

### ✅ Key Features
*   **Compliance Tracking:** Monitor completion percentages and validity of mandatory training.
*   **Auto-Status:** System automatically calculates statuses:
    *   🟢 **Valid** (More than 30 days remaining)
    *   🟡 **Expiring Soon** (Less than 30 days remaining)
    *   🔴 **Expired** (Past expiry date)
*   **Smart Recommendations:** Based on the staff's **Care Setting** (e.g., "Dementia Unit"), the system suggests relevant training modules.
*   **Certificate Storage:** Upload and view digital copies of certificates directly within the record.

---

## 2. 🚀 Quick Start Guide

### ➕ Adding a Training Record
1.  Navigate to **Training**.
2.  Click **"Add Training"**.
3.  **Select Staff:** Choose the employee.
4.  **Training Details:**
    *   **Type:** (e.g., "First Aid Level 3", "Safeguarding").
    *   **Dates:** Enter Completion and Expiry dates.
5.  **Status:** Leave blank to let the system auto-calculate "Valid" or "Expired", or set manually.
6.  **Attach Certificate:** Upload the PDF/Image proof.
7.  **Save.**

### 📊 Monitoring Compliance
*   **Color Codes:** Scan the list for **Red** (Expired) or **Yellow** (Expiring) badges.
*   **Filters:** Click "Expiring Soon" to see who needs a refresher booking this month.
*   **Export:** Use the PDF export to generate a "Training Matrix" report for inspectors.

---

## 3. 🔌 API Reference

### Base URL: `http://localhost:3000/training`

### Endpoints
*   **PUT** `/refresh-status` - Triggers a bulk update of statuses based on current date (Useful for daily jobs).
*   **GET** `/` - Fetch all training records.
*   **POST** `/` - Create new record (Multipart/FormData).

### Logic Link
*   **Integration:** Links to **HR Management**. The "Care Setting" in HR determines the `getRecommendedTrainings()` output in the Training form.

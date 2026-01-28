# 📊 Analytics & Audit Module - Documentation

## 1. 📌 Overview

The **Analytics Module** serves as the central intelligence hub for the platform. It provides high-level operational insights and a detailed audit trail of system activities across all core modules.

### ✅ Key Features
*   **Operational Dashboard:** Visual summary of key metrics:
    *   Total Staff & Clients.
    *   Training Compliance Rates (Valid vs Expired).
*   **Centralized Audit Logs:** View detailed activity logs for:
    *   **Compliance:** Who changed a status?
    *   **Care Planning:** Who updated a care plan?
    *   **Medication:** Stock adjustments and log deletions.
*   **Exportable Intelligence:** Download any dataset or log history as PDF/CSV for external reporting.

---

## 2. 🚀 Quick Start Guide

### 📈 Viewing Insights
1.  Navigate to **Analytics**.
2.  Select **"Analytics"** from the dropdown filter.
3.  Review the summary table for high-level stats on staff and training health.

### 🕵️‍♀️ Investigating Incidents (Audit Trails)
1.  Select a specific log stream (e.g., **"Medication Audit Logs"**).
2.  **Review Columns:**
    *   **User:** Who performed the action.
    *   **Action:** What they did (e.g., "Deleted Log").
    *   **Timestamp:** Exact time of the event.
3.  **Export:** Click **Download -> Export as PDF** to save the evidence chain.

---

## 3. 🔌 API Reference

### Base URL: `http://localhost:3000`

### Endpoints
*   **GET** `/analytics/care-settings` - Aggregated stats for the dashboard.
*   **GET** `/compliance/audit-logs` - History of compliance changes.
*   **GET** `/medications/audit-logs` - History of medication interactions.
*   **GET** `/carePlanning/audit-logs` - History of care plan modifications.

### Data Privacy
*   Audit logs are generally read-only to preserve integrity, though Admins may have privileges to prune old logs (`DELETE`).

# 📘 Care Home Management System - Complete Operational Manual

## 📖 Introduction - How the System Works
This document explains the entire ecosystem of the Care Home Management Platform. It details **every module**, **workflow**, and **interaction** within the system.

**Core Concept:** The system revolves around the **Resident**. 
1.  You admit a **Resident**.
2.  You create a **Care Plan** for them.
3.  Staff (managed in **HR**) provide daily care and administer **Medication**.
4.  If something goes wrong, an **Incident** is logged.
5.  Management monitors everything via **Analytics** and **Compliance**.

---

## 🏗️ PART 1: RESIDENT CARE OPERATIONS

### 1. Resident Management (The Foundation)
**Purpose:** To store the digital files of every person living in the care home.
*   **Action:** Go to `Resident Management` -> Click `Add Resident`.
*   **What Happens:** A profile is created. This ID is now available in Care Plans, Meds, and Incidents.
*   **Key Features:**
    *   **Profile View:** Shows photo, room number, and status (Active/Deceased).
    *   **Daily Logs:** Staff record daily notes (e.g., "Ate breakfast well").
    *   **Risk Assessments:** Upload/View assessments (e.g., Falls Risk).

### 2. Care Planning
**Purpose:** To define *how* a resident should be cared for.
*   **Action:** Go to `Care Planning` -> Click `Create Plan`.
*   **Workflow:** Select a Resident -> Choose Type (Nursing/Social) -> Write Needs/Goals -> Save.
*   **Review System:** Set a "Review Date".
    *   **Effect:** When the date approaches, the Dashboard shows a **Yellow Alert**.
*   **Export:** Click `Download PDF` to print the plan for hospitals or inspection.

### 3. Medication Management (Interconnected)
This allows two distinct actions: **Stock Control** and **Administration**.

**A. Medication Management (The Stock Cupboard)**
*   **Action:** Add a new drug (e.g., "Paracetamol") for a specific resident.
*   **Feature:** Set "Stock Level" (e.g., 20 pills) and "Threshold" (e.g., 5 pills).
*   **Effect:** When staff give meds, the stock number drops. If it hits 5, the header shows a **Red Dot Alert (Low Stock)**.

**B. Medication Record / eMAR (The Daily Round)**
*   **Action:** Go to `Medication Record` -> Staff click `Add Record`.
*   **Process:** Select Patient -> Select Drug -> Click "Given" (Yes/No) -> Sign.
*   **What Happens:**
    1.  The administration is logged permanently (Audit Trail).
    2.  The stock count in "Management" decreases by 1.

### 4. Incident Reports
**Purpose:** To legally document accidents or errors.
*   **Workflow:**
    1.  Click `Report Incident`.
    2.  Select Resident and **Staff Involved** (Pulling from HR).
    3.  Choose Severity (Low/Medium/High).
    4.  **Save.**
*   **New Feature:** A **6-Month Overview** chart at the top shows trends (e.g., "Are falls increasing this winter?").
*   **Effect:** Critical incidents can be filtered by `Status` ("Under Investigation" vs "Resolved").

### 5. Social & Activities
**Purpose:** To record the well-being and social life of residents.
*   **Action:** Calendar view of events (Bingo, Outings).
*   **Connection:** Logs linking residents to events prove to inspectors (CQC) that residents are active.

---

## 👥 PART 2: STAFF & HR OPERATIONS

### 6. HR Management (Staff Database)
**Purpose:** The single source of truth for all employees.
*   **Action:** Add a staff member (Name, Role, Start Date).
*   **Importance:** You *cannot* schedule a shift or assign training unless the person exists here first.
*   **Profile View:** Shows their Shifts, Training, and Documents in one place.

### 7. Staff Scheduling (Rota)
**Purpose:** To ensure the home is staffed correctly.
*   **Location:** Inside `Staff Profile` -> `Scheduling & Rota` Tab.
*   **Action:** Click a calendar day -> Assign "Shift" or "Day Off".
*   **Visuals:**
    *   🔴 Red = Shift Assigned.
    *   🟢 Green = Day Off.

### 8. Training Module
**Purpose:** To ensure staff are qualified.
*   **Workflow:** Add a record (e.g., "First Aid") -> Set Expiry Date.
*   **Automation:**
    *   If `Expiry Date` is > 30 days: Status = **Green (Valid)**.
    *   If `Expiry Date` is < 30 days: Status = **Yellow (Expiring)**.
    *   If Past Date: Status = **Red (Expired)**.
*   **Effect:** Managers see expired training counts on the Dashboard.

### 9. Performance Management
**Purpose:** To track Appraisals and Supervisions.
*   **Feature:** Set a `Reminder Date` for the next supervision.
*   **Effect:** The system runs a background check. If a date arrives, a **Popup Toast Notification** appears to remind the manager.

---

## 🏢 PART 3: HOME OPERATIONS & COMPLIANCE

### 10. Documents Management
**Purpose:** A digital filing cabinet.
*   **Workflow:** Upload generic files (Policies, Insurance).
*   **Expiry:** Like Training, documents turn Red when expired.

### 11. Compliance Module
**Purpose:** To track regulatory checks (e.g., "Fire Alarm Test").
*   **Action:** Create a task -> Set "Next Review Date".
*   **Audit Readiness:** Filter by "Action Required" to see what checks are overdue before an inspection.

### 12. Analytics
**Purpose:** High-level helicopter view.
*   **What it shows:**
    *   Total number of Staff/Residents.
    *   How many Training certs are expired (Risk level).
*   **Audit Logs:** A detailed history of "Who did What".
    *   *Example:* "Admin User deleted a Medication Log at 10:00 AM."

---

## 🔐 PART 4: SYSTEM ADMINISTRATION

### 13. User Management (Security)
**Purpose:** Controlling who can login.
*   **Roles:**
    *   **Admin:** Can see everything.
    *   **Staff:** Can see Care Plans and Meds.
    *   **Client:** Can only see *their own* or their relative's profile.
    *   **External:** Custom access (e.g., allow an auditor to see *only* Compliance logs).
*   **Linking:** Use this module to connect a "Login Account" to a "Staff ID".

---

## 🔄 SUMMARY OF INTERCONNECTIONS

| If you change X... | This happens to Y... |
| :--- | :--- |
| **HR:** Add a Staff Member | They appear in the dropdowns for Rota, Training, and Incident Reports. |
| **Meds:** Add a Log Entry | The Stock Count decreases automatically. |
| **Training:** Cert Expires | The Dashboard Analytics counter turns Red. |
| **Care Plan:** Review Date passes | The Plan is flagged as "Overdue" in the list. |

This system is designed to be a "Closed Loop". Every action feeds into reporting, ensuring safety and accountability.

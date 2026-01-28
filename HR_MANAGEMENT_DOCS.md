# 👥 HR Management Module - Complete Documentation

## 1. 📌 Overview

The **HR Management Module** is designed for administering staff records, managing roles, and organizing the workforce within the facility. It serves as the central directory for all staff members including Nurses, Care Assistants, Administration, and Management.

### ✅ Key Features
*   **Staff Directory:** Centralized list of all employees.
*   **Role Management:** Track positions (e.g., "Registered Nurse") and departments.
*   **Care Setting Assignment:** Assign staff to specific units (e.g., "Dementia Unit", "Residential Floor").
*   **Profile Management:** Store contact details, start dates, and qualifications.
*   **Document Interface:** (Integration point) Link to staff training and compliance documents.

---

## 2. 🚀 Quick Start Guide (for Admins)

### ➕ Adding a New Staff Member
1.  Navigate to **HR Management**.
2.  Click **"Add New Staff"** (Top Right).
3.  **Fill in Details:**
    *   **Full Name:** Complete legal name.
    *   **Email:** For system access and notifications.
    *   **Position:** Job title (e.g., "Senior Carer").
    *   **Department:** Functional area (e.g., "Care").
    *   **Care Setting:** Assigned work area.
    *   **Start Date:** Date of joining.
4.  Click **"Add Staff"**.

### 👤 Managing Profiles
*   **View Profile:** Click **"View Profile"** to see a detailed summary including their system activity (if linked).
*   **Edit Details:** Use the **Pencil Icon** to update roles or departments (e.g., on promotion).
*   **Deactivate/Delete:** Use the **Trash Icon** to remove a staff member who has left (Requires confirmation).

### 🔍 Search & Filter
*   **Filter Buttons:** Quickly toggle between "Nursing", "Care", "Admin" lists.
*   **Search Bar:** Find staff by name or email instantly.

---

## 3. 🔌 API Reference (for Developers)

### Base URL: `http://localhost:3000`

### Authentication
`Authorization: Bearer <your_token>`

### Endpoints

#### 1. Get All Staff
*   **GET** `/hr`
*   **Response:** `{ allHr: [ { fullName, email, position... } ] }`

#### 2. Create Staff
*   **POST** `/hr`
*   **Body:**
    ```json
    {
      "fullName": "Alice Nurse",
      "email": "alice@example.com",
      "position": "Nurse",
      "department": "Nursing",
      "careSetting": "Floor 1",
      "startDate": "2026-01-01"
    }
    ```

#### 3. Update Staff
*   **PUT** `/hr/:id`
*   **Use Case:** Updating email or position.

#### 4. Delete Staff
*   **DELETE** `/hr/:id`

### Data Model
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  position: String,
  department: String, // "Nursing", "Care", etc.
  careSetting: String, 
  startDate: Date,
  status: String, // "Active"
  createdAt: Date
}
```

---

## 4. 🛠️ Implementation Details

### Frontend Architecture
*   **File:** `src/app/HR-Management/page.js`
*   **Modals:** Uses overlay modals for "Add/Edit Staff" forms to keep the user context.
*   **Filtering:** Client-side filtering allows for instant sorting by Department or Care Setting without multiple API calls.

### Integration Points
*   **Staff ID:** The `_id` from this module is used as a reference in **Incident Reports** (`staffInvolved`) and **Medication Records** (`caregiverName` or linked ID) to provide accountability.

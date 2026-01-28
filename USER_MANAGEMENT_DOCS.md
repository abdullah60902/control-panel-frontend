# 🔐 User Management Module - Documentation

## 1. 📌 Overview

The **User Management Module** ensures secure access control across the platform. It allows Administrators to manage accounts, define roles, and link system users to their respective real-world profiles (e.g., Staff or Patients).

### ✅ Key Features
*   **Role-Based Access Control (RBAC):**
    *   🛡️ **Admin:** Full access to all modules.
    *   👩‍⚕️ **Staff:** Linked to HR Profile. Can view Rota, Assigned Patients.
    *   👵 **Client:** Linked to Resident Profile. Can view own Care Plan/Activities.
    *   🌍 **External:** Custom access control (e.g., Auditors/Families) with selectable page permissions.
*   **Profile Linking:** Directly connects a `User` account to a `Staff Member` or `Resident` ID for personalized data views.
*   **Secure Authentication:** Password management and account deactivation.

---

## 2. 🚀 Quick Start Guide

### 👤 Creating a New User
1.  Navigate to **User Management**.
2.  Click **"Add New User"**.
3.  **Basic Details:** Name, Email, Password.
4.  **Select Role:**
    *   **Staff:** You must select the specific **Staff Member** from the HR dropdown.
    *   **Client:** You must select the **Resident** from the Client dropdown.
    *   **External:** Check the boxes for the specific pages they are allowed to see (e.g., only "Compliance" and "Reports").
5.  **Save.**

### 🛠️ Managing Access
*   **Revoke Access:** Use the **Trash Icon** to delete a user account (does not delete the underlying Staff/Resident data).
*   **Update Permissions:** Edit an External user to grant/revoke access to specific modules instantly.

---

## 3. 🔌 API Reference

### Base URL: `http://localhost:3000/user`

### Endpoints
*   **GET** `/` - List all system users.
*   **POST** `/signup` - Create a new user account.
*   **PUT** `/:id` - Update details or roles.
*   **DELETE** `/:id` - Remove user access.

### Security Note
*   Passwords should be handled securely. The system requires confirmation matching during creation.
*   "External" users are restricted strictly to the `allowedPages` array defined in their profile.

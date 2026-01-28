# 📅 Staff Scheduling System - Documentation

## 1. 📌 Overview

The **Staff Scheduling System** is integrated directly into the **Staff Profile** view, allowing managers to oversee duties, plan rotas, and manage availability on a per-staff basis.

### ✅ Key Features
*   **Interactive Calendar:** Visual monthly view of all assigned shifts.
*   **Shift Management:** Assign shift times (Start/End), locations, and roles.
*   **Availability Tracking:** Mark days as "DAY OFF" to prevent scheduling conflicts.
*   **Detail View:** Click on any shift to see precise timings, hourly rates, and assigned location.

---

## 2. 🚀 Quick Start Guide

### Viewing a Staff Schedule
1.  Navigate to **HR Management**.
2.  Click **"View Profile"** on a staff member.
3.  Select the **"Scheduling & Rota"** tab.
4.  The calendar will display the current month's rota.

### Managing Shifts
*   **Add Shift:** (Assuming Admin permissions) Click on a date to assign a new shift or modify an existing one.
*   **Check Details:** Hover over a date to see a quick summary; click to see full details in a popup.
*   **Navigate Months:** Use the **Left/Right Arrows** above the calendar to plan future months.

### Shift Types
*   **Regular Shift:** Displays time range (e.g., "08:00 - 20:00") and location. Highlights in **Red** if busy.
*   **Day Off:** Marked explicitly as "DAY OFF". Highlights in **Green**.

---

## 3. 🛠️ Implementation Details

### Components
*   **Page:** `src/app/Staff-Profile/page.js` (Container)
*   **Component:** `src/app/(component)/rotacalendar/RotaCalendar.js` & `FullRotaCalendar.js`
*   **Logic:**
    *   `getShiftForDate(day)`: Filters the `shifts` array matching the current calendar cell.
    *   **Visuals:** Uses conditional CSS classes (`bg-red-500` vs `bg-green-500`) to distinguish working days from rest days.

### Data Structure
```javascript
{
  date: Date,
  start: String, // "08:00"
  end: String,   // "20:00"
  type: String,  // "shift" or "dayoff"
  location: String,
  resident: String // (Optional) Linked Resident Name
}
```

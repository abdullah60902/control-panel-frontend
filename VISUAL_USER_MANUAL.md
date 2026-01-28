# 🖼️ Visual User Guide - How to Use the App

## 1. 🖥️ The Main Dashboard (Home Screen)

This is the first screen you see after logging in. It gives you a "Helicopter View" of the entire care home.

*(See generated image reference: `guide_dashboard_ui.png`)*

### 🔍 Button Breakdown:
| Button / Area | Icon | What it does when you click it |
| :--- | :--- | :--- |
| **Search Bar** | 🔍 | Type a name (e.g., "Alice") to instantly find a Resident or Staff member. |
| **Bell Icon** | 🔔 | Shows alerts (e.g., "Medication Stock Low", "Training Expired"). |
| **Total Residents** | 👥 | Click this large card to jump straight to the **Resident List**. |
| **Incidents Card** | ⚠️ | Shows "Run Rate" of accidents. Click to view the **Incident Report Log**. |
| **Add Resident** | ➕ | **Quick Action:** Opens a form to admit a new person immediately. |

---

## 2. 👵 Resident Profile (The Digital Care File)

When you click on a Resident's name, you see this screen. It replaces the old paper binder.

### 📱 Screen Layout (Mockup)
```text
+-----------------------------------------------------------+
| [ PHOTO ]  Alice Smith (Room 102)        [Active Status]  |
|                                                           |
|  [TABS]:  Bio | Care Plan | Meds | Daily Logs | Risks     |
+-----------------------------------------------------------+
|                                                           |
|  TODAY'S LOGS:                                            |
|  08:00 AM - Ate Breakfast (Porridge) - [Staff: Sarah]     |
|  10:00 AM - Refused Tea              - [Staff: John]      |
|                                                           |
|                                          [ + ADD LOG ]    |
+-----------------------------------------------------------+
```

### 👆 Action Buttons:
*   **[Bio Tab]:** View allergies, GP contact, and next of kin.
*   **[Care Plan Tab]:** Read *how* to care for Alice (e.g., "Needs assistance walking").
*   **[+ ADD LOG] (Blue Button):**
    *   **Clicking this...** Opens a popup.
    *   **You do:** Type a note (e.g., "Alice had a fall").
    *   **Result:** The note is saved forever with the time and your name.

---

## 3. 💊 Medication Check (eMAR System)

This screen replaces the paper MAR charts. It is used 4 times a day (Morning, Lunch, Tea, Bed).

### 📱 Screen Layout (Mockup)
```text
+-----------------------------------------------------------+
|  MEDICATION ROUND: MORNING (08:00)                        |
+-----------------------------------------------------------+
|  1. Paracetamol 500mg                                     |
|     Dose: 2 Tablets  |  Stock: 24 (OK)                    |
|     [ GIVE (Green) ]      [ REFUSE (Red) ]                |
+-----------------------------------------------------------+
|  2. Ibuprofen 200mg                                       |
|     Dose: 1 Tablet   |  Stock: 4 (LOW!)                   |
|     [ GIVE (Green) ]      [ REFUSE (Red) ]                |
+-----------------------------------------------------------+
```

### 👆 "Giving Meds" Workflow:
1.  **Click [GIVE] (Green Button):**
    *   System asks: "Confirm you are giving 2 Tablets?"
    *   **Click Confirm.**
    *   **Result:** The button turns Grey ("Given"). Stock count drops from 24 -> 22.
2.  **Click [REFUSE] (Red Button):**
    *   System asks: "Reason?" (Dropdown: Refused, Asleep, Hospital).
    *   **Select Reason & Save.**
    *   **Result:** Logged as "Missed Dose" for the manager to review.

---

## 4. 📅 Staff Rota (Scheduling)

Used by Managers to ensure the home is safe.

### 📱 Screen Layout (Mockup)
```text
+-----------------------------------------------------------+
|  <  January 2026  >                     [ + ADD SHIFT ]   |
+-----------------------------------------------------------+
| MON 01 | TUE 02 | WED 03 | THU 04 | FRI 05 | SAT 06 |...  |
| [Red]  | [Red]  | [Grn]  | [Red]  | [Red]  | [Grn]  |...  |
| 08-20  | 08-20  | OFF    | 08-20  | 08-20  | OFF    |...  |
+-----------------------------------------------------------+
```

### 👆 How to Schedule:
1.  **Click on a Date Box:**
    *   A popup appears.
2.  **Select Action:**
    *   Option A: **Assign Shift** -> Choose Start/End Time (e.g., 08:00 - 20:00).
    *   Option B: **Mark Day Off** -> Click "Day Off" button.
3.  **Result:** The calendar box changes color (Red for working, Green for rest).

---

## 5. 📂 Documents (The Filing Cabinet)

Use this to store PDFs instead of losing them in folders.

*   **[UPLOAD] Button:** Click to pick a file from your computer.
*   **"Expiry Date" Field:** Important! If you set this date, the system will **turn the file yellow** 30 days before it expires.
*   **[Eye Icon] 👁️:** Click to preview the document instantly on the screen without downloading it.

---

## 🚀 Summary of Key "Power Buttons"

| Icon | Name | Super Power |
| :--- | :--- | :--- |
| 🖨️ | **Export PDF** | Turns any screen (Rota, Care Plan) into a printable customized PDF document. |
| 🗑️ | **Delete (Trash)** | Removes items. **Warning:** The system usually asks "Are you sure?" to prevent accidents. |
| ✏️ | **Edit (Pencil)** | Unlocks a record so you can change details (e.g., correct a spelling mistake). |
| 💾 | **Save / Submit** | The most important button. Always click this to make your changes permanent. |

---

**Visual Note:** While this document describes the layouts, the actual app uses a "Dark Mode" theme (Dark Blue/Grey backgrounds) to be easy on the eyes during night shifts.

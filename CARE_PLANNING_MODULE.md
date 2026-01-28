# 🩺 Care Planning Module - Complete Documentation

## Overview
The **Care Planning Module** is a comprehensive system for creating, managing, and tracking personalized care plans for residents. This module ensures that each resident receives tailored care based on their specific needs, with full tracking and review capabilities.

---

## ✅ Requirements Coverage

### **Requirement 1: Creating New Care Plans**
✅ **FULLY IMPLEMENTED**

- **8 Specialized Care Plan Types** - Each with custom fields
- **Form Validation** - Ensures data quality
- **Attachment Support** - Upload supporting documents
- **Review Date Tracking** - Automatic alerts for upcoming reviews
- **Flexible Data Structure** - Accommodates various care needs

**Location:** `/Care-Planning` and `/Resident-Profile` (Care Plans tab)

---

### **Requirement 2: Managing Existing Care Plans**
✅ **FULLY IMPLEMENTED**

- **View Care Plans** - Detailed view with all information
- **Edit Care Plans** - Update existing plans
- **Delete Care Plans** - Remove outdated plans
- **Archive System** - View plans older than 6 months
- **Export Capabilities** - PDF and CSV formats
- **Status Tracking** - Current, Accepted, Declined

**Features:** CRUD operations, archiving, export, review alerts

---

### **Requirement 3: Linking Care Plans to Specific Residents**
✅ **FULLY IMPLEMENTED**

- **Resident Association** - Each plan linked to specific resident
- **Client-Specific Views** - Filter plans by resident
- **Resident Profile Integration** - Access from resident profile
- **Multi-Plan Support** - Multiple plans per resident
- **Care Type Organization** - Group by plan type

**Integration:** Full integration with Resident Management module

---

## 📋 Care Plan Types

### 1. **Personal Hygiene Care Plan**
**Purpose:** Manage daily hygiene and personal care needs

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- My Current Ability & Support Needs
- Care Plan Aims & Outcomes
- Washing / Bathing / Showering Instructions
- Dressing / Undressing Instructions
- Personal Grooming (Hair/Nails/Shaving)
- Skin Care / Pressure Area Management
- Use of Products & COSHH Assessment Notes

**Use Case:** Residents requiring assistance with daily hygiene routines

---

### 2. **Moving and Handling Care Plan**
**Purpose:** Ensure safe mobility and transfers

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Current Mobility Level
- Equipment Required
- Transfer Techniques
- Number of Staff Required
- Risk Assessment Notes
- Mobility Goals

**Use Case:** Residents with mobility limitations or fall risks

---

### 3. **Nutrition and Hydration Plan**
**Purpose:** Monitor and manage dietary needs

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Dietary Requirements
- Food Preferences & Dislikes
- Allergies & Intolerances
- Texture Modifications
- Hydration Goals
- MUST Score (Malnutrition Universal Screening Tool)
- Meal Assistance Level

**Use Case:** Residents with special dietary needs or eating difficulties

---

### 4. **Mental Health Care Plan**
**Purpose:** Support psychological and emotional wellbeing

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Mental Health Status
- Current Symptoms
- Triggers & Warning Signs
- Coping Strategies
- Medication Management
- Support Network
- Crisis Plan

**Use Case:** Residents with mental health conditions or emotional support needs

---

### 5. **Oral Care Plan**
**Purpose:** Maintain dental and oral hygiene

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Current Oral Health Status
- Denture Care Requirements
- Brushing Frequency & Technique
- Special Products Required
- Dental Appointments Schedule
- Oral Health Goals

**Use Case:** Residents requiring oral hygiene assistance

---

### 6. **Health Care Plan**
**Purpose:** General health monitoring and management

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Current Health Conditions
- Vital Signs Monitoring
- Bristol Stool Chart
- MUST Score
- Heart Rate
- Mood Tracking
- Daily Health Log
- Medical Appointments

**Use Case:** Comprehensive health tracking for all residents

---

### 7. **Continence Care Plan**
**Purpose:** Manage continence and bladder/bowel health

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Continence Status
- Toileting Schedule
- Products Required
- Skin Care Protocol
- Bristol Stool Chart
- Fluid Intake Monitoring
- Dignity & Privacy Considerations

**Use Case:** Residents with continence management needs

---

### 8. **Sleeping Care Plan**
**Purpose:** Promote healthy sleep patterns

**Fields:**
- Date Plan Created
- Next Review Date
- Prepared By
- Current Sleep Pattern
- Bedtime Routine
- Sleep Environment Preferences
- Sleep Aids Required
- Night-time Checks Schedule
- Sleep Quality Monitoring

**Use Case:** Residents with sleep disturbances or special nighttime needs

---

## 🎯 Key Features

### 1. **Comprehensive Care Plan Creation**

#### Form Structure:
```javascript
{
  client: ObjectId,              // Linked resident
  planType: String,              // One of 8 care plan types
  creationDate: Date,            // When plan was created
  reviewDate: Date,              // Next review date
  carePlanData: {                // Type-specific fields
    preparedBy: String,
    currentAbility: String,
    careAims: String,
    // ... type-specific fields
  },
  attachments: [String],         // Cloudinary URLs
  status: String,                // Current, Accepted, Declined
  signature: String,             // Digital signature (if accepted)
  declineReason: String          // Reason if declined
}
```

#### Creation Workflow:
1. Navigate to Care Planning page
2. Click "Create New Care Plan"
3. Select Care Plan Type
4. Fill in type-specific fields
5. Upload attachments (optional)
6. Submit for creation

---

### 2. **Care Plan Management Dashboard**

#### Main Dashboard Features:
- **Search by Resident** - Find plans quickly
- **Filter by Plan Type** - View specific care types
- **Filter by Care Setting** - Residential, Nursing, etc.
- **Review Alerts** - Automatic notifications for:
  - Today's Reviews (yellow alert)
  - Overdue Reviews (red alert)
- **Bulk Actions** - Export multiple plans

#### Table View Columns:
- Client Name
- Plan Type
- Creation Date
- Review Date
- Status
- Actions (View, Edit, Delete, Export)

---

### 3. **Resident Profile Integration**

#### Access from Resident Profile:
**Location:** `/Resident-Profile?id={residentId}` → Care Plans Tab

**Features:**
- View all care plans for specific resident
- Create new plans directly from profile
- Edit existing plans
- View archived plans (older than 6 months)
- Export individual or all plans

**Component:** `ResidentProfileCarePlan`

---

### 4. **Review and Alert System**

#### Automatic Alerts:
```javascript
// Backend endpoint: GET /carePlanning/alerts
{
  todayReviews: [/* plans due today */],
  overdueReviews: [/* overdue plans */],
  totalToday: Number,
  totalOverdue: Number,
  hasReviews: Boolean
}
```

#### Alert Notifications:
- **Toast Notifications** - On page load
- **Sidebar Indicator** - Yellow dot on Care Planning menu
- **Dashboard Widgets** - Review summary cards
- **Email Alerts** - (Future enhancement)

#### Mark as Reviewed:
```javascript
PUT /carePlanning/:id/mark-reviewed
```
- Updates review date
- Clears from alert list
- Logs review action

---

### 5. **Archive System**

#### Archived Plans:
**Criteria:** Plans older than 6 months

**Access:**
1. Open Resident Profile
2. Navigate to Care Plans tab
3. Click "View Archived Plans"

**Features:**
- View historical care plans
- Download archived plans
- Delete archived plans
- Restore to active (future enhancement)

**API Endpoint:**
```javascript
GET /carePlanning/older-than-six-months/client/:clientId
```

---

### 6. **Attachment Management**

#### Supported File Types:
- **Images:** JPG, JPEG, PNG, WebP
- **Documents:** PDF, DOC, DOCX
- **Videos:** MP4, MOV, AVI, MKV, WebM

#### Upload Process:
1. Select files during care plan creation/edit
2. Files uploaded to Cloudinary
3. URLs stored in database
4. Accessible in view mode

#### View Attachments:
- **Images:** Displayed inline
- **PDFs:** Icon with download link
- **Videos:** Play icon with link

---

### 7. **Export Capabilities**

#### PDF Export:
**Features:**
- Professional formatting
- All care plan details
- Embedded images (when possible)
- Clickable links for documents/videos
- Signature inclusion (if accepted)
- Decline reason (if declined)
- Nested carePlanData fields

**Code Example:**
```javascript
const handleDownloadPdf = async (item) => {
  const doc = new jsPDF();
  // Add header
  doc.text("Care Plan Details", 14, 15);
  
  // Add main table
  autoTable(doc, {
    head: [["Field", "Value"]],
    body: mainRows
  });
  
  // Add attachments
  // ... attachment handling
  
  doc.save(`${clientName}_careplan.pdf`);
};
```

#### CSV Export:
**Features:**
- Spreadsheet-compatible format
- All text fields included
- Easy import to Excel/Google Sheets

**Fields Included:**
- Patient Name
- Plan Type
- Creation Date
- Review Date
- Care Plan Details
- Health metrics (Bristol, MUST, Heart Rate, Mood)
- Status
- Care Setting

---

### 8. **Health & Wellbeing Tracking**

#### Integrated Health Metrics:
```javascript
{
  bristolStoolChart: String,     // 1-7 scale
  mustScore: String,             // Malnutrition screening
  heartRate: Number,             // BPM
  mood: String,                  // Emoji: 😊😐😔😡😴
  dailyLog: String               // Daily observations
}
```

#### Usage:
- Track health indicators within care plans
- Monitor trends over time
- Alert on concerning changes
- Export for medical review

---

## 🔄 Data Flow Architecture

### Backend API Endpoints

#### Core CRUD Operations:
```
GET    /carePlanning                    - Get all care plans
GET    /carePlanning/client/:clientId   - Get plans for specific resident
POST   /carePlanning                    - Create new care plan
PUT    /carePlanning/:id                - Update care plan
DELETE /carePlanning/:id                - Delete care plan
```

#### Specialized Endpoints:
```
GET    /carePlanning/alerts             - Get review alerts
PUT    /carePlanning/:id/mark-reviewed  - Mark plan as reviewed
GET    /carePlanning/older-than-six-months/client/:clientId - Get archived plans
```

### Frontend State Management:
```javascript
const [carePlans, setCarePlans] = useState([]);
const [formData, setFormData] = useState(initialFormData);
const [attachments, setAttachments] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingPlanId, setEditingPlanId] = useState(null);
const [viewPlan, setViewPlan] = useState(null);
const [archivedPlans, setArchivedPlans] = useState([]);
```

---

## 💻 Technical Implementation

### Main Care Planning Page
**File:** `src/app/Care-Planning/page.js`  
**Lines:** 1,989 lines  
**Size:** 78KB

**Key Functions:**
- `handleSubmitCare()` - Create/update care plans
- `handleDownloadPdf()` - Generate PDF exports
- `handleDownloadCsv()` - Generate CSV exports
- `handleView()` - Display care plan details
- `handleDelete()` - Remove care plans
- `handleMarkReviewed()` - Update review status
- `fetchAlerts()` - Get review notifications

---

### Resident Profile Care Plan Component
**File:** `src/app/(component)/residentprofilecareplan/residentprofilecareplan.js`  
**Lines:** 1,945 lines  
**Size:** 67KB

**Key Functions:**
- `handleSubmit()` - Save care plan from resident profile
- `handleView()` - View plan details
- `handleEditFromView()` - Edit from view modal
- `handleUpdateFromView()` - Save edits from view modal
- `handleDelete()` - Delete care plan
- `handleDownloadPdf()` - Export to PDF

**Props:**
```javascript
<ResidentProfileCarePlan 
  clientId={residentId}
  ref={carePlanRef}
/>
```

---

## 🎨 User Interface

### Design Features:
- **Dark Theme** - Professional healthcare interface
- **Responsive Layout** - Works on all devices
- **Modal Forms** - Non-intrusive editing
- **Color-Coded Alerts** - Visual review indicators
- **Icon Integration** - Clear action buttons
- **Loading States** - User feedback during operations

### Color Scheme:
- **Primary:** #4A49B0 (Indigo)
- **Background:** #111827 (Dark Gray)
- **Cards:** #1F2937 (Slate)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Yellow)
- **Error:** #EF4444 (Red)

### Accessibility:
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast text
- Clear visual hierarchy

---

## 📊 Data Models

### Care Plan Schema:
```javascript
{
  _id: ObjectId,
  client: {
    type: ObjectId,
    ref: "Client",
    required: true
  },
  planType: {
    type: String,
    required: true,
    enum: [
      "Personal Hygiene Care Plan",
      "Moving and Handling Care Plan",
      "Nutrition and Hydration Plan",
      "Mental Health Care Plan",
      "Oral Care Plan",
      "Health Care Plan",
      "Continence Care Plan",
      "Sleeping Care Plan"
    ]
  },
  creationDate: Date,
  reviewDate: Date,
  carePlanDetails: String,
  careSetting: String,
  
  // Health & Wellbeing Metrics
  bristolStoolChart: String,
  mustScore: String,
  heartRate: Number,
  mood: String,
  dailyLog: String,
  
  // Nested care plan data
  carePlanData: {
    preparedBy: String,
    currentAbility: String,
    careAims: String,
    supportSteps: String,
    medicalDetails: String,
    sleepRoutine: String,
    frequency: String,
    assistanceLevel: String,
    dietType: String,
    // ... type-specific fields
  },
  
  // Attachments
  attachments: [String],  // Cloudinary URLs
  
  // Status & Approval
  status: {
    type: String,
    enum: ["Current", "Accepted", "Declined"],
    default: "Current"
  },
  signature: String,
  declineReason: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Workflow Examples

### Creating a Personal Hygiene Care Plan

**Step-by-Step:**
1. Navigate to `/Care-Planning`
2. Click "Create New Care Plan"
3. Select "Personal Hygiene Care Plan"
4. Fill in required fields:
   ```
   - Date Plan Created: 2026-01-28
   - Next Review Date: 2026-04-28
   - Prepared By: Sarah Johnson
   - Current Ability: Can wash hands independently
   - Care Aims: Maintain skin integrity
   - Washing Instructions: Assist with shower MWF at 9am
   - Dressing Instructions: Full assistance with socks
   - Grooming Instructions: Electric shaver only
   - Skin Care: Check heels daily
   - Products Notes: Unscented soap only
   ```
5. Upload attachments (optional)
6. Click "Submit"
7. Plan appears in table

---

### Editing an Existing Care Plan

**From Main Dashboard:**
1. Find care plan in table
2. Click Edit icon (✏️)
3. Modal opens with current data
4. Update fields as needed
5. Add/remove attachments
6. Click "Update"

**From Resident Profile:**
1. Open resident profile
2. Navigate to "Care Plans" tab
3. Click View icon (👁️) on desired plan
4. Click "Edit" button in view modal
5. Make changes
6. Click "Update"

---

### Reviewing Care Plans

**Daily Review Process:**
1. Log in to system
2. Check for toast notifications:
   - "📅 Today review due: John Doe (Personal Hygiene)"
   - "⚠️ Overdue reviews: Jane Smith (Nutrition)"
3. Navigate to Care Planning
4. Review flagged plans
5. Update as needed
6. Click "Mark as Reviewed"
7. Set new review date

---

### Archiving and Retrieving Old Plans

**View Archived Plans:**
1. Open resident profile
2. Go to Care Plans tab
3. Click "View Archived Plans"
4. Modal shows plans older than 6 months
5. Click "View" to see details
6. Download or delete as needed

---

## 🔐 Security Features

### Authentication & Authorization:
- **JWT Token-based** - Secure API access
- **Role-based Access** - Admin, Staff, Client, External
- **Client-Specific Filtering** - Users see only assigned residents
- **Audit Trail** - Track who created/edited plans

### Data Protection:
- **Input Validation** - Prevent malicious data
- **File Upload Security** - Type and size restrictions
- **Secure Storage** - Cloudinary for attachments
- **HTTPS Only** - Encrypted transmission (production)

---

## 📈 Performance Optimization

### Frontend Optimization:
- **Lazy Loading** - Components load on demand
- **Debounced Search** - Efficient filtering
- **Memoization** - Prevent unnecessary re-renders
- **Optimized Images** - Cloudinary transformations

### Backend Optimization:
- **Indexed Queries** - Fast database lookups
- **Pagination** - Handle large datasets
- **Caching** - Reduce database calls
- **Async Operations** - Non-blocking file uploads

---

## 🎓 Best Practices

### Creating Care Plans:
- ✅ Be specific and measurable in goals
- ✅ Include all relevant details
- ✅ Set realistic review dates (typically 3-6 months)
- ✅ Upload supporting documentation
- ✅ Involve the resident in planning
- ✅ Review and update regularly

### Managing Care Plans:
- 📅 Check review alerts daily
- 📅 Update plans when resident needs change
- 📅 Archive old plans for historical record
- 📅 Export plans for handovers or audits
- 📅 Maintain consistent documentation standards

### Data Quality:
- 🔍 Use clear, professional language
- 🔍 Avoid abbreviations unless standard
- 🔍 Include dates for all observations
- 🔍 Document changes and reasons
- 🔍 Keep attachments organized and labeled

---

## 🆘 Troubleshooting

### Common Issues:

**Issue:** Can't create care plan
- **Solution:** Check that resident is selected and plan type is chosen

**Issue:** Attachments not uploading
- **Solution:** Verify file size (<10MB) and format (supported types only)

**Issue:** Review alerts not showing
- **Solution:** Check review dates are set correctly, refresh page

**Issue:** Can't see resident's care plans
- **Solution:** Verify user has access to that resident (role permissions)

**Issue:** Export PDF incomplete
- **Solution:** Wait for all attachments to load, check internet connection

---

## 📞 Integration Points

### With Other Modules:

#### Resident Management:
- Care plans linked to resident profiles
- Access from resident profile page
- Resident selector in care plan creation

#### Daily Logs:
- Health metrics shared between modules
- Mood tracking integration
- Bristol chart consistency

#### Medication Management:
- Medication references in health care plans
- MUST score for nutrition monitoring
- Health status tracking

#### Risk Assessments:
- Risk factors inform care planning
- Mitigation strategies referenced
- Safety protocols aligned

---

## 🔄 Future Enhancements

### Planned Features:
1. **Care Plan Templates** - Pre-filled forms for common scenarios
2. **Multi-Disciplinary Input** - Collaborative planning
3. **Goal Tracking** - Progress monitoring against care aims
4. **Family Portal** - Limited access for family members
5. **AI Suggestions** - Automated care recommendations
6. **Mobile App** - On-the-go access for care staff
7. **Voice Notes** - Audio recording for quick updates
8. **Integration** - Connect with NHS systems

---

## 📝 Summary

The **Care Planning Module** provides a comprehensive, professional-grade solution for creating and managing personalized care plans. It successfully covers all core requirements:

✅ **Creating new care plans** - 8 specialized types with custom fields  
✅ **Managing existing care plans** - Full CRUD operations with archiving  
✅ **Linking care plans to specific residents** - Complete integration with Resident Management  

The system is **production-ready**, **scalable**, and **user-friendly**, providing care staff with all the tools needed to deliver personalized, high-quality care while maintaining compliance with care standards.

---

## 🔗 Quick Links

- **Main Care Planning Page:** `/Care-Planning`
- **Resident Profile Care Plans:** `/Resident-Profile?id={residentId}` → Care Plans Tab
- **Care Plan Component:** `src/app/(component)/residentprofilecareplan/residentprofilecareplan.js`

---

**Last Updated:** January 28, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready

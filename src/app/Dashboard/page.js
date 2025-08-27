"use client";
import React, { useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import axios from "axios";
import { SiSimpleanalytics } from "react-icons/si";
import { IoDocumentAttach } from "react-icons/io5";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OccupancyChart from "@/app/(component)/occupancyChart/OccupancyChart";
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle, // ✅ Keep only once
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaUserCog,
  FaClipboardCheck,
  FaExclamationCircle,
  FaUserPlus,
  FaFileMedical,
  FaUserTie,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import Link from "next/link";
import { GrDocumentPerformance } from "react-icons/gr";
import { inc, set } from "nprogress";
import { toast } from "react-toastify";
import { MdMedicationLiquid } from "react-icons/md";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasClients } = useAuth();

  const navItems = [
  { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard", active: true },
  { icon: <FaUser />, label: "Resident Management", href: "/Client-Management" },
  { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
  { icon: <MdMedicationLiquid />, label: "Medication Management", href: "/Medication-Management" },
  { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
  ...(hasClients
    ? []
    : [
        { icon: <FaSearch />, label: "Social Activity", href: "/Social-Activity" },
        { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
        { icon: <IoDocumentAttach />, label: "Documents Management", href: "/Documents-Management" },
        { icon: <GrDocumentPerformance />, label: "Performance-Manag..", href: "/Performance-Management" },
        { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
        { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
        { icon: <SiSimpleanalytics />, label: "Reporting Analytics", href: "/Analytics" },
        { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
      ]),
];


  // care plane ------------------------------------------------------------------------------------------------
  const [carePlans, setCarePlans] = useState([]);
  const [formDataCare, setFormDataCare] = useState({
    client: "",
    planType: "",
    creationDate: "",
    reviewDate: "",
    carePlanDetails: "",
    bristolStoolChart: "",
    mustScore: "",
    heartRate: "",
    mood: "",
    dailyLog: "",
    careSetting: "", // ✅ NEW FIELD
  });

  const hansleCloseFormCare = () => {
    setShowFormCare(false);
    setAttachments([]);
    setFormDataCare({
      client: "",
      planType: "",
      creationDate: "",
      reviewDate: "",
      carePlanDetails: "",
      bristolStoolChart: "",
      mustScore: "",
      heartRate: "",
      mood: "",
      dailyLog: "",
      careSetting: "", // Reset new field
    });
  };

  // care plane ------------------------------------------------------------------------------------------------

  const [showFormCare, setShowFormCare] = useState(false);
  const handleChangeCare = (e) => {
    const { name, value } = e.target;
    setFormDataCare((prev) => ({ ...prev, [name]: value }));
  };

  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members

  // Optional: Handle form submit
  const handleSubmitCare = (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    for (let key in formDataCare) {
      formData.append(key, formDataCare[key]);
    }

    // Check if editing: add Cloudinary URLs (old ones) and new files

    // New upload
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .post(`http://localhost:3000/carePlanning`, formData, config)
      .then((res) => {
        toast.success("Care plan saved successfully");
        setShowFormCare(false);
        setLoading(false);
        setAttachments([]);
        setFormDataCare({
          client: "",
          planType: "",
          creationDate: "",
          reviewDate: "",
          carePlanDetails: "",
          bristolStoolChart: "",
          mustScore: "",
          heartRate: "",
          mood: "",
          dailyLog: "",
          careSetting: "",
          attachments: [],
        });
        console.log("Care plan saved successfully:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        setError(err.response?.data?.msg || "An error occurred");
        toast.error(err.response?.data?.msg || "An error occurred");
        setLoading(false); // Reset loading state on error
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStaffMembers(response.data.clients); // Staff data set
        setMessage("Staff fetched successfully");
      })
      .catch((error) => {
        setError(error.response?.data?.msg || "Failed to fetch staff");
      });
  }, []);

  // incidient -------------------------------------------------------------------------------------------------------------
  const [inci, setinci] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setinci(response.data.clients); // Staff data set
        setMessage("Staff fetched successfully");
      })
      .catch((error) => {
        setError(error.response?.data?.msg || "Failed to fetch staff");
      });
  }, []);
  const [sixmont, setsixmont] = useState(0);
  const [open, setopen] = useState(0);
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/incident/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setsixmont(res.data.recentIncidentsCount);
        setopen(res.data.openIncidentsCount);
        setMessage("Incidents fetched successfully");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch incidents");
      }
    };
    fetchIncidents();
  }, []);
  const [incidentData, setIncidentData] = useState([]);
  const [attachmentsincident, setAttachmentsincidebt] = useState([]);
  const handleFileChangeincident = (e) => {
    setAttachmentsincidebt(Array.from(e.target.files));
  };
  const handleChange2incident = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  const [showModal2, setShowModal2] = useState(false);
  const [formData2, setFormData2] = useState({
    incidentDate: "",
    incidentType: "",
    severity: "",
    reportedBy: "",
    client: "",
    incidentDetails: "",
    status: "Open",
    immediateActions: "",
    staffInvolved: "",
    peopleNotified: "",
    outcomeStatus: "",
  });

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log(formData2.client);

    const data = new FormData();
    Object.entries(formData2).forEach(([key, value]) => {
      data.append(key, value);
    });
    attachmentsincident.forEach((file) => {
      data.append("attachments", file);
    });

    axios
      .post(`http://localhost:3000/incident/`, data, config)
      .then((res) => {
        setLoading(false);
        setFormData2({
          incidentDate: "",
          incidentType: "",
          severity: "",
          reportedBy: "",
          incidentDetails: "",
          client: "",
          status: "Open",
          immediateActions: "",
          peopleNotified: "",
          outcomeStatus: "",
          staffInvolved: "",
        });
        console.log("Incident added successfully:", res.data);

        setAttachmentsincidebt([]);
        setShowModal2(false);
        toast.success("Add successfuly");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError(err.response?.data?.msg || "Error occurred");
        toast.error(err.response?.data?.msg || "Error occurred");
      });
  };

  const handleCancel11 = () => {
    setShowModal2(false);
    setFormData2({
      incidentDate: "",
      incidentType: "",
      severity: "",
      reportedBy: "",
      incidentDetails: "",
      client: "",
      status: "Open",
      immediateActions: "",
      peopleNotified: "",
      outcomeStatus: "",
      staffInvolved: "",
    });
    setAttachments([]); // Reset attachments
    setError(""); // Clear any error messages
  };

  // add staf -------------------------------------------------------------------------------------------------------------
  const [showModal3, setShowModal3] = useState(false);
  const [formData3, setFormData3] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    careSetting: "", // <-- Added this
    startDate: "",
  });

  const handleCancel10 = () => {
    setShowModal3(false);
    setFormData3({
      name: "",
      department: "",
      email: "",
      position: "",
      startDate: "",
      careSetting: "", // Reset new field
    });
  };

  const [totalStaffno, setTotalStaffno] = useState(0);
  const [error, setError] = useState(null); // optional error state

  useEffect(() => {
    const fetchHR0 = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/hr", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalStaffno(res.data.totalstaff);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch HR data");
      }
    };
    fetchHR0();
  }, []);

  const [staffData, setStaffData] = useState([]);

  const handleChange3 = (e) => {
    const { name, value } = e.target;
    setFormData3((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStaff = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    const { name, email, position, department, startDate } = formData3;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = {
      fullName: name,
      email: email,
      position: position,
      department: department,
      careSetting: formData3.careSetting, // <-- Add this line
      startDate: startDate,
    };

    axios
      .post(`http://localhost:3000/hr`, payload, config)

      .then((res) => {
        setLoading(false); // Reset loading state
        setFormData3({
          name: "",
          department: "",
          email: "",
          position: "",
          startDate: "",
          careSetting: "", // Reset new field
        });
        console.log("Staff added successfully:", res.data);
        setStaffData(res.data); // Update staff data
        setShowModal3(false);
        toast.success("Add successfuly");
      })
      .catch((err) => {
        setLoading(false); // Reset loading statelog
        console.error("Error:", err.response?.data || err.message);
        toast.error(err.response?.data?.msg || "An error occurred");
      });
  };

  // add client  --------------------------------------------------------------------------------------------------------------

  const [showModal, setShowModal] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [occupiedRooms0, setOccupiedRooms0] = useState(0);
  const [occupancyPercentage, setOccupancyPercentage] = useState(0);
  useEffect(() => {
    const fetchHR = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalClients(res.data.totalClients);
        setAvailableRooms(res.data.totalAvailableRooms);
        setOccupiedRooms0(res.data.currentOccupancy);
        setOccupancyPercentage(res.data.occupancyPercentage);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch HR data");
      }
    };
    fetchHR();
  }, []);

  // Form data state

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    room: "",
    careType: "",
    admitDate: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false); // Loading state for form submission

  // Optional: Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted
    const { name, age, room, careType, admitDate } = formData;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = {
      fullName: name,
      age: age,
      roomNumber: room,
      careType: careType,
      admissionDate: admitDate,
    };

    axios
      .post(`http://localhost:3000/client`, payload, config)
      .then((res) => {
        setFormData({
          name: "",
          age: "",
          room: "",
          careType: "",
          admitDate: "",
        });
        setLoading(false); // Reset loading state after submission
        setShowModal(false);
        toast.success("Add successfuly");

        return axios.get("http://localhost:3000/client", config);
      })
      .then((res) => {
        console.log("Updated Client Data:", res.data.clients);
        setTotalClients(res.data.totalClients);
        setAvailableRooms(res.data.totalAvailableRooms);
        setOccupiedRooms0(res.data.currentOccupancy);
        setOccupancyPercentage(res.data.occupancyPercentage);
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        setLoading(false); // Reset loading state on error
        setError(err.response?.data?.msg || "An error occurred");
        toast.error(err.response?.data?.msg || "An error occurred");
      });
  };

  // shedule staff training-------------------------------------------------------------------------------------------------------------------
  const [attachmentsTraining, setAttachmentsTraining] = useState([]);

  const trainingRecommendations = {
    "Residential Care": ["Safeguarding", "Dementia Care", "Fire Safety"],
    "Nursing Homes": [
      "First Aid",
      "Medication Administration",
      "Infection Control",
    ],
    "Learning Disabilities": ["Autism & Learning Disabilities", "Epilepsy"],
    "Supported Living": ["Fire Safety", "Diabetes", "Moving & Handling"],
    "Mental Health Support": ["Mental Health", "Safeguarding", "GDPR"],
    "Domiciliary Care": ["Infection Control", "Moving & Handling", "GDPR"],
    "Other Services": ["First Aid", "Fire Safety", "Safeguarding"],
  };

  const handleFileChangeTraining = (e) => {
    setAttachmentsTraining(Array.from(e.target.files));
  };

  const handleCancel9 = () => {
    setShowForm4(false);
    setFormData4({
      staffName: "",
      trainingType: "",
      completionDate: "",
      expiryDate: "",
      notes: "",
    });
    setAttachmentsTraining([]);
  };

  const [recommendedTrainings, setRecommendedTrainings] = useState([]);

  const getRecommendedTrainings = (staffId) => {
    const staff = staffMembers2.find((s) => s._id === staffId);
    if (!staff || !staff.careSetting) return [];
    return trainingRecommendations[staff.careSetting] || [];
  };

  const [showForm4, setShowForm4] = useState(false);
  const [formData4, setFormData4] = useState({
    staffName: "",
    trainingType: "",
    completionDate: "",
    expiryDate: "",
    notes: "",
  });

  const handleChange4 = (e) => {
    const { name, value } = e.target;

    setFormData4((prev) => ({
      ...prev,
      [name]: value,
    }));

    // When staff is selected, fetch recommendations
    if (name === "staffName") {
      const rec = getRecommendedTrainings(value);
      setRecommendedTrainings(rec);
    }
  };

  const handleSubmit4 = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    const { staffName, trainingType, completionDate, expiryDate, notes } =
      formData4;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("staffMember", staffName);
    formData.append("trainingType", trainingType);
    formData.append("completionDate", completionDate);
    formData.append("expiryDate", expiryDate);
    formData.append("notes", notes);

    attachmentsTraining.forEach((file) => {
      formData.append("attachments", file); // same name used in backend
    });

    axios
      .post(`http://localhost:3000/training`, formData, config)
      .then((res) => {
        setMessage(
          editingUserId
            ? "Training updated successfully"
            : "Training added successfully"
        );
        setEditingUserId(null);
        setFormData4({
          staffName: "",
          trainingType: "",
          completionDate: "",
          expiryDate: "",
          notes: "",
        });
        setAttachmentsTraining([]);
        setShowForm4(false);
        setLoading(false); // Reset loading state
        toast.success("Added successfully");

        return axios.get(`http://localhost:3000/training`, config);
      })
      .catch((err) => {
        setLoading(false); // Reset loading state
        setError(err.response?.data?.msg || "An error occurred");
        toast.error(err.response?.data?.msg || "An error occurred");
      });
  };

  const [staffMembers2, setStaffMembers2] = useState([]); // For HR/staff members

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/hr", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStaffMembers2(response.data.allHr); // Staff data set
      })
      .catch((error) => {
        setError(error.response?.data?.msg || "Failed to fetch staff");
      });
  }, []);

  //  ---------------------------------------------------------------------------------------------------------
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/Login");
  }, [user, router]);

  if (!user) return null;
  return (
    <div className="bg-[#111827] min-h-screen">
      <Navbar />

      {/* Mobile Header - visible only on screens < lg */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-800 shadow">
        <h1 className="text-lg text-white font-semibold">Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - responsive behavior */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64  bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
      ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:relative lg:block`}
        >
          <nav className="flex flex-col h-full">
            {/* Navigation Title */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center lg:block">
              <p className="text-sm text-gray-400">Navigation</p>
            </div>

            {/* Nav Items */}
           <div className="flex-1 px-2 py-4 overflow-y-auto">
  {navItems
    .filter(Boolean) // removes false/null/undefined
    .map((item, index) => (
      <Link
        key={index}
        href={item.href || "#"}
        className={`side-menu-item flex items-center px-4 py-3 text-gray-300 rounded-md transition-colors ${
          item.active
            ? "bg-gray-700 text-gray-200"
            : "hover:bg-gray-700 hover:text-gray-200"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <span className="mr-3">{item.icon}</span>
        {item.label}
      </Link>
    ))}
</div>


            {/* User Info */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
                  {user?.fullName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-200">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1  overflow-y-hidden bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-6 hidden md:block">
            Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-700 text-primary text-gray-200">
                  <HiUsers className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    Total Patient
                  </p>
                  <p className="text-2xl font-semibold text-gray-200">
                    {totalClients}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-700 text-gray-200">
                  <FaUsers className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    Staff Members
                  </p>
                  <p className="text-2xl font-semibold text-gray-200">
                    {totalStaffno}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-900 text-red-300">
                  <FaExclamationCircle className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    Open Incidents
                  </p>
                  <p className="text-2xl font-semibold text-gray-200">{open}</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-900 text-yellow-300">
                  <FaClipboardCheck className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    Tasks Due Today
                  </p>
                  <p className="text-2xl font-semibold text-gray-200">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}

          {/* <div className="mt-8"> */}
          <div className="mt-8 bg-gray-800 p-6 mb-8 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Add Resident */}
              <button
                onClick={() => setShowModal(hasClients ? false : true)}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="p-2 rounded-full bg-gray-600 text-gray-200 mb-2">
                  <FaUserPlus className="text-xl text-white" />
                </div>
                <span className="text-sm text-gray-300">Add Resident</span>
              </button>

              {/* New Care Plan */}
              <button
                onClick={() => setShowFormCare(hasClients ? false : true)}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="p-2 rounded-full bg-gray-600 text-gray-200 mb-2">
                  <FaFileMedical className="text-xl text-white" />
                </div>
                <span className="text-sm text-gray-300">New Care Plan</span>
              </button>

              {/* Report Incident */}
              <button
                onClick={() => setShowModal2(hasClients ? false : true)}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="p-2 rounded-full bg-gray-600 text-gray-200 mb-2">
                  <FaExclamationTriangle className="text-xl text-white" />
                </div>
                <span className="text-sm text-gray-300">Report Incident</span>
              </button>

              {/* Add Staff */}
              <button
                onClick={() => setShowModal3(hasClients ? false : true)}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="p-2 rounded-full bg-gray-600 text-gray-200 mb-2">
                  <FaUserTie className="text-xl text-white" />
                </div>
                <span className="text-sm text-gray-300">Add Staff</span>
              </button>

              {/* Staff Schedule */}
              <button
                onClick={() => setShowForm4(hasClients ? false : true)}
                className="cursor-pointer flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                data-module="hr"
              >
                <div className="p-2 rounded-full bg-gray-600 text-gray-200 mb-2">
                  <FaCalendarAlt size={20} className="text-xl text-white" />
                </div>
                <span className="text-sm text-gray-300">Staff Schedule</span>
              </button>
            </div>
          </div>

          <div>
            {/* Add Client Button */}

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0   bg-black/50  flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-8">
                  <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
                    Add Resident
                  </h2>
                  <form onSubmit={handleSubmit} className="p-2">
                    <div className="mb-2">
                      <label
                        htmlFor="name"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="age"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        id="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="room"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Room Number
                      </label>
                      <input
                        type="text"
                        name="room"
                        id="room"
                        value={formData.room}
                        onChange={handleChange}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="careType"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Care Type
                      </label>
                      <select
                        name="careType"
                        id="careType"
                        value={formData.careType}
                        onChange={handleChange}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Care Type</option>
                        <option value="Residential">Residential</option>
                        <option value="Nursing">Nursing</option>
                        <option value="Memory Care">Memory Care</option>
                        <option value="Respite">Respite</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="admitDate"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Admission Date
                      </label>
                      <input
                        type="date"
                        name="admitDate"
                        id="admitDate"
                        value={formData.admitDate}
                        onChange={handleChange}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center justify-center bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white font-bold py-2 px-4 rounded ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                            Please wait...
                          </>
                        ) : (
                          "Add Resident"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal care plan form */}
            {showFormCare && (
              <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                <div className="bg-gray-800 rounded-lg pt-4 shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
                    {/* Care Planning */}
                    {"Add New Care Plan"}
                  </h2>
                  <form
                    id="add-care-plan-form"
                    className="p-4"
                    onSubmit={handleSubmitCare}
                    encType="multipart/form-data"
                  >
                    {/* Client ID */}
                    <div className="mb-4">
                      <label
                        htmlFor="clientId"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Patient
                      </label>
                      <select
                        id="client"
                        name="client"
                        value={formDataCare.client}
                        onChange={handleChangeCare}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Patient</option>
                        {staffMembers
                          .filter(
                            (client) =>
                              user?.role !== "Client" ||
                              user.clients.includes(client._id)
                          )
                          .map((client) => (
                            <option key={client._id} value={client._id}>
                              {client.fullName}
                            </option>
                          ))}
                      </select>
                      <input
                        type="hidden"
                        name="clientName"
                        id="clientName"
                        value={formDataCare.client.fullName}
                      />
                    </div>

                    {/* Plan Type */}
                    <div className="mb-4">
                      <label
                        htmlFor="planType"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Plan Type
                      </label>
                      <select
                        id="planType"
                        name="planType"
                        value={formDataCare.planType}
                        onChange={handleChangeCare}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Plan Type</option>
                        <option value="Nursing">Nursing</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Mobility">Mobility</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Social">Social</option>
                        <option value="routine">Routine</option>
                        <option value="safety">Safety</option>
                        <option value="communication">Communication</option>
                      </select>
                    </div>

                    {/* Creation Date */}
                    <div className="mb-4">
                      <label
                        htmlFor="createDate"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Creation Date
                      </label>
                      <input
                        id="creationDate"
                        name="creationDate"
                        type="date"
                        value={formDataCare.creationDate}
                        onChange={handleChangeCare}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    {/* Review Date */}
                    <div className="mb-4">
                      <label
                        htmlFor="reviewDate"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Review Date
                      </label>
                      <input
                        id="reviewDate"
                        name="reviewDate"
                        type="date"
                        value={formDataCare.reviewDate}
                        onChange={handleChangeCare}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="careSetting"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Care Setting / Service Type
                      </label>
                      <select
                        id="careSetting"
                        name="careSetting"
                        value={formDataCare.careSetting}
                        onChange={handleChangeCare}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Care Setting</option>
                        <option value="Residential Care">
                          Residential Care
                        </option>
                        <option value="Nursing Homes">Nursing Homes</option>
                        <option value="Learning Disabilities">
                          Learning Disabilities
                        </option>
                        <option value="Supported Living">
                          Supported Living
                        </option>
                        <option value="Mental Health Support">
                          Mental Health Support
                        </option>
                        <option value="Domiciliary Care">
                          Domiciliary Care Organisations
                        </option>
                        <option value="Other Services">Other Services</option>
                      </select>
                    </div>
                    {/* Details */}
                    <div className="mb-4">
                      <label
                        htmlFor="details"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Care Plan Details
                      </label>
                      <textarea
                        id="carePlanDetails"
                        name="carePlanDetails"
                        rows="4"
                        value={formDataCare.carePlanDetails}
                        onChange={handleChangeCare}
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      ></textarea>
                    </div>
                    {/* Care Setting */}

                    {/* Health & Wellbeing Recordings Section */}
                    <div className="mb-6 border-t border-gray-700 pt-4 ">
                      <h3 className="text-lg font-semibold text-gray-200 mb-4">
                        Health & Wellbeing Recordings
                      </h3>

                      {/* Bristol Stool Chart */}
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Bristol Stool Chart
                        </label>
                        <input
                          type="text"
                          name="bristolStoolChart"
                          value={formDataCare.bristolStoolChart}
                          onChange={handleChangeCare}
                          placeholder="Type or score..."
                          className="w-full px-3 py-2  rounded bg-gray-700 text-white"
                        />
                      </div>

                      {/* MUST Score */}
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          MUST Score
                        </label>
                        <input
                          type="text"
                          name="mustScore"
                          value={formDataCare.mustScore}
                          onChange={handleChangeCare}
                          placeholder="e.g., 0, 1, 2..."
                          className="w-full px-3 py-2  rounded bg-gray-700 text-white"
                        />
                      </div>

                      {/* Heart Rate */}
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Heart Rate (bpm)
                        </label>
                        <input
                          type="number"
                          name="heartRate"
                          value={formDataCare.heartRate}
                          onChange={handleChangeCare}
                          placeholder="e.g., 72"
                          className="w-full px-3 py-2  rounded bg-gray-700 text-white"
                        />
                      </div>

                      {/* Mood Tracker */}
                      <div className="mb-4">
                        <label className="block  text-gray-300 text-sm font-medium mb-2">
                          Mood Tracker
                        </label>
                        <select
                          name="mood"
                          value={formDataCare.mood}
                          onChange={handleChangeCare}
                          className="w-full px-3 py-2  rounded bg-gray-700 text-white"
                        >
                          <option value="">Select mood</option>
                          <option value="😊">😊 Happy</option>
                          <option value="😐">😐 Neutral</option>
                          <option value="😔">😔 Sad</option>
                          <option value="😡">😡 Angry</option>
                          <option value="😴">😴 Tired</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block  text-gray-300 text-sm font-medium mb-2">
                          Attach Photo/Document
                        </label>
                        <input
                          type="file"
                          name="attachments"
                          onChange={handleFileChange}
                          multiple
                          className="w-full px-3 py-2  rounded bg-gray-700 text-white"
                        />
                      </div>
                      {/* Daily Log */}
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Daily Log
                        </label>
                        <textarea
                          name="dailyLog"
                          value={formDataCare.dailyLog}
                          onChange={handleChangeCare}
                          rows="3"
                          placeholder="Write log with timestamp and caregiver info..."
                          className="w-full px-3 py-2  rounded bg-gray-700 text-white"
                        />
                      </div>

                      {/* Attach File */}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end pt-4 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={hansleCloseFormCare}
                        className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded mr-2"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center justify-center bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white font-bold py-2 px-4 rounded ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                            Please wait...
                          </>
                        ) : (
                          "Create Care Plan"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal incident */}
            {showModal2 && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
                    Add Incident Report
                  </h2>
                  <form
                    id="add-incident-form"
                    className="p-4"
                    onSubmit={handleSubmit2}
                  >
                    {/* Client */}
                    <div className="mb-4">
                      <label
                        htmlFor="clientId"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Patient
                      </label>
                      <select
                        id="client"
                        name="client"
                        value={formData2.client}
                        onChange={handleChange2}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Patient</option>
                        {inci
                          .filter(
                            (client) =>
                              user?.role !== "Client" ||
                              user.clients.includes(client._id)
                          )
                          .map((client) => (
                            <option key={client._id} value={client._id}>
                              {client.fullName}
                            </option>
                          ))}
                      </select>
                      <input
                        type="hidden"
                        name="clientName"
                        id="clientName"
                        value={formData2.client.fullName}
                      />
                    </div>

                    {/* Date */}
                    <div className="mb-4">
                      <label
                        htmlFor="incidentDate"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Incident Date
                      </label>
                      <input
                        type="date"
                        id="incidentDate"
                        name="incidentDate"
                        value={formData2.incidentDate}
                        onChange={handleChange2}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      />
                    </div>

                    {/* Incident Type */}
                    <div className="mb-4">
                      <label
                        htmlFor="incidentType"
                        className="block  text-gray-300 text-sm font-medium mb-2"
                      >
                        Incident Type
                      </label>
                      <select
                        id="incidentType"
                        name="incidentType"
                        value={formData2.incidentType}
                        onChange={handleChange2}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      >
                        <option value="">Select Incident Type</option>
                        <option value="Fall">Fall</option>
                        <option value="Medication Error">
                          Medication Error
                        </option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="Property Damage">Property Damage</option>
                        <option value="Injury">Injury</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Severity */}
                    <div className="mb-4">
                      <label
                        htmlFor="severity"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Severity
                      </label>
                      <select
                        id="severity"
                        name="severity"
                        value={formData2.severity}
                        onChange={handleChange2}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      >
                        <option value="">Select Severity</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    {/* Reported By */}
                    <div className="mb-4">
                      <label
                        htmlFor="reportedBy"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Reported By
                      </label>
                      <input
                        type="text"
                        id="reportedBy"
                        name="reportedBy"
                        value={formData2.reportedBy}
                        onChange={handleChange2}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      />
                    </div>
                    {/* Details */}
                    <div className="mb-4">
                      <label
                        htmlFor="incidentDetails"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Incident Details
                      </label>
                      <textarea
                        id="incidentDetails"
                        name="incidentDetails"
                        rows="4"
                        value={formData2.incidentDetails}
                        onChange={handleChange2}
                        required
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="immediateActions"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Immediate Actions Taken
                      </label>
                      <textarea
                        id="immediateActions"
                        name="immediateActions"
                        rows="3"
                        value={formData2.immediateActions}
                        onChange={handleChange2}
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="peopleNotified"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        People Notified (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="peopleNotified"
                        name="peopleNotified"
                        value={formData2.peopleNotified}
                        onChange={handleChange2}
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="outcomeStatus"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Outcome / Resolution Status
                      </label>
                      <input
                        type="text"
                        id="outcomeStatus"
                        name="outcomeStatus"
                        value={formData2.outcomeStatus}
                        onChange={handleChange2}
                        className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300">
                        Staff Involved
                      </label>
                      <select
                        name="staffInvolved"
                        value={formData2.staffInvolved}
                        onChange={handleChange2}
                        required
                        className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                      >
                        <option value="">Select Staff Member</option>
                        {staffMembers2.map((staff) => (
                          <option key={staff._id} value={staff._id}>
                            {staff.fullName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Attachments */}
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Attach Photo/Document
                      </label>
                      <input
                        type="file"
                        name="attachments"
                        onChange={handleFileChangeincident}
                        multiple
                        className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={handleCancel11}
                        className=" bg-gray-700 cursor-pointer hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center justify-center bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white font-bold py-2 px-4 rounded ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                            Please wait...
                          </>
                        ) : (
                          "Report Incident"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Form add staf */}
            {showModal3 && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto p-4">
                <form
                  onSubmit={handleSubmitStaff}
                  className="bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto"
                >
                  <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
                    Add Staff Member
                  </h2>
                  {/* Full Name */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData3.name}
                      onChange={handleChange3}
                      required
                      className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData3.email}
                      onChange={handleChange3}
                      required
                      className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                    />
                  </div>

                  {/* Position */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Position
                    </label>
                    <input
                      name="position"
                      type="text"
                      value={formData3.position}
                      onChange={handleChange3}
                      required
                      className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600  text-gray-300 focus:outline-none"
                    />
                  </div>

                  {/* Department */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData3.department}
                      onChange={handleChange3}
                      required
                      className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600  text-gray-300 focus:outline-none"
                    >
                      <option value="">Select Department</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Care">Care</option>
                      <option value="Administration">Administration</option>
                      <option value="Management">Management</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  {/* Care Setting / Service Type */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Care Setting / Service Type
                    </label>
                    <select
                      name="careSetting"
                      value={formData3.careSetting}
                      onChange={handleChange3}
                      required
                      className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                    >
                      <option value="">Select Care Setting</option>
                      <option value="Residential Care">Residential Care</option>
                      <option value="Nursing Homes">Nursing Homes</option>
                      <option value="Learning Disabilities">
                        Learning Disabilities
                      </option>
                      <option value="Supported Living">Supported Living</option>
                      <option value="Mental Health Support">
                        Mental Health Support
                      </option>
                      <option value="Domiciliary Care">Domiciliary Care</option>
                      <option value="Other Services">Other Services</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      value={formData3.startDate}
                      onChange={handleChange3}
                      required
                      className="shadow-sm border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-300 focus:outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={handleCancel10}
                      className=" bg-gray-700 cursor-pointer hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center justify-center bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white font-bold py-2 px-4 rounded ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Please wait...
                        </>
                      ) : (
                        "Add Member"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* training----------------------------------------------------------------------------- */}

            {showForm4 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4">
                <form
                  onSubmit={handleSubmit4}
                  className="bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto"
                >
                  <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
                    Add Training Record
                  </h2>

                  {/* Staff Member */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Staff Member
                    </label>
                    <select
                      name="staffName"
                      value={formData4.staffName}
                      onChange={handleChange4}
                      required
                      className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                    >
                      <option value="">Select Staff Member</option>
                      {staffMembers2.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Training Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Training Type
                    </label>
                    <select
                      name="trainingType"
                      value={formData4.trainingType}
                      onChange={handleChange4}
                      required
                      className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                    >
                      <option value="">Select Training Type</option>
                      {recommendedTrainings.length > 0
                        ? recommendedTrainings.map((type, i) => (
                            <option key={i} value={type}>
                              {type}
                            </option>
                          ))
                        : [
                            "First Aid",
                            "Fire Safety",
                            "Moving & Handling",
                            "Safeguarding",
                            "GDPR",
                            "Infection Control",
                            "Medication Administration",
                            "Dementia Care",
                            "Autism & Learning Disabilities",
                            "Epilepsy",
                            "Mental Health",
                            "Diabetes",
                          ].map((type, i) => (
                            <option key={i} value={type}>
                              {type}
                            </option>
                          ))}
                    </select>
                  </div>

                  {/* Suggested Trainings Section */}
                  {recommendedTrainings.length > 0 && (
                    <div className="mt-2 text-sm text-gray-300 bg-gray-700 p-3 rounded mb-4">
                      <p className="font-medium text-primary-light mb-1">
                        Recommended Trainings for this Care Setting:
                      </p>
                      <ul className="list-disc list-inside text-green-400">
                        {recommendedTrainings.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Completion Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium  text-gray-300">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="completionDate"
                      value={formData4.completionDate}
                      onChange={handleChange4}
                      required
                      className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData4.expiryDate}
                      onChange={handleChange4}
                      required
                      className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                    />
                  </div>

                  {/* Attachments */}
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Attach Photo/Document
                    </label>
                    <input
                      type="file"
                      name="attachments"
                      onChange={handleFileChangeTraining}
                      multiple
                      className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
                    />
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData4.notes}
                      onChange={handleChange4}
                      rows="4"
                      className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                    />
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={handleCancel9}
                      className=" bg-gray-700 hover:bg-gray-600 cursor-pointer text-gray-200 font-bold py-2 px-4 rounded"
                    >
                      {/* setShowForm4(false) */}
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center justify-center bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white font-bold py-2 px-4 rounded ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Please wait...
                        </>
                      ) : (
                        "Add Record"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Facility Occupancy */}
            <div className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4a48d4]"></span>
                Facility Occupancy
              </h3>

              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#136EFF]">
                    {occupancyPercentage}%
                  </p>
                  <p className="text-sm text-gray-400">Current Occupancy</p>
                </div>
                <div className="w-32 h-32">
                  <OccupancyChart occupancyPercentage={occupancyPercentage} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[#273142] rounded-lg shadow-inner">
                  <p className="text-2xl font-semibold text-white">
                    {occupiedRooms0}
                  </p>
                  <p className="text-xs text-gray-400">Occupied Rooms</p>
                </div>
                <div className="text-center p-3 bg-[#273142] rounded-lg shadow-inner">
                  <p className="text-2xl font-semibold text-white">
                    {availableRooms}
                  </p>
                  <p className="text-xs text-gray-400">Available Rooms</p>
                </div>
              </div>
            </div>

            {/* Incident Trends */}
            <div className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 relative">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4a48d4]"></span>
                Incident Trends
              </h3>

              {/* Chart Canvas */}
              <div className="h-48 bg-gray-900/30 rounded-lg p-4">
                <canvas id="incidentsChart"></canvas>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-400">
                  Total:{" "}
                  <span
                    id="total-incidents"
                    className="text-[#4a48d4] font-medium"
                  >
                    {sixmont}
                  </span>{" "}
                  incidents in last 6 months
                </span>
                <Link
                  href="/Incident-Reports"
                  className="text-white hover:text-[#4a48d4] font-medium transition-colors duration-200"
                >
                  View details →
                </Link>
              </div>
            </div>

            {/* Chart Script */}
            {(() => {
              if (typeof window !== "undefined") {
                import("chart.js/auto").then(({ default: Chart }) => {
                  const ctx = document
                    .getElementById("incidentsChart")
                    ?.getContext("2d");
                  if (!ctx) return;

                  // Gradient background
                  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                  gradient.addColorStop(0, "rgba(74, 72, 212, 0.5)");
                  gradient.addColorStop(1, "rgba(74, 72, 212, 0)");

                  // Destroy old chart if exists
                  if (window.incidentsChartInstance) {
                    window.incidentsChartInstance.destroy();
                  }

                  // Create chart
                  window.incidentsChartInstance = new Chart(ctx, {
                    type: "line",
                    data: {
                      labels: [" last 6 months"],
                      datasets: [
                        {
                          label: "Incidents",
                          data: [sixmont, 20, 12, 25, 15, 30], // <-- Change with real data
                          fill: true,
                          backgroundColor: gradient,
                          borderColor: "#4a48d4",
                          borderWidth: 3,
                          tension: 0.4,
                          pointBackgroundColor: "#fff",
                          pointBorderColor: "#4a48d4",
                          pointBorderWidth: 2,
                        },
                      ],
                    },
                    options: {
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        x: {
                          ticks: { color: "#bbb" },
                          grid: { color: "rgba(255,255,255,0.05)" },
                        },
                        y: {
                          ticks: { color: "#bbb" },
                          grid: { color: "rgba(255,255,255,0.05)" },
                        },
                      },
                    },
                    plugins: [
                      {
                        id: "shadowEffect",
                        beforeDraw: (chart) => {
                          const ctx = chart.ctx;
                          ctx.save();
                          ctx.shadowColor = "rgba(0,0,0,0.6)";
                          ctx.shadowBlur = 15;
                          ctx.shadowOffsetX = 0;
                          ctx.shadowOffsetY = 8;
                        },
                        afterDraw: (chart) => {
                          chart.ctx.restore();
                        },
                      },
                    ],
                  });
                });
              }
            })()}

            {/* Staff Training Status */}
            <div className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4a48d4]"></span>
                Staff Training Status
              </h3>

              <div className="h-48 bg-gray-900/30 rounded-lg p-4">
                <canvas id="trainingChart"></canvas>
              </div>

              <div className="mt-4 flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500"></span>
                  <span className="text-white">Up to date</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-yellow-400"></span>
                  <span className="text-white">Expiring soon</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-500"></span>
                  <span className="text-white">Expired</span>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <a
                  href="#"
                  className="text-sm text-white hover:text-[#4a48d4] font-medium"
                >
                  View all certifications
                </a>
              </div>
            </div>
          </div>

          {/* Core Modules///////////// */}
          <div>
            <h3 className="text-xl font-semibold text-gray-200 my-6">
              Core Modules
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Client Management */}
              <Link href="/Client-Management">
                <div
                  className=" bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 cursor-pointer"
                  data-module="client"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
                      <FaUser className="text-lg text-primary-light text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Resident Management
                      </h3>
                      <p className="text-sm text-gray-400">
                        Manage Resident records
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Care Planning */}
              <Link href="/Care-Planning">
                <div
                  className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 cursor-pointer"
                  data-module="care"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
                      <FaClipboardList className="text-lg text-primary-light text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Care Planning
                      </h3>
                      <p className="text-sm text-gray-400">
                        Create and manage care plans
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Incident Reports */}
              <Link href="/Incident-Reports">
                <div
                  className=" bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 cursor-pointer"
                  data-module="incident"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
                      <FaExclamationTriangle className="text-lg text-primary-light text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Incident Reports
                      </h3>
                      <p className="text-sm text-gray-400">
                        Record and track incidents
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/HR-Management">
                {/* HR Management */}
                <div
                  className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 cursor-pointer"
                  data-module="hr"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
                      <FaUsers className="text-lg text-primary-light text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        HR Management
                      </h3>
                      <p className="text-sm text-gray-400">
                        Manage staff and schedules
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Training */}
              <Link href="Training">
                <div
                  className="bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 cursor-pointer"
                  data-module="training"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
                      <FaGraduationCap className="text-lg text-primary-light text-white" />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Training
                      </h3>
                      <p className="text-sm text-gray-400">
                        Track staff training and certifications
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Compliance */}
              <Link href="Compliance">
                <div
                  className=" bg-[#1c2434] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-[#4a48d4] transition-colors duration-300 cursor-pointer"
                  data-module="compliance"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
                      <FaShieldAlt className="text-lg text-primary-light text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Compliance
                      </h3>
                      <p className="text-sm text-gray-400">
                        Monitor regulatory compliance
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;

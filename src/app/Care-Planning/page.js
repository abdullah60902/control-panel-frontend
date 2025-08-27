"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import SignaturePad from "react-signature-canvas";
import { SiSimpleanalytics } from "react-icons/si";
import { GrDocumentPerformance } from "react-icons/gr";
import Image from "next/image";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoDocumentAttach } from "react-icons/io5";


import { useRef } from "react";
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaUserCog,
  FaSearch,
  FaPlus,
  FaEye,
  // FaEdit,
  // FaTrash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Optional for table format
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { MdMedicationLiquid } from "react-icons/md";
import { set } from "nprogress";

const CarePlans = [
  {
    Client: "Noman developer",
    PlanType: "Nursing",
    Created: "02/21/2222",
    ReviewDate: "02/21/2222",
    status: "Current",
  },
];

const Page = () => {
  const {hasClients} = useAuth()
  // Define your navigation links here with proper routes
const navItems = [
  { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
  { icon: <FaUser />, label: "Resident Management", href: "/Client-Management" },
  { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning",active: true },
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSetting, setSelectedSetting] = useState(
    " Filter All Settings"
  );

  const [filteredStaff, setFilteredStaff] = useState([]);
  const [editingCareId, setEditingCareId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showFormCare, setShowFormCare] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members
  const { user, logout ,  } = useAuth();

  // ViewData.apply...............................................................

  const handleChangeCare = (e) => {
    const { name, value } = e.target;
    setFormDataCare((prev) => ({ ...prev, [name]: value }));
  };

  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const [selected, setSelected] = useState("All Plans");
  const filters = ["All Plans", "Nursing", "Nutrition", "Mobility"];
  const handleEditCare = (plan) => {
    setFormDataCare({
      client: plan.client?._id || plan.client,
      planType: plan.planType,
      creationDate: plan.creationDate?.slice(0, 10),
      reviewDate: plan.reviewDate?.slice(0, 10),
      carePlanDetails: plan.carePlanDetails,
      bristolStoolChart: plan.bristolStoolChart || "",
      mustScore: plan.mustScore || "",
      heartRate: plan.heartRate || "",
      mood: plan.mood || "",
      dailyLog: plan.dailyLog || "",
      careSetting: plan.careSetting || "", // ✅ NEW FIELD
    });

    // ✅ Cloudinary URLs for preview
    setAttachments(plan.attachments || []);

    setEditingCareId(plan._id);
    setShowFormCare(true);
  };
  const handleDownloadPdf = async (item) => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;
    const minu =
      staffMembers.find((staff) => staff._id === item.client?._id)?.fullName ||
      "Unknown";

    // ✅ Map mood emoji to text
    const moodMap = {
      "😊": "Happy",
      "😐": "Neutral",
      "😔": "Sad",
      "😡": "Angry",
      "😴": "Tired",
    };

    const moodText = moodMap[item.mood] || "";

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Care Plan Details", 14, 15);

    // Main table content
    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: [
        ["Patient", minu],
        ["Plan Type", item.planType],
        ["Creation Date", item.creationDate?.slice(0, 10)],
        ["Review Date", item.reviewDate?.slice(0, 10)],
        ["Care Plan Details", item.carePlanDetails],
        ["Bristol Stool Chart", item.bristolStoolChart],
        ["MUST Score", item.mustScore],
        ["Heart Rate", item.heartRate],
        ["Mood", moodText],
        ["Daily Log", item.dailyLog],
        ["Status", item.status],
        ["Care Setting", item.careSetting || ""], // ✅ NEW FIELD
      ],
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // ✅ Decline Reason
    if (item.status === "Declined" && item.declineReason) {
      doc.setFontSize(12);
      doc.setTextColor(200, 0, 0);
      doc.text("Decline Reason:", 14, currentY);
      doc.setTextColor(50, 50, 50);
      doc.text(item.declineReason, 14, currentY + 6);
      currentY += 14;
    }

    // ✅ Signature (Accepted)
    if (item.status === "Accepted" && item.signature) {
      doc.setFontSize(12);
      doc.text("Signature:", 14, currentY);

      try {
        const res = await fetch(item.signature);
        const blob = await res.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const base64data = reader.result;
          doc.addImage(base64data, "PNG", 14, currentY + 5, 60, 20);
          currentY += 30;

          addAttachments();
        };
      } catch (error) {
        console.error("Signature error:", error);
        doc.text("❌ Signature image could not be loaded", 14, currentY + 5);
        currentY += 15;
        addAttachments();
      }
    } else {
      addAttachments();
    } // ✅ Attachments (Image/PDF Preview)
    async function addAttachments() {
      if (item.attachments?.length > 0) {
        doc.setFontSize(12);
        doc.text("Attachments:", 14, currentY);
        currentY += 6;

        for (let i = 0; i < item.attachments.length; i++) {
          const url = item.attachments[i];
          const ext = url.split(".").pop().toLowerCase();

          // 🖼️ Image (no numbering)
          if (["jpg", "jpeg", "png"].includes(ext)) {
            try {
              const res = await fetch(url);
              const blob = await res.blob();
              const reader = new FileReader();
              reader.readAsDataURL(blob);

              await new Promise((resolve) => {
                reader.onloadend = function () {
                  const base64data = reader.result;

                  // Add page if height overflows
                  if (currentY + 60 > 280) {
                    doc.addPage();
                    currentY = 20;
                  }

                  doc.addImage(base64data, "JPEG", 14, currentY, 50, 50);
                  currentY += 60;
                  resolve();
                };
              });
            } catch (e) {
              doc.setTextColor(255, 0, 0);
              doc.text(`Image failed to load`, 14, currentY);
              doc.setTextColor(0, 0, 0);
              currentY += 10;
            }
          }

          // 📄 PDF (icon only, no label)
          else if (ext === "pdf") {
            try {
              const iconUrl =
                "https://cdn-icons-png.flaticon.com/512/337/337946.png";
              const res = await fetch(iconUrl);
              const blob = await res.blob();
              const reader = new FileReader();
              reader.readAsDataURL(blob);

              await new Promise((resolve) => {
                reader.onloadend = function () {
                  const iconBase64 = reader.result;

                  if (currentY + 22 > 280) {
                    doc.addPage();
                    currentY = 20;
                  }

                  doc.addImage(iconBase64, "PNG", 14, currentY, 16, 16);
                  doc.link(14, currentY, 16, 16, { url });
                  currentY += 22;
                  resolve();
                };
              });
            } catch (e) {
              doc.setTextColor(255, 0, 0);
              doc.text("PDF icon failed to load", 14, currentY);
              doc.setTextColor(0, 0, 0);
              currentY += 10;
            }
          }
        }
      }

      doc.save(`${minu}_careplan.pdf`);
    }
  };

  const [loading, setLoading] = useState(false);  

  const handleSubmitCare = (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    for (let key in formDataCare) {
      formData.append(key, formDataCare[key]);
    }

    // Check if editing: add Cloudinary URLs (old ones) and new files
    if (editingCareId) {
      // Old Cloudinary URLs (string type)
      attachments.forEach((att) => {
        if (typeof att === "string") {
          formData.append("oldAttachments", att); // for reference
        } else {
          formData.append("attachments", att); // new files
        }
      });
    } else {
      // New upload
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const request = editingCareId
      ? axios.put(
          `http://localhost:3000/carePlanning/${editingCareId}`,
          formData,
          config
        )
      : axios.post(`http://localhost:3000/carePlanning`, formData, config);

    request
      .then((res) => {
        toast.success("Care plan saved successfully");
        setShowFormCare(false);
        setEditingCareId(null);
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
        });
        return axios.get("http://localhost:3000/carePlanning", config);
      })
      .then((res) => {
        setCarePlans(res.data);
      })
      .catch((err) => {
        console.error("Error:", err.response?.data);
        setLoading(false);
        toast.error(err.response?.data?.error || "Something went wrong");
      });
  };

  const [previewImage, setPreviewImage] = useState(null);

  const handleDeleteCare = (id) => {
    if (!window.confirm("Are you sure you want to delete this care plan?"))
      return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:3000/carePlanning/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage("Care Plan deleted");
        const updated = carePlans.filter((plan) => plan._id !== id);
        setCarePlans(updated);
        setFilteredStaff(updated);
        toast.success("Deleted successfuly");
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.error || "Failed to delete care plan");
        toast.error(err.response?.data?.error || "Failed to delete care plan");
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Only run when user is fully loaded
    if (!user || (user.role === "Client" && !Array.isArray(user.clients)))
      return;

    axios
      .get("http://localhost:3000/carePlanning", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let plans = res.data;
        console.log("All Plans from API:", res.data);

        if (user.role === "Client") {
          const clientIds = user.clients.map(
            (c) => c._id?.toString() || c.toString()
          );
          plans = plans.filter((plan) =>
            clientIds.includes(
              plan.client?._id?.toString() || plan.client?.toString()
            )
          );
        }

        setCarePlans(plans);
        console.log("Filtered Care Plans:", plans);
        setMessage("Care Plans fetched");
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        setError(err.response?.data?.error || "Failed to fetch care plans");
      });
  }, [user]); // ✅ Waits until user is available

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
        console.log("Fetched staff members:", response.data.clients);

        setMessage("Staff fetched successfully");
      })
      .catch((error) => {
        setError(error.response?.data?.msg || "Failed to fetch staff");
      });
  }, []);
  useEffect(() => {
    const filtered = carePlans.filter((plan) => {
      const client =
        staffMembers.find((staff) => staff._id === plan.client)?.fullName || "";

      const matchesType =
        selected === "All Plans" || plan.planType === selected;
      const matchesSetting =
        selectedSetting === " Filter All Settings" ||
        plan.careSetting === selectedSetting;
      const matchesSearch = client
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesType && matchesSetting && matchesSearch;
    });

    setFilteredStaff(filtered);
  }, [selected, selectedSetting, searchQuery, carePlans, staffMembers]);

  {
    /* view data /////////////////////////////////////////////// */
  }

  const [showModal, setShowModal] = useState(false);
  const [viewName, setViewName] = useState(null);
  const [viewplanType, setViewPlanType] = useState(null);
  const [viewCreationDate, setViewCreationDate] = useState(null);
  const [viewReviewDate, setViewReviewDate] = useState(null);
  const [viewCarePlanDetails, setViewCarePlanDetails] = useState(null);
  const [viewSignature, setViewSignature] = useState(null);
  const [viewStatus, setViewStatus] = useState(null);
  const [viewDeclineReason, setViewDeclineReason] = useState(null);
  const [viewAttachments, setViewAttachments] = useState([]);
  const [viewBristolStoolChart, setViewBristolStoolChart] = useState("");
  const [viewMustScore, setViewMustScore] = useState("");
  const [viewHeartRate, setViewHeartRate] = useState("");
  const [viewMood, setViewMood] = useState("");
  const [viewDailyLog, setViewDailyLog] = useState("");
  const [viewCareSetting, setViewCareSetting] = useState(""); // ✅ NEW FIELD

  const handleView = (item) => {
    const minu =
      staffMembers.find((staff) => staff._id === item.client?._id)?.fullName ||
      "U";

    setViewName(minu);
    setViewPlanType(item.planType);
    setViewCreationDate(item.creationDate?.slice(0, 10));
    setViewReviewDate(item.reviewDate?.slice(0, 10));
    setViewCarePlanDetails(item.carePlanDetails);
    setViewSignature(item.signature || null);
    setViewDeclineReason(item.declineReason || null);
    setViewStatus(item.status || null);
    setViewAttachments(item.attachments || []); // ✅ set attachments
    setViewBristolStoolChart(item.bristolStoolChart || "");
    setViewMustScore(item.mustScore || "");
    setViewHeartRate(item.heartRate || "");
    setViewMood(item.mood || "");
    setViewDailyLog(item.dailyLog || "");
    setViewCareSetting(item.careSetting || ""); // ✅ NEW FIELD
    setShowModal(true);
  };

  const data = {
    Patient: viewName,
    "Plan Type": viewplanType,
    "Creation Date": viewCreationDate,
    "Review Date": viewReviewDate,
    "Care Plan Details": viewCarePlanDetails,
    "Bristol Stool Chart": viewBristolStoolChart,
    "MUST Score": viewMustScore,
    "Heart Rate": viewHeartRate,
    Mood: viewMood,
    "Daily Log": viewDailyLog,
    careSetting: viewCareSetting || "", // ✅ NEW FIELD
  };

  // signature.......................................................................................
  const [showSignaturePad, setShowSignaturePad] = useState(null);
  const [declineInputVisible, setDeclineInputVisible] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const sigCanvas = useRef();

  const handleAccept = async (id) => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      toast.error("Please provide a signature before accepting.");
      return;
    }

    const dataURL = sigCanvas.current.getCanvas().toDataURL("image/png");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/carePlanning/${id}`,
        {
          status: "Accepted",
          signature: dataURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Accepted with signature");
      setShowSignaturePad(null);
      refreshPlans(); // ✅ Now this will work
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept");
    }
  };
  const handleDecline = async (id, reason) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/carePlanning/${id}`,
        {
          status: "Declined",
          declineReason: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Declined with reason");
      setDeclineInputVisible(null);
      refreshPlans(); // ✅ Here too
    } catch (err) {
      console.error(err);
      toast.error("Failed to decline");
    }
  };

  const refreshPlans = () => {
    const token = localStorage.getItem("token");

    if (!user || (user.role === "Client" && !Array.isArray(user.clients)))
      return;

    axios
      .get("http://localhost:3000/carePlanning", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let plans = res.data;

        if (user.role === "Client") {
          const clientIds = user.clients.map(
            (c) => c._id?.toString() || c.toString()
          );
          plans = plans.filter((plan) =>
            clientIds.includes(
              plan.client?._id?.toString() || plan.client?.toString()
            )
          );
        }

        setCarePlans(plans);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
      });
  };

  const hansleCloseFormCare = () => {
    setShowFormCare(false);
    setEditingCareId(null);
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
    });
  };

  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/Login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="bg-[#111827] min-h-screen flex flex-col">
      <Navbar />
      {/* veiwdata................................................................................. */}

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-auto">
          <div className="relative w-full max-w-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] border border-gray-700 bg-gradient-to-br from-[#1b1e25] to-[#111319] text-white px-8 py-10 max-h-[90vh] overflow-y-auto">
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 cursor-pointer right-4 w-11 h-11 bg-[#2b2e3a] hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-all duration-300"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 💡 Heading */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 flex items-center justify-center gap-2 sm:gap-3">
              Care Plan Details
            </h2>

            {/* 💠 Info Fields */}
            <div className="space-y-5 mb-6">
              {Object.entries(data).map(([field, value]) => (
                <div
                  key={field}
                  className="flex justify-between items-start bg-[#1e212a] p-4 rounded-xl border border-gray-700"
                >
                  <span className="font-semibold text-gray-300">{field}</span>
                  <span className="text-right text-gray-400 max-w-[60%]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* ✅ Signature / Decline */}
            {(viewStatus === "Accepted" && viewSignature) ||
            (viewStatus === "Declined" && viewDeclineReason) ? (
              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                {/* 🖋 Signature */}
                {viewStatus === "Accepted" && viewSignature && (
                  <div className="bg-[#1e212a] border border-gray-700 p-4 rounded-2xl shadow-sm text-center">
                    <p className="text-green-400 font-semibold mb-3 flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18a9 9 0 1112 0"
                        />
                      </svg>
                      Signature
                    </p>
                    <Image
                      src={viewSignature}
                      alt="Signature"
                      className="inline-block w-full max-w-xs border border-gray-600 rounded-xl shadow-md"
                    />
                  </div>
                )}

                {/* ❌ Decline Reason */}
                {viewStatus === "Declined" && viewDeclineReason && (
                  <div className="bg-[#1e212a] border border-gray-700 p-4 rounded-2xl shadow-sm">
                    <p className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Decline Reason
                    </p>
                    <p className="text-gray-400 text-sm">{viewDeclineReason}</p>
                  </div>
                )}
              </div>
            ) : null}

            {/* 📎 Attachments */}
            {viewAttachments?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586M16 3a4 4 0 015.656 5.656L9.414 21H4v-5.414L16 3z" />
                  </svg>
                  Attachments
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {viewAttachments.map((file, index) => {
                    const isPDF = file.toLowerCase().endsWith(".pdf");
                    return (
                      <div
                        key={index}
                        className="relative bg-[#1e212a] p-3 rounded-2xl border border-gray-700 shadow-md hover:shadow-xl transition-all overflow-hidden"
                      >
                        {isPDF ? (
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2"
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                              alt="PDF Icon"
                              className="w-12 h-12"
                            />
                            <p className="text-sm text-gray-300 font-medium text-center">
                              PDF Attachment {index + 1}
                            </p>
                          </a>
                        ) : (
                          <div className="relative group cursor-zoom-in">
                            <img
                              src={file}
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-[200px] object-cover rounded-lg border border-gray-600"
                              onClick={() => setPreviewImage(file)}
                            />
                            <div
                              onClick={() => setPreviewImage(file)}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                            >
                              <BsArrowsFullscreen />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-[#111319] border border-gray-600 p-4 rounded-2xl max-w-4xl w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-10 h-10 bg-gray-800 text-white hover:bg-red-600 rounded-full flex items-center justify-center shadow"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={previewImage}
              alt="Full View"
              className="w-full h-auto object-contain rounded-xl max-h-[80vh] mx-auto"
            />
          </div>
        </div>
      )}

      {/* Mobile Navbar Toggle - only for smaller than lg */}
      <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-gray-800 shadow relative">
        <h1 className="text-lg text-white font-semibold absolute left-4">
          Care Planning
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`w-64 h-full z-50 bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      fixed top-0 left-0
      lg:translate-x-0 lg:relative lg:block`}
        >
          <nav className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center lg:block">
              <p className="text-sm text-gray-400">Navigation</p>
            </div>

            <div className="flex-1 px-2 py-4 overflow-y-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || "#"}
                  className={`side-menu-item flex items-center px-4 py-3 text-gray-300 rounded-md transition-colors ${
                    item.active
                      ? "bg-primary-light bg-gray-700 text-primary-light"
                      : "hover:bg-gray-700 hover:text-primary-light"
                  }`}
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile after click
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

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
                  <p className="text-xs text-gray-400"> {user.email}</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-h-screen overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-200 mb-6 hidden md:block">
            Care Planning
          </h2>

          <div className="bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-8 h-full overflow-y-auto pr-2 my-scroll">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-200">
                  Care Plans
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Create and manage care plans
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:min-w-[200px] rounded-md border border-gray-600 pl-10 pr-4 py-2 focus:border-primary-light focus:ring-primary-light bg-gray-700 text-white text-sm"
                    placeholder="Search Care..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-500" />
                  </div>
                </div>

                {/* Create New Plan */}
                { !hasClients && <button
                  onClick={() => setShowFormCare(true)}
                  className="bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <FaPlus className="mr-2" /> Create New Plan
                </button>}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex text-white flex-wrap gap-2 ">
              {filters.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(label)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer backdrop-blur-sm ${
                    selected === label
                      ? "bg-primary-light bg-gray-700 text-primary-light shadow-lg"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-primary hover:text-primary-light"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Filter by Care Setting */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedSetting}
                onChange={(e) => setSelectedSetting(e.target.value)}
                className="w-full sm:min-w-[180px] font-medium outline-none  mb-2 px-3 py-2  bg-gray-700 text-white text-sm"
              >
                <option value=" Filter All Settings">
                  {" "}
                  Filter All Settings
                </option>
                <option value="Residential Care">Residential Care</option>
                <option value="Nursing Homes">Nursing Homes</option>
                <option value="Learning Disabilities">
                  Learning Disabilities{" "}
                </option>
                <option value="Supported Living">Supported Living </option>
                <option value="Mental Health Support">
                  Mental Health Support
                </option>
                <option value="Domiciliary Care">
                  Domiciliary Care Organisations
                </option>
                <option value="Other Services">Other Services</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              {/* Table */}
              <table className="min-w-[800px] md:min-w-full divide-y divide-gray-700 text-xs sm:text-sm">
                <thead className="bg-gray-700">
                  <tr>
                    {["Patient","Plan Type","Created","Review Date","Status","Actions",
                    ].map((col, i) => (
                      <th
                        key={i}
                        className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredStaff.map((item, i) => (
                    <tr key={i}>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-blue-500 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold">
                            {(
                              staffMembers.find(
                                (staff) => staff._id === item.client?._id
                              )?.fullName || "U"
                            )
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {staffMembers.find(
                                (staff) => staff._id === item.client?._id
                              )?.fullName || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-sm text-white">
                        {item.planType}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-[11px] text-gray-400">
                        {item.creationDate.slice(0, 10)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-sm text-gray-400">
                        {item.reviewDate.slice(0, 10)}
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {item.status === "Accepted" ? (
                          <span className="inline-flex text-xs font-semibold leading-5 px-2 rounded-full bg-green-100 text-green-800">
                            Accepted
                          </span>
                        ) : item.status === "Declined" ? (
                          <span className="inline-flex text-xs font-semibold leading-5 px-2 rounded-full bg-red-100 text-red-800">
                            Declined
                          </span>
                        ) : declineInputVisible === item._id ||
                          showSignaturePad === item._id ? null : (
                          <div className="flex flex-col gap-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white cursor-pointer w-16 py-1 rounded text-xs"
                              onClick={() => setShowSignaturePad(item._id)}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-400 hover:bg-red-600 text-white cursor-pointer w-16 py-1 rounded text-xs"
                              onClick={() => setDeclineInputVisible(item._id)}
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {/* SignaturePad Modal */}
                        {showSignaturePad === item._id && (
                          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                            <div className="bg-gray-800 p-4 rounded shadow-lg">
                              <SignaturePad
                                ref={sigCanvas}
                                canvasProps={{ className: "border w-72 h-40" }}
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => handleAccept(item._id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => setShowSignaturePad(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Decline Reason Input */}
                        {declineInputVisible === item._id && (
                          <div className="mt-2">
                            <textarea
                              className="w-full p-1 text-xs border rounded bg-gray-700 text-white"
                              rows="2"
                              placeholder="Reason for decline..."
                              value={declineReason}
                              onChange={(e) => setDeclineReason(e.target.value)}
                            />
                            <div className="flex gap-2 mt-1">
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                onClick={() =>
                                  handleDecline(item._id, declineReason)
                                }
                              >
                                Submit
                              </button>
                              <button
                                className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                                onClick={() => setDeclineInputVisible(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                        <div className="flex space-x-1 sm:space-x-2">
                          <FaEye
                            className="hover:text-blue-500 transition cursor-pointer"
                            onClick={() => handleView(item)}
                          />
                          {!hasClients && <FaEdit
                            className="hover:text-yellow-500 transition cursor-pointer"
                            onClick={() => handleEditCare(item)}
                          />}
                         {!hasClients && <FaTrash
                            className="hover:text-red-500 transition cursor-pointer"
                            onClick={() => handleDeleteCare(item._id)}
                          />}
                          <button
                            className="hover:text-green-600 transition cursor-pointer"
                            onClick={() => handleDownloadPdf(item)}
                          >
                            <FaDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStaff.length === 0 && (
                <p className="text-center px-4 sm:px-6 py-24 sm:py-36 text-sm text-gray-400">
                  No Care Planning found.
                </p>
              )}
            </div>
          </div>

          {/* Modal care plan form */}
          {showFormCare && (
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
              <div className="bg-gray-800 rounded-lg pt-4 shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
                  {/* Care Planning */}
                  {editingCareId ? "Edit Care Plan" : "Add New Care Plan"}
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
                      <option value="Residential Care">Residential Care</option>
                      <option value="Nursing Homes">Nursing Homes</option>
                      <option value="Learning Disabilities">
                        Learning Disabilities
                      </option>
                      <option value="Supported Living">Supported Living</option>
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
                      ) : editingCareId ? (
                        "Update Care Plan"
                      ) : (
                        "Create Care Plan"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;

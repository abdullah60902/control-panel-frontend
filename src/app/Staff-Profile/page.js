"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import { SiSimpleanalytics } from "react-icons/si";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoDocumentAttach, IoDocuments } from "react-icons/io5";
import { LuLayoutTemplate } from "react-icons/lu";
import { TbClockRecord } from "react-icons/tb";
import { AiOutlineDownload } from "react-icons/ai";
import { FiAlertCircle } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

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
  FaBars,
  FaTimes,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { MdOutlineSchool, MdMedicationLiquid } from "react-icons/md";
import { BsClipboardCheck } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import RotaCalendar from "@/app/(component)/rotacalendar/RotaCalendar";
import StafProfileTraning from "@/app/(component)/stafprofiletraning/StafProfileTraning";
import StafProfilePersonalEmp from "@/app/(component)/stafprofilepersonalemp/StafProfilePersonalEmp";
import StafProfilePayTimeShet from "@/app/(component)/stafprofilepaytimeshet/StafProfilePayTimeShet";
import StafProfileDocuments from "@/app/(component)/stafprofiledocuments/StafProfileDocuments";
import Stafprofilesperformance from "@/app/(component)/stafprofilesperformance/StafProfilesPerformance ";

import { useSearchParams } from "next/navigation";

const Page = () => {const { hasClients, user } = useAuth();
const router = useRouter();
const params = useSearchParams();
const id = params.get("id");

const [staff, setStaff] = useState(null);
const [trainings, setTrainings] = useState([]);
const [performanceId, setPerformanceId] = useState([]);
const [isEditing, setIsEditing] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);

// Fetch data
useEffect(() => {
  if (!id) return;

  const token = localStorage.getItem("token");

  fetch(`https://control-panel-backend-k6fr.vercel.app/hr/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setStaff(data))
    .catch(err => console.log(err));

  fetch(`https://control-panel-backend-k6fr.vercel.app/training/staff/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setTrainings(data))
    .catch(err => console.log(err));

  fetch(`https://control-panel-backend-k6fr.vercel.app/performance/staff/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setPerformanceId(data))
    .catch(err => console.log(err));
}, [id]);

// Redirect if no user
useEffect(() => {
  if (!user) router.push("/Login");
}, [user, router]);


  // Sidebar
  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    {
      icon: <FaUser />,
      label: "Resident Management",
      href: "/Client-Management",
    },
    {
      icon: <FaClipboardList />,
      label: "Care Planning",
      href: "/Care-Planning",
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Incident Reports",
      href: "/Incident-Reports",
    },
    { icon: <LuLayoutTemplate />, label: "Template", href: "/Template" },
    { icon: <FaSearch />, label: "Social Activity", href: "/Social-Activity" },
    {
      icon: <MdMedicationLiquid />,
      label: "Medication Management",
      href: "/Medication-Management",
    },
    ...(hasClients
      ? []
      : [
          {
            icon: <TbClockRecord />,
            label: "Medication-Record",
            href: "/Medication-Record",
          },
          {
            icon: <FaUsers />,
            label: "HR Management",
            href: "/HR-Management",
            active: true,
          },
          {
            icon: <IoDocumentAttach />,
            label: "Documents Management",
            href: "/Documents-Management",
          },
          {
            icon: <GrDocumentPerformance />,
            label: "Performance-Management",
            href: "/Performance-Management",
          },
          { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
          { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
          {
            icon: <SiSimpleanalytics />,
            label: "Analytics",
            href: "/Analytics",
          },
          {
            icon: <FaUserCog />,
            label: "User Management",
            href: "/User-Management",
          },
        ]),
  ];

  //  Training & Compliance dummy data  //////////////////////////////////////////

  const data = [
    {
      module: "Safeguarding Adults",
      category: "Mandatory",
      status: "Expiring Soon (Reminder Sent)",
      statusColor: "bg-yellow-500 text-black",
      expiry: "2026-01-15",
      action: "download",
    },
    {
      module: "Epilepsy Management",
      category: "Care Specific",
      status: "Missed Deadline",
      statusColor: "bg-red-500 text-white",
      expiry: "2025-03-01",
      action: "alert",
    },
    {
      module: "Mental Health Support",
      category: "Care Specific",
      status: "Compliant",
      statusColor: "bg-green-500 text-white",
      expiry: "N/A",
      action: "download",
    },
  ];

  const allowedNavItems =
    user?.role === "Admin" || user?.role === "Staff" || user?.role === "Client"
      ? navItems
      : user?.role === "External" && Array.isArray(user.allowedPages)
      ? navItems.filter((item) =>
          user.allowedPages.some(
            (page) =>
              page.toLowerCase().replace(/\s+/g, "") ===
              item.label.toLowerCase().replace(/\s+/g, "")
          )
        )
      : [];

  // Tabs
  const [activeTab, setActiveTab] = useState("personal");
  const tabs = [
    { id: "personal", label: "Personal & Employment", icon: <FaUser /> },
    { id: "rota", label: "Scheduling & Rota", icon: <BsClipboardCheck /> },
    {
      id: "training",
      label: "Training",
      icon: <MdOutlineSchool />,
    },
    { id: "pay", label: "Pay & Timesheets", icon: <GiMoneyStack /> },
    { id: "performance", label: "Performance & Leave", icon: <IoDocuments /> },
    { id: "documents", label: "Documents", icon: <IoDocuments /> },
  ];

  // Image upload
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  const handleEditClick = () => document.getElementById("fileInput").click();

  return (
    <div className="bg-[#111827] min-h-screen">
      <Navbar />

      {/* Mobile Navbar Toggle */}
      <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-gray-800 shadow relative">
        <h1 className="text-lg text-white font-semibold absolute left-4">
          HR Management
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-xl"
        >
          <FaBars />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:relative lg:block`}
        >
          <nav className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <p className="text-sm text-gray-400">Navigation</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white text-xl lg:hidden"
              >
                <FaTimes />
              </button>
            </div>
            {allowedNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`side-menu-item flex items-center px-4 py-3 text-gray-300 rounded-md transition-colors ${
                  item.active
                    ? "bg-gray-700 text-primary-light"
                    : "hover:bg-gray-700 hover:text-primary-light"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="p-4 border-t border-gray-700 mt-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
                  {user.fullName
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

        {/* Main Content */}
        <main className="flex-1 p-1 md:p-6 max-h-screen overflow-hidden">
          <div className="p-1 md:p-6 text-white mb-8 h-full overflow-y-auto my-scroll">
            <h2 className="text-xl font-semibold text-gray-200 mb-6 hidden md:block">
              HR Management / Staff Profile
            </h2>
            {/* Profile Header */}
           {/* Profile Header */}
<div className="bg-[#1D2939] text-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md border border-[#4A49B0]/30 
flex flex-col lg:flex-row lg:items-center lg:justify-between w-full max-w-7xl mx-auto 
transition-all duration-300 gap-6"
>
  {/* Left Side */}
  <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-5 text-center sm:text-left w-full lg:w-auto">

    {/* Profile Image */}
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-0">
      <div className="w-full h-full rounded-full bg-[#2A2A40] overflow-hidden border-2 border-[#4A49B0] flex items-center justify-center">

        {selectedImage ? (
          <img src={selectedImage} className="w-full h-full object-cover" />
        ) : staff?.profileImage ? (
          <img src={staff.profileImage} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] sm:text-xs text-gray-400">No Photo</span>
        )}

      </div>

      {/* Edit Button */}
      <button
        onClick={handleEditClick}
        className="absolute bottom-0 right-0 bg-[#4A49B0] p-1.5 rounded-full hover:bg-[#5A58C9] transition"
      >
        <FaEdit className="text-white text-base sm:text-lg" />
      </button>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          setSelectedImage(URL.createObjectURL(file));

          const formData = new FormData();
          formData.append("profileImage", file);

          const res = await fetch(`https://control-panel-backend-k6fr.vercel.app/hr/${id}/photo`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
          });
// bcnbcnc
          const data = await res.json();
          setStaff(data);
        }}
        className="hidden"
      />
    </div>

    {/* Dynamic Name + Position + Status */}
    <div className="flex flex-col items-center sm:items-start">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
        {staff?.fullName}
      </h2>

      <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-1">
        {staff?.position} - {staff?.department}
      </p>

      <div className="mt-2">
        <span className="bg-[#53AF50] text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1 rounded whitespace-nowrap">
          Active Employee (Start Date: {staff?.startDate ? staff.startDate.slice(0, 10) : "N/A"})
        </span>
      </div>
    </div>
  </div>

  {/* Right Buttons */}
  <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-3 w-full lg:w-auto">
    {/* <button
  className="bg-[#4A49B0] hover:bg-[#5A58C9] text-white px-4 py-2 rounded-md flex items-center space-x-2"
  onClick={() => {
    if (isEditing) saveProfile(); 
    else setIsEditing(true);
  }}
>
  <FaEdit />
  <span>{isEditing ? "Save" : "Edit Profile"}</span>
</button> */}


 <Link href="/HR-Management">
    <button
      className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium 
      transition-all duration-300 active:scale-95 shadow-md"
    >
      <FaArrowLeft />
      <span>Exit</span>
    </button>
  </Link>


   <button
  className="bg-[#2A2A40] hover:bg-[#3A3A55] cursor-pointer text-white px-2 py-1 rounded-md flex items-center space-x-2 border border-[#4A49B0]/40"
  onClick={async () => {
    if (!confirm("Are you sure you want to terminate this employee?")) return;

    const res = await fetch(`https://control-panel-backend-k6fr.vercel.app/hr/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    alert(data.message);

    router.push("/HR-Management"); // redirect back
  }}
>
  <FaTrashAlt className="text-[#4A49B0]" />
  <span>Terminate</span>
</button>

  </div>
</div>


            {/* Tabs */}
            <div
              className="flex flex-wrap border-b border-gray-700 mt-3 sm:mt-4 mb-4 sm:mb-6 
text-xs sm:text-sm md:text-base lg:text-lg"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center cursor-pointer gap-1 sm:gap-2 
      px-1 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-t-sm 
      transition-all duration-200 font-medium sm:font-semibold 
      ${
        activeTab === tab.id
          ? "bg-[#5A58C9] text-white border-b-2 border-[#5A58C9]"
          : "text-gray-400 hover:bg-[#2a2a40] hover:text-[#d3d3d6]"
      }`}
                >
                  <span className="text-sm sm:text-base md:text-lg">
                    {tab.icon}
                  </span>
                  <span className="text-[11px] sm:text-sm md:text-base lg:text-[17px]">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}

            {/* Personal & Employment//////////////////////////// */}

            {activeTab === "personal" && <StafProfilePersonalEmp
  staff={id}
  isEditing={isEditing}
  onStaffChange={(updatedStaff) => setStaff(updatedStaff)}
/>

}

            {/* Scheduling & Rota////////////////////////////// */}

            {activeTab === "rota" && (
             
<RotaCalendar staffId={id} />
                
            )}
            {/* Training & Compliance Tracker////////////////////////////////////////////////////////// */}

            {activeTab === "training" && <StafProfileTraning   staff2={staff}
 trainings={trainings} />}

            {activeTab === "pay" && (
              <div>
               <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
  Pay Profile & Timesheet Integration
</h2>
             <StafProfilePayTimeShet id={id} />
             </div>
            )}
            {activeTab === "performance" && (
              <div>
                
                
              <Stafprofilesperformance performanceId={performanceId} id={id} />
              </div>
            )}
{/* documents//////////////// */}
            {activeTab === "documents" && (
              <StafProfileDocuments staffId={id}/>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;

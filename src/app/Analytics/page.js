"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import { GrDocumentPerformance } from "react-icons/gr";
import { SiSimpleanalytics } from "react-icons/si";
import { IoDocumentAttach } from "react-icons/io5";

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
  FaTrash,
} from "react-icons/fa";
import { MdMedicationLiquid } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
export default function Page() {
  const { hasClients } = useAuth();
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
      icon: <MdMedicationLiquid />,
      label: "Medication Management",
      href: "/Medication-Management",
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Incident Reports",
      href: "/Incident-Reports",
    },
    !hasClients && {
      icon: <FaSearch />,
      label: "Social Activity",
      href: "/Social-Activity",
    },
    !hasClients && {
      icon: <FaUsers />,
      label: "HR Management",
      href: "/HR-Management",
    },
    !hasClients && {
      icon: <IoDocumentAttach />,
      label: "Documents Management",
      href: "/Documents-Management",
    },
    !hasClients && {
      icon: <GrDocumentPerformance />,
      label: "Performance-Manag..",
      href: "/Performance-Management",
    },
    !hasClients && {
      icon: <FaGraduationCap />,
      label: "Training",
      href: "/Training",
    },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    !hasClients && {
      icon: <SiSimpleanalytics />,
      label: "Reporting Analytics",
      href: "/Analytics",
      active: true,
    },
    !hasClients && {
      icon: <FaUserCog />,
      label: "User Management",
      href: "/User-Management",
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [activeTab, setActiveTab] = useState("analytics");

  const [complianceAuditLogs, setComplianceAuditLogs] = useState([]);
  const [carePlanAuditLogs, setCarePlanAuditLogs] = useState([]);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/Login");
  }, [user, router]);

  // Fetch analytics data
  useEffect(() => {
    if (activeTab === "analytics") {
      axios
        .get("https://control-panel-backend-k6fr.vercel.app/analytics/care-settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setAnalytics(res.data))
        .catch((err) => console.error("Error loading analytics:", err));
    }
  }, [activeTab]);

  // Fetch compliance logs
  useEffect(() => {
    if (activeTab === "compliance") {
      axios
        .get("https://control-panel-backend-k6fr.vercel.app/compliance/audit-logs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setComplianceAuditLogs(res.data))
        .catch((err) =>
          console.error("Error loading compliance audit logs:", err)
        );
    }
  }, [activeTab]);

  // Fetch care plan logs
  useEffect(() => {
    if (activeTab === "careplan") {
      axios
        .get("https://control-panel-backend-k6fr.vercel.app/carePlanning/audit-logs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setCarePlanAuditLogs(res.data))
        .catch((err) =>
          console.error("Error loading care plan audit logs:", err)
        );
    }
  }, [activeTab]);

  // Delete compliance log
  const handleDeleteComplianceAudit = async (id) => {
    if (window.confirm("Delete this compliance audit log?")) {
      try {
        await axios.delete(
          `https://control-panel-backend-k6fr.vercel.app/compliance/audit-logs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComplianceAuditLogs((prev) => prev.filter((log) => log._id !== id));
        toast.success("Compliance audit log deleted");
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Delete care plan log
  const handleDeleteCarePlanAudit = async (id) => {
    if (window.confirm("Delete this care plan audit log?")) {
      try {
        await axios.delete(
          `https://control-panel-backend-k6fr.vercel.app/care-planning/audit-logs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCarePlanAuditLogs((prev) => prev.filter((log) => log._id !== id));
        toast.success("Care plan audit log deleted");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#111827] min-h-screen">
      <Navbar />

      {/* Mobile Navbar Toggle */}
      <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-gray-800 shadow relative">
        <h1 className="text-lg text-white font-semibold absolute left-4">
          Analytics
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
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
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
                  href={item.href}
                  className={`side-menu-item flex items-center px-4 py-3 text-gray-300 rounded-md transition-colors ${
                    item.active
                      ? "bg-gray-700 text-primary-light"
                      : "hover:bg-gray-700 hover:text-primary-light"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
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
        <main className="flex-1 p-6 max-h-screen overflow-hidden">
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-200">
              Reporting Analytics
            </h3>
            <p className="text-xs mb-2 sm:text-sm text-gray-400">
              Filter Setting Analytics
            </p>
          </div>

          {/* Dropdown */}
          <div className="w-full sm:min-w-[180px] font-medium outline-none mb-4 px-3 py-2 text-white text-sm relative z-10">
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full cursor-pointer px-4 py-2 mt-2 bg-gray-800 text-white rounded-md shadow-md appearance-none pr-10"
              >
                <option value="" disabled hidden>
                  Select Filter
                </option>
                <option value="analytics">Analytics</option>
                <option value="compliance">Compliance</option>
                <option value="careplan">Care Plan</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                ▼
              </div>
            </div>
          </div>

          <div className="text-white h-full bg-gray-800 overflow-y-auto my-scroll">
            {/* Analytics Table */}
            {activeTab === "analytics" && (
              <div className="p-4 rounded-lg">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-700 text-left">
                    <tr>
                      <th className="p-3">Care Setting</th>
                      <th className="p-3">Total Staff</th>
                      <th className="p-3">Total Clients</th>
                      <th className="p-3">Valid Trainings</th>
                      <th className="p-3">Expired Trainings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((row, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-600 hover:bg-gray-700"
                      >
                        <td className="p-3">{row.careSetting}</td>
                        <td className="p-3">{row.totalStaff}</td>
                        <td className="p-3">{row.totalClients}</td>
                        <td className="p-3 text-green-400">
                          {row.validTrainings}
                        </td>
                        <td className="p-3 text-red-400">
                          {row.expiredTrainings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analytics.length === 0 && (
                  <p className="text-center py-4 text-gray-400">
                    No analytics available.
                  </p>
                )}
              </div>
            )}

            {/* Compliance Table */}
            {activeTab === "compliance" && (
              <div className="p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-medium text-gray-200">
                  Compliance Audit Logs
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-4">
                  Recent Compliance Data Activity
                </p>
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-700 text-left">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceAuditLogs.length > 0 ? (
                      complianceAuditLogs.map((log, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-600 hover:bg-gray-700"
                        >
                          <td className="p-3">{log.user || "N/A"}</td>
                          <td className="p-3">{log.action}</td>
                          <td className="p-3">{log.targetType}</td>
                          <td className="p-3">{log.requirement}</td>
                          <td className="p-3 text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <FaTrash
                              className="hover:text-red-500 cursor-pointer"
                              onClick={() =>
                                handleDeleteComplianceAudit(log._id)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-400"
                        >
                          No audit logs available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Care Planning Audit Logs */}
            {activeTab === "careplan" && (
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-200">
                  Care Planning Audit Logs
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Recent care planning activity
                </p>
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-700 text-left">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carePlanAuditLogs.length > 0 ? (
                      carePlanAuditLogs.map((log, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-600 hover:bg-gray-700"
                        >
                          <td className="p-3">{log.user || "N/A"}</td>
                          <td className="p-3">{log.action}</td>
                          <td className="p-3">{log.targetType}</td>
                          <td className="p-3">
                            {log.client.fullName || "N/A"}
                          </td>
                          <td className="p-3 text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <FaTrash
                              className="hover:text-red-500 cursor-pointer"
                              onClick={() => handleDeleteCarePlanAudit(log._id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-400"
                        >
                          No care planning audit logs available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

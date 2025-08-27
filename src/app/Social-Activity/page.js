"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import { BsArrowsFullscreen } from "react-icons/bs";
import { SiSimpleanalytics } from "react-icons/si";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoDocumentAttach } from "react-icons/io5";


import Image from "next/image";

import Link from "next/link"; // <-- import Next.js Link
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
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for table format
import { MdMedicationLiquid } from "react-icons/md";


const Page = () => {


  // Define your navigation links here with proper routes
  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    { icon: <FaUser />, label: "Resident Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
    { icon: <MdMedicationLiquid />, label: "Medication Management", href: "/Medication-Management"},
    { icon: <FaSearch />, label: "Social Activity", href: "/Social-Activity",active: true  },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
    {
      icon: <IoDocumentAttach />,
      label: "Documents Management",
      href: "/Documents-Management",
      
    },
    { icon: <GrDocumentPerformance />, label: "Performance-Manag..", href: "/Performance-Management",},
    { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    { icon: <SiSimpleanalytics />, label: "Reporting Analytics", href: "/Analytics",  },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [social, setSocial] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState('All Activity');
  const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members
    const [staffMembers2, setStaffMembers2] = useState([]); // For client/staff members
    const [previewImage, setPreviewImage] = useState(null);


 
  const { user, logout } = useAuth();
  // Define your navigation links here with proper routes
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm4, setShowForm4] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // track if editing
  const [formData4, setFormData4] = useState({
  client: '',
  caregiver: '',
  activityType: '',     // enum value: required
  description: '',      // activity details
  date: '',             // optional (or backend default)
      // optional: file URLs
});

  const filters = ['All Activity', 'family Visits', 'Hobbies', 'Game', 'Social Engagement'];


  



  const handleEdit = (activity) => {
  setFormData4({
    client: activity.client._id,
    caregiver: activity.caregiver._id,
    activityType: activity.activityType,
    description: activity.description,
    date: activity.date?.slice(0, 10),
  });
  setEditingUserId(activity._id);
  setShowForm4(true);
  setAttachments(activity.attachments || []); // Set existing attachments if any
};






const [attachments, setAttachments] = useState([]);

const handleFileChange = (e) => {
  setAttachments(Array.from(e.target.files));
};


  const handleChange4 = (e) => {
    const { name, value } = e.target;
    setFormData4(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  
const handleSubmit4 = (e) => {
  e.preventDefault();
  setLoading(true);
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  const data = new FormData();
  Object.entries(formData4).forEach(([key, value]) => {
    data.append(key, value);
  });
  attachments.forEach(file => {
    data.append('attachments', file);
  });

  const request = editingUserId
    ? axios.put(`http://localhost:3000/social/${editingUserId}`, data, config)
    : axios.post(`http://localhost:3000/social`, data, config);

  request
    .then(res => {
      toast.success(editingUserId ? "Activity updated successfully" : "Activity added successfully");
      setEditingUserId(null);
      setLoading(false);
      setShowForm4(false);
      setFormData4({
        client: '',
        caregiver: '',
        activityType: '',
        description: '',
        date: '',
      });
      setAttachments([]);

      // ✅ FETCH updated data
      return axios.get('http://localhost:3000/social', config);
    })
    .then(res => {
      setSocial(res.data); // social activity list update
      console.log(res.data);
      
    })
    .catch(err => {
      console.error("Error:", err.response?.data);
      setLoading(false);
      toast.error(err.response?.data?.msg || "Submission failed");
    });
};




  useEffect(() => {
    axios.get('http://localhost:3000/social', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        console.log('Fetched users:', response.data);
        setSocial(response.data); // no .users needed, your backend returns an array
        setFilteredStaff(response.data);
        setMessage('Users fetched successfully');
        setError('');
      })
      .catch(error => {
        // console.error('Error fetching users:', error.response?.data || error.message);
        setError(error.response?.data?.msg || 'Failed to fetch users');
      });
  }, []);

  // Filter staff whenever searchQuery or selected changes
 

 useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/hr', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setStaffMembers(response.data.allHr);  // Staff data set
        setMessage('Staff fetched successfully');
        console.log('Fetched staff members:', response.data.allHr[0].fullName);
        
      })
      .catch(error => {
        setError(error.response?.data?.msg || 'Failed to fetch staff');
      });
  }, []);

const handleCancel12 = () => {
  setShowForm4(false);
  setEditingUserId(null);
  setFormData4({
    client: '',
    caregiver: '',
    activityType: '',
    description: '',
    date: '',
  });
  setAttachments([]);
};

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/social/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(() => {
        setMessage('User deleted');
        // Remove user from UI
        const updated = social.filter(user => user._id !== id);
        setSocial(updated);
        setFilteredStaff(updated);
        toast.success("Deleted successfuly")
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.msg || 'Failed to delete user');
        toast.error(err.response?.data?.msg || 'Failed to delete user')
      });
  };


useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/client', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    setStaffMembers2(response.data.clients);  // Staff data set
        setMessage('Staff fetched successfully');
  })
  .catch(error => {
    setError(error.response?.data?.msg || 'Failed to fetch staff');
  });
}, []);



useEffect(() => {
    const filtered = social.filter((plan) => {
      const client = staffMembers2.find((staff) => staff._id === plan.client)?.fullName || '';
      console.log("Filtering for client:", client, "with selected type:", selected);
      
      const matchesType = selected === 'All Activity' || plan.activityType === selected;
      const matchesSearch = client.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  
    setFilteredStaff(filtered);
  }, [selected, searchQuery, social, staffMembers2]);
  
  


// view...............................................................................
  

const [viewClientName, setViewClientName] = useState(null);
const [viewCaregiverName, setViewCaregiverName] = useState(null);
const [viewActivityType, setViewActivityType] = useState(null);
const [viewActivityDate, setViewActivityDate] = useState(null);
const [viewDescription, setViewDescription] = useState(null);
const [showModals, setShowModals] = useState(false);
const [viewAttachments, setViewAttachments] = useState([]);
const handleView = (activity) => {
  setViewClientName(activity.client?.fullName || "Unknown Client");
  setViewCaregiverName(activity.caregiver?.fullName || "Unknown Caregiver");
  setViewActivityType(activity.activityType);
  setViewActivityDate(activity.date?.slice(0, 10));
  setViewDescription(activity.description);
  setViewAttachments(activity.attachments || []); // ✅ Add this line
  setShowModals(true);
};


  const data = {
  "Client": viewClientName,
  "Caregiver": viewCaregiverName,
  "Activity Type": viewActivityType,
  "Date": viewActivityDate,
  "Description": viewDescription,
};




// downnload pdf........................................................
const handleDownloadPdf = async (item) => {
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Social Activity Details", 14, 15);

  // ✅ Table of activity details
  autoTable(doc, {
    startY: 25,
    head: [["Field", "Value"]],
    body: [
      ["Client", item.client?.fullName || ""],
      ["Caregiver", item.caregiver?.fullName || ""],
      ["Activity Type", item.activityType || ""],
      ["Date", item.date?.slice(0, 10) || ""],
      ["Description", item.description || ""],
    ],
  });

  let currentY = doc.lastAutoTable.finalY + 10;

  // ✅ Nested function to handle attachments
  async function addAttachments() {
    if (item.attachments?.length > 0) {
      doc.setFontSize(12);
      doc.text("Attachments:", 14, currentY);
      currentY += 6;

      for (let i = 0; i < item.attachments.length; i++) {
        const url = item.attachments[i];
        const ext = url.split('.').pop().toLowerCase();

        // 🖼️ Handle images without numbering
        if (["jpg", "jpeg", "png"].includes(ext)) {
          try {
            const res = await fetch(url);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            await new Promise((resolve) => {
              reader.onloadend = function () {
                const base64data = reader.result;

                // Page break if needed
                if (currentY + 60 > 280) {
                  doc.addPage();
                  currentY = 20;
                }

                doc.addImage(base64data, 'JPEG', 14, currentY, 50, 50);
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

        // 📄 Handle PDF with icon only — no numbering
        else if (ext === "pdf") {
          try {
            const iconUrl = "https://cdn-icons-png.flaticon.com/512/337/337946.png"; // ✅ PNG icon
            const res = await fetch(iconUrl);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            await new Promise((resolve) => {
              reader.onloadend = function () {
                const iconBase64 = reader.result;

                // Page break if needed
                if (currentY + 22 > 280) {
                  doc.addPage();
                  currentY = 20;
                }

                // Show only icon + clickable link
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
  }

  // ✅ Wait for all attachments
  await addAttachments();

  const fileName = `${item.client?.fullName || "activity"}_record.pdf`;
  doc.save(fileName);
};


















const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/Login');
  }, [user, router]);

  if (!user) return null;




// create  a lopp  and  3 pbject get the name of father  throuhh the loop




















 



  return (
    <div className="bg-[#111827] min-h-screen">
      <Navbar />

      {/* view data /////////////////////////////////////////////// */}
      
    {showModals && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-auto">
    <div className="relative w-full max-w-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] border border-gray-700 bg-gradient-to-br from-[#1b1e25] to-[#111319] text-white px-8 py-10 max-h-[90vh] overflow-y-auto">

      {/* ❌ Close Button */}
      <button
        onClick={() => setShowModals(false)}
        className="absolute top-4 right-4 w-11 h-11 bg-[#2b2e3a] hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-all duration-300"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 💡 Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 flex items-center justify-center gap-2 sm:gap-3">
        Social Record Details
      </h2>

      {/* Info Fields */}
      <div className="space-y-5 mb-6">
        {Object.entries(data).map(([field, value]) => (
          <div
            key={field}
            className="flex justify-between items-start bg-[#1e212a] p-4 rounded-xl border border-gray-700"
          >
            <span className="font-semibold text-gray-300">{field}</span>
            <span className="text-right text-gray-400 max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>

      {/* 📎 Attachments */}
      {viewAttachments?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                        <BsArrowsFullscreen className="text-white text-2xl" />
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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



      {/* Mobile Navbar Toggle */}
      <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-gray-800 shadow relative">
        <h1 className="text-lg text-white font-semibold absolute left-4">
                      Social Activity

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
                  className={`side-menu-item flex items-center px-4 py-3 text-gray-300 rounded-md transition-colors ${item.active
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
                  <p className="text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-h-screen overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-200 mb-6 hidden md:block">
            Social Activity
          </h2>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 h-full overflow-y-auto pr-2 my-scroll">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-200">Social Activity Tracking</h3>
                <p className="text-sm text-gray-400">Keep a history of social activities and visits.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-600 pl-10 pr-4 py-2 focus:border-primary-light focus:ring-primary-light bg-gray-700 text-white"
                    placeholder="Search Social Act..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-500" />
                  </div>
                </div>
                <button
                  onClick={() => setShowForm4(true)}
                  className="bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white px-4 py-2 rounded-md text-[10px] font-medium transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" /> Add New Activity
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex text-white flex-wrap gap-2">
              {filters.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(label)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer backdrop-blur-sm ${selected === label
                    ? "bg-primary-light bg-gray-700 text-primary-light shadow-lg"
                    : " hover:bg-primary-light bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-primary-light"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-[800px] md:min-w-full divide-y divide-gray-700 text-xs sm:text-sm">
                <thead className="bg-gray-700">
                  <tr>
                    {["patient", "Activity", 'Date','Status',  "Actions"].map((col, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((item, i) => (
                      <tr key={i}>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full text-blue-500 flex items-center justify-center border-gray-600">
    {
                        (staffMembers2.find(staff => staff._id === item.client?._id)?.fullName || "Unknown")
                          .split(" ")
                          .map(word => word[0])
                          .join("")
                          .toUpperCase()
                      }                            </div>
                            <div>
                              <div className="text-[12px] font-medium text-white">                      {staffMembers2.find(staff => staff._id === item.client?._id)?.fullName || "Unknown"}
</div>
                              <div className="text-sm text-gray-400"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-white">{item.activityType}</td>
                        <td className="px-4 py-4 text-sm text-white">{item.date.slice(0, 10)}</td>
                        <td className="px-4 py-4 text-sm text-white">Active</td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2 text-white">
                            <button className="hover:text-blue-500 transition cursor-pointer" onClick={() => handleView(item)}>
                              <FaEye />
                            </button>
                            <button className="cursor-pointer hover:text-yellow-500 transition" onClick={() => handleEdit(item)}>
                              <FaEdit />
                            </button>
                            <button className="cursor-pointer hover:text-red-500 transition" onClick={() => handleDelete(item._id)}>
                              <FaTrash />
                            </button>
                            <button className="hover:text-green-600 transition cursor-pointer" onClick={() => handleDownloadPdf(item)}>
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center px-4 sm:px-6 py-24 text-gray-400 text-sm">
                        No Social Activity.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form */}
       {showForm4 && (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4">
    <form
      onSubmit={handleSubmit4} encType="multipart/form-data"
      className="bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto"
    >
    <h2 className="text-center text-white font-semibold mb-4 text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl">
  {editingUserId ? "Edit Social Activity" : "Add Social Activity"}
</h2>


      {/* client */}
  {/* Client ID */}
          <div className="mb-4">
            <label htmlFor="clientId" className="block text-gray-300 text-sm font-medium mb-2">Patient</label>
            <select
              id="client"
              name="client"
              value={formData4.client}
              onChange={handleChange4}
              required
              className="shadow-sm border rounded w-full py-2 px-3 text-gray-300 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Select Patient</option>
             {staffMembers2
  .filter(client => user?.role !== 'Client' || user.clients.includes(client._id))
  .map(client => (
    <option key={client._id} value={client._id}>{client.fullName}</option>
))}
            </select>
                <input type="hidden" name="clientName" id="clientName" value={formData4.client.fullName} />

          </div>

        <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">Staff Member</label>
                  <select
                    name="caregiver"
                    value={formData4.caregiver}
                    onChange={handleChange4}
                    required
                    className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
                  >
                    <option value="">Select Staff Member</option>
                    {staffMembers.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.fullName}
                      </option>
                    ))}
                  </select>
                </div>

      {/* Family Visits */}
      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-300">Activity Type</label>
  <select
    name="activityType"
    value={formData4.activityType}
    onChange={handleChange4}
    required
    className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
  >
    <option value="">Select an activity</option>
    <option value="Family Visit">Family Visit</option>
    <option value="Game">Game</option>
    <option value="Hobby">Hobby</option>
    <option value="Social Engagement">Social Engagement</option>
    <option value="Other">Other</option>
  </select>
</div>

      {/* Activity Date */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">Activity Date</label>
        <input
          type="date"
          name="date"
          value={formData4.date}
          onChange={handleChange4}
          required
          className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
        />
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">Notes</label>
        <textarea
          name="description"
          value={formData4.description}
          onChange={handleChange4}
          rows="4"
          className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
          placeholder="Add any notes..."
        />
      </div>

      {/* Media Upload */}
      <div className="mb-4">
  <label className="block text-gray-300 text-sm font-medium mb-2">
    Attach Media
  </label>
  <input
     type="file"
      name="attachments"
        onChange={handleFileChange}
      multiple
    className="w-full rounded border py-2 px-3 bg-gray-700 text-gray-300 border-gray-600"
  />
</div>


      {/* Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleCancel12}
          className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded"
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
editingUserId ? "Update Activity" : "Add Activity"
        )}
      </button>
      </div>
    </form>
  </div>
)}


        </main>



      </div>
    </div>
  );
};

export default Page;
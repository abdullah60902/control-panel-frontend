'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../(component)/navbar/Navbar';
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
  FaEdit,
  FaTrash,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CarePlans = [
  {
    Client: 'Noman developer',
    PlanType: 'Nursing',
    Created: '02/21/2222',
    ReviewDate: '02/21/2222',
    status: 'Current',
  },
];

const Page = () => {
 

  // Define your navigation links here with proper routes
  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning", active: true  },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management"},
    { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
  ];
 const [carePlans, setCarePlans] = useState([]);
const [formDataCare, setFormDataCare] = useState({
  client: '',
  planType: '',
  creationDate: '',
  reviewDate: '',
  carePlanDetails: ''
});
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredStaff, setFilteredStaff] = useState([]);
const [editingCareId, setEditingCareId] = useState(null);
const [message, setMessage] = useState('');
const [error, setError] = useState('');
const [showFormCare, setShowFormCare] = useState(false);
            const [sidebarOpen, setSidebarOpen] = useState(false);
        const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members

const handleChangeCare = (e) => {
  const { name, value } = e.target;
  setFormDataCare(prev => ({ ...prev, [name]: value }));
};
const [selected, setSelected] = useState('All Plans');
const filters = ['All Plans', 'Nursing', 'Nutrition', 'Mobility', 'Medication'];

const handleEditCare = (plan) => {
  setFormDataCare({
    client: plan.client,
    planType: plan.planType,
    creationDate: plan.creationDate.slice(0, 10),
    reviewDate: plan.reviewDate.slice(0, 10),
    carePlanDetails: plan.carePlanDetails
  });
  setEditingCareId(plan._id);
  setShowFormCare(true);
};






 const handleSubmitCare = (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const request = editingCareId
    ? axios.put(`https://control-panel-backend-eta.vercel.app/carePlanning/${editingCareId}`, formDataCare, config)
    : axios.post(`https://control-panel-backend-eta.vercel.app/carePlanning`, formDataCare, config);

  request
    .then(res => {
      setMessage(editingCareId ? 'Care Plan updated' : 'Care Plan added');
      setEditingCareId(null);
      setFormDataCare({
        client: '',
        planType: '',
        creationDate: '',
        reviewDate: '',
        carePlanDetails: ''
      });
      toast.success("Add successfuly")
      setShowFormCare(false);
      return axios.get('https://control-panel-backend-eta.vercel.app/carePlanning', config);
    })
    .then(res => {
      setCarePlans(res.data);
    })
    .catch(err => {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.error || 'An error occurred');
      toast.error(err.response?.data?.error || 'An error occurred')
    });
};

const handleDeleteCare = (id) => {
  if (!window.confirm('Are you sure you want to delete this care plan?')) return;
  const token = localStorage.getItem('token');
  axios.delete(`https://control-panel-backend-eta.vercel.app/carePlanning/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => {
    setMessage('Care Plan deleted');
    const updated = carePlans.filter(plan => plan._id !== id);
    setCarePlans(updated);
    setFilteredStaff(updated);
    toast.success("Deleted successfuly")
  })
  .catch(err => {
    console.error(err);
    setError(err.response?.data?.error || 'Failed to delete care plan');
    toast.error(err.response?.data?.error || 'Failed to delete care plan')
  });
};
useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('https://control-panel-backend-eta.vercel.app/carePlanning', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    setCarePlans(res.data);
    setMessage('Care Plans fetched');
  })
  .catch(err => {
    console.error(err);
    setError(err.response?.data?.error || 'Failed to fetch care plans');
  });
}, []);

useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('https://control-panel-backend-eta.vercel.app/client', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    setStaffMembers(response.data.clients);  // Staff data set
    setMessage('Staff fetched successfully');
  })
  .catch(error => {
    setError(error.response?.data?.msg || 'Failed to fetch staff');
  });
}, []);
useEffect(() => {
  const filtered = carePlans.filter((plan) => {
    if (selected === 'All Plans') return true;
    return plan.planType === selected;
  });

  setFilteredStaff(filtered);
}, [selected, carePlans]);


const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/Login');
  }, [user,router]);

  if (!user) return null;




  return (
    <div className="bg-[#111827] min-h-screen flex flex-col">
      <Navbar />

      {/* Mobile Navbar Toggle */}
      <div className="md:hidden flex items-center justify-end px-4 py-3 bg-white dark:bg-gray-800 shadow relative">
        <h1 className="text-lg text-gray-900 dark:text-white font-semibold absolute left-4">Care Planning</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-800 dark:text-white text-xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - Desktop & Mobile */}
        <aside
          className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:block`}
        >
          <nav className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center md:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">Navigation</p>

            </div>
            <div className="flex-1 px-2 py-4 overflow-y-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-md transition-colors ${item.active
                      ? "bg-primary-light dark:bg-gray-700 text-primary-light"
                      : "hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light"
                    }`}
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile after click
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
                    {
 user.fullName
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 hidden md:block">Care Planning</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Care Plans</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage care plans</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light dark:bg-gray-700 dark:text-white text-base"
                    placeholder="Search clients..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <button onClick={() => setShowFormCare(true)} className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <FaPlus className="mr-2" /> Add New Client
                </button>
              </div>
            </div>

            <div className="mb-6 flex text-white flex-wrap gap-2">
              {filters.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(label)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer backdrop-blur-sm ${selected === label
                      ? 'bg-primary-light text-primary dark:bg-gray-700 dark:text-primary-light shadow-lg'
                      : 'bg-gray-100 hover:bg-primary-light dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['Client', 'Plan Type', 'Created', 'Review Date', 'Status', 'Actions'].map((col, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStaff.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white text-blue-500 flex items-center justify-center rounded-full">
{
  (staffMembers.find(staff => staff._id === item.client)?.fullName || "U")
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{staffMembers.find(staff => staff._id === item.client)?.fullName || "Unknown"}
</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.planType}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.creationDate.slice(0,10)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.reviewDate.slice(0,10)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                          {"Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <FaEye className="text-blue-500 cursor-pointer" />
                          <FaEdit className="text-yellow-500 cursor-pointer" onClick={() => handleEditCare(item)} />
                          <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteCare(item._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStaff.length === 0 && (
                                <p className="text-center px-4 sm:px-6 py-36 text-gray-500 dark:text-gray-400">No staff found.</p>
                            )}
            </div>
          </div>
   {/* Modal care plane form */}
      {showFormCare && (
        <div className="fixed inset-0  bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg">
            <form id="add-care-plan-form" className="p-4" onSubmit={handleSubmitCare}>
              {/* Client ID */}
              <div className="mb-4">
                <label htmlFor="clientId" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Client
                </label>
                <select
                  id="client"
                  name="client"
                  value={formDataCare.client}
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Client</option>
                    {staffMembers  // Staff data set
.map((client) => (
      <option key={client._id} value={client._id}>
        {client.fullName} 
      </option>
    ))}
                 
                </select>
                <input type="hidden" name="clientName" id="clientName" value={formDataCare.client.fullName} />
              </div>

              {/* Plan Type */}
              <div className="mb-4">
                <label htmlFor="planType" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Plan Type
                </label>
                <select
                  id="planType"
                  name="planType"
                  value={formDataCare.planType}
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Plan Type</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Medication">Medication</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              {/* Creation Date */}
              <div className="mb-4">
                <label htmlFor="createDate" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Creation Date
                </label>
                <input
                  id="creationDate"
                  name="creationDate"
                  type="date"
                  value={formDataCare.creationDate}
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Review Date */}
              <div className="mb-4">
                <label htmlFor="reviewDate" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Review Date
                </label>
                <input
                  id="reviewDate"
                  name="reviewDate"
                  type="date"
                  value={formDataCare.reviewDate
                  }
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Care Plan Details */}
              <div className="mb-4">
                <label htmlFor="details" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Care Plan Details
                </label>
                <textarea
                  id="carePlanDetails"
                  name="carePlanDetails"
                  rows="4"
                  value={formDataCare.carePlanDetails}
                  onChange={handleChangeCare}
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowFormCare(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Care Plan
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

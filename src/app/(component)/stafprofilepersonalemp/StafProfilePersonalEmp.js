"use client";
import React, { useState } from "react";
import { FiEdit2, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";

const StafProfilePersonalEmp = ({ staff }) => {
  const updateStaff = async (field, value) => {
    try {
      await fetch(`http://localhost:3000/hr/${staff._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ [field]: value }),
        
      });window.location.reload();
    } catch (error) {
      console.log("Update Error:", error);
    }
  };

  // 🔥 Editable Field (Auto Input + Dropdown + Date Picker)
  const EditableField = ({ label, dbField, value: initialValue }) => {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    // Dropdown fields
    const dropdownOptions = {
      department: [
        "Nursing",
        "Care",
        "Administration",
        "Management",
        "Support",
      ],
      careSetting: [
        "Residential Care",
        "Nursing Homes",
        "Learning Disabilities",
        "Supported Living",
        "Mental Health Support",
        "Domiciliary Care",
        "Other Services",
      ],
    };

    const isDropdown = dropdownOptions[dbField];
    const isDateField = dbField === "dob" || dbField === "startDate" || dbField === "passportExpiry" || dbField === "visaExpiry";

  const handleSave = async () => {
  try {
    // Call updateStaff (jo backend update kare)
    await updateStaff(dbField, value);

    // Update UI
    setIsEditing(false);

    // Show toast
    toast.success(`${dbField} updated successfully`);
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};

    const handleDateChange = (e) => {
      setValue(e.target.value);
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm text-gray-400">{label}</label>

          {/* BUTTON */}
          <button
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg cursor-pointer text-white font-medium transition-all duration-300 
              ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 shadow-md scale-[1.02]"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md scale-[1.02]"
              }
              active:scale-95
            `}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? <FiSave size={16} /> : <FiEdit2 size={16} />}
            <span className="hidden sm:inline">
              {isEditing ? "Save" : "Edit"}
            </span>
            <span className="sm:hidden">{isEditing ? "S" : "E"}</span>
          </button>
        </div>

        {/* FIELD UI */}
        {isEditing ? (
          isDropdown ? (
            <select
              className="w-full bg-[#2d3b4e] border-l-4 border-[#5A58C9] rounded-r p-2 text-white"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              {dropdownOptions[dbField].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : isDateField ? (
            <div className="w-full">
              <input
                type="text"
                className="w-full bg-[#2d3b4e] border-l-4 border-[#5A58C9] rounded-r p-2 text-white cursor-pointer"
                value={value}
                onChange={handleDateChange}
              />
            </div>
          ) : (
            <input
              type="text"
              className="w-full bg-[#2d3b4e] border-l-4 border-[#5A58C9] rounded-r p-2 text-white"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )
        ) : (
          <div className="bg-[#2d3b4e] border-l-4 border-[#5A58C9] rounded-r p-2 text-white">
            {value}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Primary Identity */}
      <div className="bg-[#243041] rounded-lg shadow p-3 sm:p-4 md:p-6 mb-6 h-full overflow-y-auto">
        <h2 className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold mb-4 text-white">
          👤 Primary Identity
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <EditableField
            label="Full Name:"
            dbField="fullName"
            value={staff?.fullName || "name:"}
          />
          <EditableField
            label="Date of Birth"
            dbField="dob"
            value={staff?.dob || "mm/dd/yyyy"}
          />
          <EditableField
            label="National Insurance"
            dbField="niNumber"
            value={staff?.niNumber || "N/A"}
          />
        </div>
      </div>
      {/* Contact */}
      <div className="bg-[#243041] rounded-lg shadow p-3 sm:p-4 md:p-6 mb-6">
        <h2 className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold mb-4 text-white">
          📞 Contact & Home Address
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <EditableField
            label="Contact Number"
            dbField="contactNumber"
            value={staff?.contactNumber || "N/A"}
          />
          <EditableField
            label="Email"
            dbField="email"
            value={staff?.email || "N/A"}
          />
        </div>

        <EditableField
          label="Home Address"
          dbField="address"
          value={staff?.address || "N/A"}
        />
      </div>
      {/* Next of Kin */}
      <div className="bg-[#243041] rounded-lg shadow p-3 sm:p-4 md:p-6 mb-6">
        <h2 className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold mb-4 text-white">
          🚨 Next of Kin (Emergency Contact)
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <EditableField
            label="Next of Kin Full Name:"
            dbField="nextOfKinName"
            value={staff?.nextOfKinName || "N/A"}
          />
          <EditableField
            label="Relationship"
            dbField="nextOfKinRelationship"
            value={staff?.nextOfKinRelationship || "N/A"}
          />
          <EditableField
            label="Email:"
            dbField="nextOfKinEmail"
            value={staff?.nextOfKinEmail || "N/A"}
          />
        </div>

        <EditableField
          label="Address:"
          dbField="nextOfKinAddress"
          value={staff?.nextOfKinAddress || "N/A"}
        />
      </div>
      {/* Employment Details */}
      <div className="bg-[#243041] rounded-lg shadow p-3 sm:p-4 md:p-6 mb-6">
        <h2 className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold mb-4 text-white">
          💼 Employment Details & Status
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* 🔥 Job Title → DROPDOWN added */}
          <EditableField
            label="Department:"
            dbField="department"
            value={staff?.department || "N/A"}
          />

          {/* 🔥 Service Type → DROPDOWN */}
          <EditableField
            label="Service Type:"
            dbField="careSetting"
            value={staff?.careSetting || "N/A"}
          />

          <EditableField
            label="Position:"
            dbField="position"
            value={staff?.position || "N/A"}
          />
          <EditableField
            label="Start Date:"
            dbField="startDate"
            value={staff?.startDate?.slice(0, 10) || "N/A"}
          />
          <EditableField
            label="Termination Status:"
            dbField="terminationStatus"
            value={staff?.terminationStatus || "N/A"}
          />
          <EditableField
            label="Contract Details:"
            dbField="contractDetails"
            value={staff?.contractDetails || "N/A"}
          />
        </div>
      </div>
      {/* Compliance */}{" "}
      <div className="bg-[#243041] rounded-lg shadow p-6 mb-6">
        {" "}
        <h2 className="text-xl font-semibold mb-4 text-white">
          🛡️ Compliance & Eligibility
        </h2>{" "}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {" "}
          <EditableField
            label="DBS Status"
            dbField="dbsStatus"
            value={staff?.dbsStatus || "N/A"}
          />{" "}
          <EditableField
            label="Professional Registration"
            dbField="professionalRegistration"
            value={staff?.professionalRegistration || "N/A"}
          />{" "}
          <EditableField
            label="Right to Work"
            dbField="rightToWorkStatus"
            value={staff?.rightToWorkStatus || "N/A"}
          />{" "}
        </div>{" "}
      </div>
      {/* Passport */}{" "}
      <div className="bg-[#243041] rounded-lg shadow p-6 mb-6">
        {" "}
        <h2 className="text-xl font-semibold mb-4 text-white">
          📄 Passport & Visa
        </h2>{" "}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {" "}
          <EditableField
            label="Passport Number"
            dbField="passportNumber"
            value={staff?.passportNumber || "N/A"}
          />{" "}
          <EditableField
            label="Passport Country"
            dbField="passportCountry"
            value={staff?.passportCountry || "N/A"}
          />{" "}
          <EditableField
            label="Passport Expiry"
            dbField="passportExpiry"
            value={staff?.passportExpiry || "N/A"}
          />{" "}
          <EditableField
            label="Visa Required"
            dbField="visaRequired"
            value={staff?.visaRequired || "N/A"}
          />{" "}
          <EditableField
            label="Visa Number"
            dbField="visaNumber"
            value={staff?.visaNumber || "N/A"}
          />{" "}
          <EditableField
            label="Visa Expiry"
            dbField="visaExpiry"
            value={staff?.visaExpiry || "N/A"}
          />{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default StafProfilePersonalEmp;

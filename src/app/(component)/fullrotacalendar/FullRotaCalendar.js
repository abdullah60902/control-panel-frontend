"use client";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function FullRotaCalendar({ shifts }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoverShift, setHoverShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentDay = 1 - firstDay;
  while (currentDay <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay < 1 || currentDay > daysInMonth ? null : currentDay);
      currentDay++;
    }
    weeks.push(week);
  }

  const getShiftForDate = (day) => {
    if (!day) return [];
    return shifts.filter((s) => {
      const d = new Date(s.date);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
  };

  return (
    <div className="relative bg-[#243041] p-2 sm:p-4 md:p-6 rounded-lg border border-[#4A49B0] text-white space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 bg-[#2d3b4e] p-3 rounded-lg border border-[#4A49B0]">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-0">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="bg-[#4A49B0] hover:bg-[#3b49a8] p-2 rounded"
          >
            <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="bg-[#4A49B0] hover:bg-[#3b49a8] p-2 rounded"
          >
            <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Days Row */}
      <div className="grid grid-cols-7 text-center text-gray-300 font-semibold text-[10px] sm:text-sm md:text-base">
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, i) =>
          week.map((day, j) => {
            const shiftsForDay = getShiftForDate(day);
            const isDayOff = shiftsForDay.some(s => s.type === "dayoff");

            let bg = "bg-[#1f2937]";
            if (isDayOff) bg = "bg-green-500/40 text-white";
            else if (shiftsForDay.length > 0) bg = "bg-red-500/40 text-white";

            return (
              <div
                key={`${i}-${j}`}
                onMouseEnter={() => setHoverShift(shiftsForDay)}
                onMouseLeave={() => setHoverShift(null)}
                onClick={() => setSelectedShift(shiftsForDay)}
                className={`${bg} h-20 sm:h-24 rounded-lg p-1 sm:p-2 flex flex-col justify-between cursor-pointer border border-[#4A49B0] hover:brightness-125 transition-all text-[9px] sm:text-[10px] md:text-sm`}
              >
                <span className="font-bold text-xs sm:text-sm">{day || ""}</span>
                {shiftsForDay.length > 0 && (
                  <div className="leading-tight text-white truncate">
                    {isDayOff
                      ? "DAY OFF"
                      : shiftsForDay.map(s => `${s.start}-${s.end} | ${s.resident || "Not Provided"}`).join(" | ")}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Hover Popup */}
    {/* Hover Popup */}
{hoverShift && hoverShift.length > 0 && (
  <div className="absolute top-2 right-2 sm:right-4 bg-[#2d3b4e] border border-[#4A49B0] shadow-lg p-2 sm:p-3 rounded text-[10px] sm:text-sm w-48 sm:w-56 z-50">
    <h4 className="font-bold mb-1 text-sm sm:text-base">Shift Info</h4>
    {hoverShift.map((s, i) => (
      <div key={i} className="border-b border-[#4A49B0] py-1">
        <div>
          {s.type === "dayoff" ? (
            <>
              <div className="text-green-300 text-xs sm:text-sm">DAY OFF</div>
              <div className="text-gray-300 text-xs sm:text-sm truncate">
                Name: {s.resident || "Not Provided"}
              </div>
            </>
          ) : (
            <>
              <div>{s.start} - {s.end}</div>
              <div className="text-gray-300 text-xs sm:text-sm truncate">{s.location}</div>
              <div className="text-gray-300 text-xs sm:text-sm truncate">Name: {s.resident || "Not Provided"}</div>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
)}

{/* Click Popup */}
{/* Click Popup */}
{selectedShift && selectedShift.length > 0 && (
  <div className="absolute inset-0 flex justify-center items-center p-2 sm:p-0 z-50">
    <div className="bg-[#2d3b4e] p-3 sm:p-5 rounded-lg w-full max-w-sm sm:w-80 border border-[#4A49B0] shadow-xl">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 border-b border-[#4A49B0] pb-2">
        Shift Details
      </h3>

      <p className="text-gray-300 text-sm sm:text-base mb-2">
        Date: {new Date(selectedShift[0].date).toDateString()}
      </p>

      {selectedShift.map((s, i) => (
        <div key={i} className="mb-2">
          {s.type !== "dayoff" && (
            <>
              <p className="font-semibold text-sm sm:text-base"> Timing: {s.start} - {s.end}</p>
              <p className="text-gray-300 text-sm sm:text-base">Location: {s.location}</p>
              <p className="text-gray-300 text-sm sm:text-base">Name: {s.resident || "Not Provided"}</p>
              <p className="text-gray-300 text-sm sm:text-base">Hourly Rate: ${s.rate || "0.00"}</p>
              <p className="text-gray-300 text-sm sm:text-base">Total Hours: {s.hours || "0.0"}</p>
            </>
          )}
          <p className="text-gray-300 text-sm sm:text-base">Type: {s.type}</p>
        </div>
      ))}

      <button
        onClick={() => setSelectedShift(null)}
        className="mt-3 bg-red-600 cursor-pointer hover:bg-red-700 w-full py-2 rounded text-white font-medium text-sm sm:text-base"
      >
        Close
      </button>
    </div>
  </div>
)}


    </div>
  );
}

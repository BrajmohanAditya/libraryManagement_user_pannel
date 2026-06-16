import React from "react";
import { MapPin, Clock, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LibraryCard = ({ library }) => {
  const navigate = useNavigate();

  const {
    id,
    name,
    address,
    city,
    state,
    phone,
    images = [],
    openingTime,
    closingTime,
  } = library;

  // Default placeholder image if no images uploaded
  const libraryImage =
    images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80";

  // Check if library is currently open
  const checkIsOpen = () => {
    try {
      if (!openingTime || !closingTime) return true;
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMins = currentHour * 60 + currentMinute;

      const parseTimeToMinutes = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const openMins = parseTimeToMinutes(openingTime);
      const closeMins = parseTimeToMinutes(closingTime);

      return currentTimeInMins >= openMins && currentTimeInMins <= closeMins;
    } catch (e) {
      return true;
    }
  };

  const isOpen = checkIsOpen();

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col group h-full">
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={libraryImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm flex items-center gap-1.5 backdrop-blur-sm ${
              isOpen
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            <span className={`w-2 h-2 rounded-full bg-white ${isOpen ? "animate-pulse" : ""}`} />
            {isOpen ? "OPEN NOW" : "CLOSED"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-slate-500 mb-3 text-sm">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {address}, {city}, {state}
            </span>
          </div>

          {/* Timings & Contact Info */}
          <div className="space-y-2 py-3 border-t border-b border-slate-50 mb-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Timings: <span className="font-semibold text-slate-700">{openingTime} - {closingTime}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{phone || "Not Available"}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/library/${id}`)}
          className="w-full py-3 bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <span>View Study Spaces</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default LibraryCard;

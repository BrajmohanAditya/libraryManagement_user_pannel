import React, { useState, useRef, useEffect } from "react";

const PopoverContext = React.createContext();

export const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ children, className = "", ...props }) => {
  const { open, setOpen } = React.useContext(PopoverContext);
  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
};

export const PopoverContent = ({ children, className = "", ...props }) => {
  const { open } = React.useContext(PopoverContext);
  if (!open) return null;
  return (
    <div
      className={`absolute right-0 z-50 bg-white border rounded-xl shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

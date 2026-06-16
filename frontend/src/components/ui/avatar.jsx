import React from "react";

export const Avatar = ({ className = "", children, ...props }) => (
  <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export const AvatarImage = ({ src, className = "", ...props }) => {
  if (!src) return null;
  return <img src={src} className={`w-full h-full object-cover ${className}`} {...props} />;
};

export const AvatarFallback = ({ className = "", children, ...props }) => (
  <div className={`flex items-center justify-center ${className}`} {...props}>
    {children}
  </div>
);

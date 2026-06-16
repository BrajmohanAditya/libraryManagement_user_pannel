import React from "react";

const StudentIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3l10 4 10-4" />
    <path d="M2 3v7l10 4 10-4V3" />
    <path d="M2 10v4l10 4 10-4v-4" />
  </svg>
);

export default StudentIcon;

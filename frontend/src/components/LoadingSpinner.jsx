import React from "react";

import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = ({ text }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <FaSpinner className="size-10 animate-spin text-blue-500" />
        <p className="text-xl">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

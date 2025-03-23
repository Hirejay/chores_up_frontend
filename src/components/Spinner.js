import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="w-12 h-12 border-4 border-white border-b-red-500 rounded-full inline-block animate-spin"></span>
    </div>
  );
};

export default Spinner;

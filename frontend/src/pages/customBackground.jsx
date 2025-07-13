// src/components/CustomBackground.jsx
import React from 'react';

const CustomBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-30 rounded-full blur-[150px] animate-blob1 top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 rounded-full blur-[130px] animate-blob2 top-[300px] right-[-150px]" />
      <div className="absolute w-[600px] h-[600px] bg-pink-500 opacity-20 rounded-full blur-[180px] animate-blob3 bottom-[-200px] left-[200px]" />
    </div>
  );
};

export default CustomBackground;

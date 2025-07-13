import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-100"></div>
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
      <span className="text-sm text-gray-300">Typing...</span>
    </div>
  );
};

export default TypingIndicator;

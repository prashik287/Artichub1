import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-[150vh] h-[80vh] bg-gray-900">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loading;
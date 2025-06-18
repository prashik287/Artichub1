import React from "react";
export default function PaymentFailed() {
    return (
      <div className="flex w-[95%] items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-gray-900 text-white p-10 rounded-2xl shadow-lg max-w-md text-center">
          <div className="mb-6">
            <div className="animate-pulse inline-block text-red-500 text-6xl">✖</div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
          <p className="text-gray-400 mb-6">Oops! Something went wrong with your transaction.</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
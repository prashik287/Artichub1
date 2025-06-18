import React from "react";
const PaymentCancelled = () => {
    return (
      <div className="flex flex-col w-[95%] h-[2%] items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-xl text-center">
          <div className="text-7xl">😔</div>
          <h1 className="text-3xl font-bold mt-4">Payment Cancelled</h1>
          <p className="mt-2 text-gray-300">Your transaction was not completed. If this was a mistake, please try again.</p>
          <button 
            className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  };
  
  export default PaymentCancelled;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // ✅ For celebration effect

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // ✅ Redirect to orders after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-500 to-blue-900">
      {/* 🎊 Confetti for Celebration */}
      <Confetti
        numberOfPieces={300}
        recycle={false}
        gravity={0.2}
        initialVelocityY={20}
      />
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg text-center relative animate-fadeIn">
        {/* ✅ Animated Checkmark */}
        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
          <svg
            className="w-12 h-12 text-green-500 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 🎉 Payment Successful Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* 📝 Transaction Summary */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            📜 Order Summary
          </h3>
          <div className="text-gray-600 text-left">
            <p>
              <strong>Order ID:</strong> #{Math.floor(Math.random() * 1000000)}
            </p>
            <p>
              <strong>Payment ID:</strong> RZP_{Math.floor(Math.random() * 1000)}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹{(Math.random() * 10000).toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-500 font-bold">SUCCESS ✅</span>
            </p>
          </div>
        </div>

        {/* 🎯 Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            🏠 Go to Home
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all"
          >
            📦 View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

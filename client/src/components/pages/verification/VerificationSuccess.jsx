import React from 'react';
import { Link } from 'react-router-dom';
import verifsuc from '../images/verisuce.jpeg';

const VerificationSuccess = () => {
  return (
    <div
      className=" ml-60 relative flex items-center justify-center h-screen "
      style={{
        backgroundImage: `url(${verifsuc})`,
        backgroundPosition: 'right', // Change background position to right
        backgroundSize: 'cover', // Ensure the image covers the whole area
        backgroundRepeat: 'no-repeat', // Prevent repeating of the image
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div> {/* Overlay for darkening the background */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 w-full max-w-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Verification Successful!</h2>
        <p className="text-gray-600 mb-6">You have successfully verified your account.</p>
        <Link to="/login" className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all">
          Continue to Login
        </Link>
      </div>
    </div>
  );
};

export default VerificationSuccess;

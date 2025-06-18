import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ResetPass() {
  const {uid , token} = useParams()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [new_password	, setnew_password	] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmVisibility = () => setShowConfirm(!showConfirm);

  const resetpass = async (event) => {
    event.preventDefault(); // Prevent page refresh 🚀
  
    if (new_password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    console.log("Password reset successfully:", new_password);
  
    try {
      console.log("Uid:",uid)
      
      await axios.post("http://127.0.0.1:8000/api/user/password-reset-confirm/", {
    
        new_password,
        uid, // Include uid & token in request (if needed by backend)
        token,
      })
      .then((response) => {
        console.log(response);
        console.log(document.cookie);
      })
      .catch((error) => {
        console.log(error);
      });
  
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };
  
  return (
    <div className="flex items-center justify-center bg-gradient-to-br w-[80%] h-[80%] from-gray-100 to-blue-100 rounded-lg">
      <div className="text-blue-500 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Reset Password</h1>
          <p className="text-gray-600 mt-2">Set a new password</p>
        </div>
        <form className="space-y-4" onSubmit={resetpass}>
          
          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-800">
              New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                id="new-password"
                value={new_password	}
                onChange={(e) => setnew_password	(e.target.value)}
                className="block w-full p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 text-gray-700"
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-800">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 text-gray-700"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmVisibility}
                className="absolute inset-y-0 right-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>2
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Reset
            </button>
          </div>

        </form>

     
      </div>
    </div>
  );
}

export default ResetPass;

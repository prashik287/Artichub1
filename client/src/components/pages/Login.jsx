import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import fail from './images/fail-svgrepo-com.svg';
import { useUser } from '../UserContext'

export const Login = () => {
  const [Formdata, setFormData] = useState({ email: '', password: '', acctype: 'buyer' });
  const navigate = useNavigate();
  const [resp, setResp] = useState('');
  const { setUserdata } = useUser(); // Get setUserdata from context
  const [showErrorModal, setShowErrorModal] = useState(false); // State for error modal visibility
  const [showResendButton, setShowResendButton] = useState(false); // Show resend verification button

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:7000/auth/login', Formdata);
      localStorage.setItem("token", response.data.token);
      setUserdata(response.data.user); // Update user data in context
      navigate('/dashboard');
    } catch (error) {
      console.log(error.response);
      const errorMessage = error.response.data.message ||"Login failed";
      console.log(errorMessage);
      setResp(errorMessage); // Set error message
      setShowErrorModal(true); // Show error modal

      // Check if the error is related to user verification
      if (errorMessage === "User not verified") {
        setShowResendButton(true); // Show resend verification button
      } else {
        setShowResendButton(false); // Hide the button for other errors
      }
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await axios.post("http://127.0.0.1:7000/resendmail/resendmail", { email: Formdata.email,acctype:Formdata.acctype });
      alert("Verification email sent!");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div className="mt-[-1] ml-60 font-mono">
      <div className="flex justify-center items-center min-h-screen dark:bg-blue-500">
        <form onSubmit={handleSubmit}>
          <div className="max-w-sm w-full rounded-lg shadow-lg bg-white p-6 space-y-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="mt-2 text-base text-gray-600">
                Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email
                </label>
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  type="email"
                  id="email"
                  name="email"
                  value={Formdata.email}
                  onChange={(e) => setFormData({ ...Formdata, email: e.target.value })}
                  placeholder="manish@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  type="password"
                  name="password"
                  id="password"
                  value={Formdata.password}
                  onChange={(e) => setFormData({ ...Formdata, password: e.target.value })}
                  placeholder="Enter your p@ssword"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="acctype">
                  Account Type
                </label>
                <select
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  id="acctype"
                  name="acctype"
                  value={Formdata.acctype}
                  onChange={(e) => setFormData({ ...Formdata, acctype: e.target.value })}
                  required
                >
                  <option value="buyer">Customer</option>
                  <option value="seller">Merchant</option>
                </select>
              </div>
              <div className="container mx-0 min-w-full flex flex-col items-center">
                <button className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl text-white hover:scale-105">
                  Login
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 w-full max-w-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full w-16 h-16 flex items-center justify-center">
                <img src={fail} alt="Failure Icon" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Login Failed!</h2>
            <p className="text-gray-600 mb-6">{resp}</p>
            {/* Conditionally show the resend verification button */}
            {showResendButton && (
              <button
                onClick={resendVerificationEmail}
                className="bg-blue-600 m-2 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-all mb-4"
              >
                Resend Email
              </button>
            )}
            <button onClick={() => setShowErrorModal(false)} className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

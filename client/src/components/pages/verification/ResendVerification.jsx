import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const ResendVerification = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [Formdata, setFormData] = useState({
    email: email,
  })
  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Email not provided.");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("http://127.0.0.1:9000/auth/resend-verification", { email });
      setMessage("Verification email sent successfully!");
    } catch (error) {
      setMessage("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[-1] ml-60 p-4">
      <div className="flex justify-center items-center min-h-screen dark:bg-lime-900">
        <form onSubmit={handleResendVerification}>
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
              <div className=" items-center justify-between ">
                <button className=" bg-blue-500 p-4 rounded-2xl ">
                  {loading? "Sending..." : "Resend Verification"}
                </button>
              </div>
              </div>
              </div>
              </form>
              </div>
              
</div>
  );
};

export default ResendVerification;

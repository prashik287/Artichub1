import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Signup() {
  const [Formdata, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acctype: 'buyer',
    storeName: '',
  });
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');  // Holds the modal message
  const [isError, setIsError] = useState(false);  // State to track if the modal is for error

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...Formdata,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/user/register", Formdata);
      console.log("Registration successful:", response);
      setModalMessage("Registration successful! Welcome!");
      setIsError(false);  // Set to false for success modal
      setIsModalOpen(true);  // Open modal on success
      // Optionally, redirect to another page or clear the form
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setModalMessage(errorMessage);
      setIsError(true);  // Set to true for error modal
      setIsModalOpen(true);  // Open modal on error
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally reset the form or redirect after closing
  };

  return (
    <div className="mt-[-1] ml-60 font-mono dark:bg-blue-500">
    <div className="flex justify-center items-center min-h-screen">
    <form onSubmit={handleSubmit}>
    <div className="max-w-sm w-full rounded-lg shadow-lg bg-white p-6 space-y-6 border border-gray-200 dark:border-gray-700">
    <div className="space-y-2 text-center">
    <h1 className="text-3xl font-bold">Register</h1>
    <p className="mt-2 text-base text-gray-600">
    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
    </p>
    </div>
    <div className="space-y-4">
    <div className="flex space-x-4 items-center justify-center">
    <div className="space-y-2 items-center justify-center">
    <label className="text-sm font-medium leading-none" htmlFor="firstName">
    First Name
    </label>
    <input
    className="flex h-10 w-[130px] rounded-md border px-3 py-2 text-sm"
    type="text"
    id="firstName"
    name="firstName"
    value={Formdata.firstName}
    onChange={handleChange}
    placeholder="Manish"
    required
    />
    </div>
    <div className="space-y-2">
    <label className="text-sm font-medium leading-none" htmlFor="lastName">
    Last Name
    </label>
    <input
    className="flex h-10 w-[130px] rounded-md border px-3 py-2 text-sm"
    type="text"
    id="lastName"
    name="lastName"
    value={Formdata.lastName}
    onChange={handleChange}
    placeholder="Kumar"
    required
    />
    </div>
    </div>
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
    onChange={handleChange}
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
    onChange={handleChange}
    placeholder="Enter your password"
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
    onChange={handleChange}
    required
    >
    <option value="buyer">Customer</option>
    <option value="seller">Merchant</option>
    </select>
    </div>

    {Formdata.acctype === 'seller' && (
      <div className="space-y-2">
      <label className="text-sm font-medium leading-none" htmlFor="storeName">
      Store Name
      </label>
      <input
      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
      type="text"
      id="storeName"
      name="storeName"
      value={Formdata.storeName}
      onChange={handleChange}
      placeholder="Enter store name"
      required={Formdata.acctype === 'seller'}
      />
      </div>
    )}

    <div className="container mx-0 min-w-full flex flex-col items-center">
    <button className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl text-white hover:scale-105" type="submit">
    Register
    </button>
    </div>
    </div>
    </div>
    </form>
    </div>

    {/* Modal */}
    {IsModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-xl w-full mx-auto bg-gray-900 rounded-xl overflow-hidden">
      <div className="max-w-md mx-auto pt-12 pb-14 px-5 text-center">
      <h4 className="text-xl text-gray-100 font-semibold mb-5">
      {modalMessage}
      </h4>
      <p className="text-gray-300 font-medium">
      {isError ? "Please check your details and try again." : "Check Your Inbox!"}
      </p>
      </div>
      <div className="pt-5 pb-6 px-6 text-right bg-gray-800 -mb-2">
      <button
      onClick={closeModal}
      className="inline-block w-full sm:w-auto py-3 px-5 mb-2 mr-4 text-center font-semibold leading-6 text-gray-200 bg-gray-500 hover:bg-gray-400 rounded-lg transition duration-200"
      >
      Close
      </button>
      </div>
      </div>
      </div>
    )}
    </div>
  );
}

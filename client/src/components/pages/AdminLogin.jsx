import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext'
import { Link, useNavigate } from "react-router-dom";

  function AdminLogin() {
    const [formData,setFormData] = useState({
      email: '',
      password: ''
    })
      const { setUserdata } = useUser(); // Get setUserdata from context

    const navigate = useNavigate();
    async function handleSubmit (e)  {
      e.preventDefault();
      console.log("Form Submitted >>" ,formData)
      try{
        const response = await axios.post('http://127.0.0.1:7000/admin/login', formData);
        localStorage.setItem("token", response.data.token);
      setUserdata(response.data.user); // Update user data in context
      navigate('/dashboard');
        
      }catch(error){
        console.log(error.response.data);


      }
      // Handle form submission here (e.g., API call)
    };

    return (
      <div className="flex justify-center items-center h-screen bg-gray-300 dark:bg-lime-900">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="username"
                value={formData.email}
                onChange={(e) =>{setFormData({...formData, email: e.target.value})}}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" type="submit" onClick={handleSubmit}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default AdminLogin;
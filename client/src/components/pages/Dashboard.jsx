import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { jwtDecode } from 'jwt-decode'; // Corrected the import

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { userdata, setUserdata } = useUser(); // Get userdata from context
  const [arts, setArts] = useState([]); // State to store seller's arts
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (token) {
          const decodedData = jwtDecode(token); // Decode the JWT token
          setUserdata(decodedData.user); // Set userdata from token
          
          // Check if the user is a seller after setting the userdata
          if (decodedData.user.acctype === 'seller') {
            // Fetch seller arts
            const response = await axios.post(`http://127.0.0.1:7000/st/${decodedData.user._id}/arts`); // Adjusted API endpoint
            setArts(response.data);
          } else {
            // If not a seller, redirect to the home or another relevant page
            navigate('/');
          }
        } else {
          navigate('/login'); // If no token, redirect to login
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        navigate('/login'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [navigate, setUserdata]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="mt-4 mx-auto max-w-7xl p-4">
      {/* Seller Profile Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <img
            className="w-24 h-24 rounded-full object-cover"
            src={userdata?.profileImage || 'https://via.placeholder.com/150'}
            alt={`${userdata?.firstName}'s profile`}
          />
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userdata?.firstName}!</h1>
            <p className="text-sm text-gray-500">You are logged in as a {userdata?.acctype}.</p>
          </div>
        </div>
      </div>

      {/* Seller Art Upload Section */}
      {userdata?.acctype === 'seller' ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Arts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {arts.length > 0 ? (
              arts.map(art => (
                <div key={art._id} className="bg-white shadow-lg rounded-lg p-4">
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={art.image || 'https://via.placeholder.com/400'}
                    alt={art.title}
                  />
                  <h3 className="text-lg font-bold mt-2">{art.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Price: &#8377;{art.price}</p>
                  <p className="text-sm text-gray-600 mt-1">Category: {art.category}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">You haven't uploaded any art yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Arts</h2>
          <p className="text-gray-500">You are not a seller. Please log in as a seller to upload arts.</p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

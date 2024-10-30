import React, { useState, useEffect } from 'react';
import { jwtDecode }   from 'jwt-decode'; // Corrected import
import axios from 'axios';

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    mobileNo: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const decoded = jwtDecode(token);

  const setDefault = () => {
    setFormData({
      mobileNo: decoded.user.mobileNo || '',
      address: decoded.user.address || '',
      city: decoded.user.city || '',
      state: decoded.user.state || '',
      zipCode: decoded.user.zipCode || '',
      country: decoded.user.country || '',
      email: decoded.user.email || '',
      firstName: decoded.user.firstName || '',
      lastName: decoded.user.lastName || '',
      dateOfBirth: decoded.user.dateOfBirth || '',
    });
  };

  useEffect(() => {
    setDefault();
  }, []); // Ensure this runs once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
        const response = await axios.post('http://localhost:7000/update/update', {
                email:formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dateOfBirth,
                mobileno: formData.mobileNo, // Ensure property names match what the backend expects
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zipCode,
                country: formData.country,
            
        });

        if (response.status === 200) {
            setMessage('Information updated successfully!');
            // Optionally, you might want to refresh user data or handle the response further.
        }
    } catch (error) {
        setMessage('Failed to update information. Please try again.');
    } finally {
        setLoading(false);
    }
};

  // Fetch user data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:7000/retrieve/retrieve', {
          email: decoded.user.email,
          acctype: decoded.user.acctype,
        });

        if (response.data && response.data.users) {
          const userData = response.data.users;
          setFormData({
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            mobileNo: userData.mobileNo || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            zipCode: userData.zipCode || '',
            country: userData.country || '',
            dateOfBirth: userData.dateOfBirth || '',
          });
        }
      } catch (error) {
        setMessage('Failed to retrieve user data.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-[-1] flex justify-center items-center min-h-scree dark:bg-blue-500 bg-gray-100">
      <div className=" max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Account Settings</h2>
        {loadingData ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Email', type: 'email', name: 'email', placeholder: 'Enter your email' },
              { label: 'First Name', type: 'text', name: 'firstName', placeholder: 'Enter your first name' },
              { label: 'Last Name', type: 'text', name: 'lastName', placeholder: 'Enter your last name' },
              { label: 'Date of Birth', type: 'date', name: 'dateOfBirth' },
              { label: 'Mobile No', type: 'tel', name: 'mobileNo', placeholder: 'Enter your mobile number' },
              { label: 'Address', type: 'text', name: 'address', placeholder: 'Enter your address' },
              { label: 'City', type: 'text', name: 'city', placeholder: 'Enter your city' },
              { label: 'State', type: 'text', name: 'state', placeholder: 'Enter your state' },
              { label: 'Zip Code', type: 'text', name: 'zipCode', placeholder: 'Enter your zip code' },
              { label: 'Country', type: 'text', name: 'country', placeholder: 'Enter your country' },
            ].map(({ label, type, name, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Information'}
            </button>
          </form>
        )}
        {message && (
          <div className="mt-4 text-center text-gray-700 font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;

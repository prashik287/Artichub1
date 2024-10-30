import React, { useState } from 'react';
import axios from 'axios';

const BuyService = () => {
  const [formData, setFormData] = useState({
    itemId: '',      // ID of the item to purchase
    quantity: 1,     // Default quantity of the item
    paymentMethod: '', // Payment method, e.g., 'credit_card', 'paypal'
    address: '',     // Shipping address
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Send the purchase data to the server
      const response = await axios.post('http://127.0.0.1:7000/purchase', formData);
      
      // Check if the purchase was successful
      if (response.data.success) {
        setMessage('Purchase successful!');
      } else {
        setMessage('Failed to process purchase.');
      }
    } catch (error) {
      console.error('Failed to complete purchase:', error);
      setMessage('An error occurred while processing the purchase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="mt-4 max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Buy Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item ID */}
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
            <input
              type="text"
              id="itemId"
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              placeholder="Enter the item ID"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            >
              <option value="">Select a payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* Shipping Details */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your shipping address"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter your state"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Enter your zip code"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-gray-700 font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyService;

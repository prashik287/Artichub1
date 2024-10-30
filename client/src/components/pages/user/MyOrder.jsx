import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct default import

const MyOrder = () => {
  const [orders, setOrders] = useState([]); // Multiple orders, stored as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the token and decode it to get user ID
  const token = localStorage.getItem('token'); // Correctly get the token as a string key
  let userId;
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decode the token to extract the user info
      userId = decodedToken.user._id; // Adjust based on the structure of your token
    } catch (err) {
      console.error('Invalid token');
    }
  }

  // Fetch the orders of the buyer (logged-in user)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return; // If no userId, no need to fetch orders

      try {
        const response = await axios.get(`http://127.0.0.1:7000/o/${userId}/orders`);

        setOrders(response.data.orders || []); // Set orders array
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]); // Ensure userId is included in the effect's dependencies

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-red-500">{error}</div>;

  return (
    <div className="mt-[-1] ml-60 font-mono dark:bg-blue-500 h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-5">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600">No orders found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-md hover:shadow-2xl rounded-md p-4">
                <h2 className="font-semibold text-lg">Order ID: {order._id}</h2>
                <p className="text-sm text-gray-500">
                  Product: {order.productId || 'Product details not available'}
                </p>
                <p className="text-sm">Quantity: {order.quantity}</p>
                <p className="text-sm">Total Price: ₹{order.totalPrice}</p>
                <p className="text-sm">Payment Status: {order.paymentStatus}</p>
                <p className="text-sm text-gray-500">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/order/myorders/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
        });
        console.log(response.data[0]['id'])
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold">Order #{order.id} - {order.art.name}</h3>
            <p className="text-gray-600">Amount: ₹{order.amount}</p>
            
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-md mt-2 ${
                order.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status}
            </span>

            <p className="text-gray-500 text-sm mt-2">
              Ordered on: {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;

import React from "react";
import { Card, CardContent, Typography, IconButton, Divider, Avatar, Badge } from "@mui/material";
import { ShoppingCart, AttachMoney, Inventory, Notifications, Add } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Home = () => {
  const paymentData = [
    { label: "1-30 days", amount: 5000 },
    { label: "31-60 days", amount: 5500 },
    { label: "61-90 days", amount: 3500 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-[80%]">
      {/* Navbar */}
{/*      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
        <Typography variant="h6" className="font-semibold">
          Dashboard
        </Typography>
        <div className="flex items-center space-x-4">
          <Badge color="error" variant="dot">
            <Notifications className="text-gray-600" />
          </Badge>
          <IconButton className="bg-purple-600 text-white rounded-md">
            <Add />
            <span className="ml-2">Add New Product</span>
          </IconButton>
          <Avatar src="https://via.placeholder.com/40" />
        </div>
      </div>
*/}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatCard title="Total Orders" value="400" icon={<ShoppingCart />} trend="10% ↑" />
        <StatCard title="Total Sell" value="₹42.5L" icon={<AttachMoney />} trend="5% ↓" />
        <StatCard title="Total Products" value="452" icon={<Inventory />} trend="↑ 23" />
      </div>

      {/* Order Summary & Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <OrderSummary />
        <PaymentSummary data={paymentData} />
      </div>

      {/* Review Orders */}
      <ReviewOrders />
    </div>
  );
};

// Stats Card Component
const StatCard = ({ title, value, icon, trend }) => (
  <Card className="shadow-md">
    <CardContent className="flex justify-between items-center">
      <div>
        <Typography className="text-gray-600">{title}</Typography>
        <Typography variant="h5" className="font-bold">{value}</Typography>
        <Typography className="text-sm text-green-500">{trend}</Typography>
      </div>
      <div className="bg-purple-100 p-3 rounded-full text-purple-600">{icon}</div>
    </CardContent>
  </Card>
);

// Order Summary
const OrderSummary = () => (
  <Card className="shadow-md">
    <CardContent>
      <Typography variant="h6" className="mb-4">Order Summary</Typography>
      <ProgressBar label="Pending Orders" value={40} color="bg-yellow-500" />
      <ProgressBar label="Shipped Orders" value={30} color="bg-purple-500" />
      <ProgressBar label="Delivered Orders" value={30} color="bg-green-500" />
    </CardContent>
  </Card>
);

// Progress Bar Component
const ProgressBar = ({ label, value, color }) => (
  <div className="mb-3">
    <Typography className="text-sm">{label} ({value}%)</Typography>
    <div className="w-full bg-gray-300 rounded-full h-2">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

// Payment Summary
const PaymentSummary = ({ data }) => (
  <Card className="shadow-md">
    <CardContent>
      <Typography variant="h6">Payment Summary</Typography>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#9333ea" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Review Orders
const ReviewOrders = () => {
  const orders = [
    { date: "01/04/2024", product: "ZithroMax Antibiotic", location: "New York, USA", status: "In Transit", color: "blue" },
    { date: "02/04/2024", product: "Panadol Extra", location: "London, UK", status: "Pending", color: "yellow" },
    { date: "24/05/2024", product: "CiproCure 500mg", location: "Mumbai, India", status: "Delivered", color: "green" },
  ];

  return (
    <Card className="shadow-md mt-6">
      <CardContent>
        <Typography variant="h6">Review Orders</Typography>
        <Divider className="my-3" />
        {orders.map((order, index) => (
          <div key={index} className="flex justify-between items-center mb-3">
            <Typography className="text-sm">{order.date}</Typography>
            <Typography className="text-sm font-medium">{order.product}</Typography>
            <Typography className="text-sm">{order.location}</Typography>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${order.color}-100 text-${order.color}-600`}>
              {order.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Home;

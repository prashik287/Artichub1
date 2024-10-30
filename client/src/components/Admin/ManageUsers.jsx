import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [data, setData] = useState({
    buyers: [],
    eullers: [],
    sellers: [],
  });

  // Fetching data from API (replace with your API endpoint)
  useEffect(() => {
    axios.get("http://127.0.0.1:9000/api/test-data").then((response) => {
      // assuming API returns an object with buyers, eullers, sellers
      setData(response.data);
    });
  }, []);

  return (
    <div className="mt-[-1] ml-60 p-4">
       <div className="p-8 bg-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search"
          className="p-2 w-1/3 border border-gray-300 rounded"
        />
        <div className="flex space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded">Admin</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Euller</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Sellers</button>
        </div>
      </div>

      {/* Buyers, Eullers, Sellers Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Buyers Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Buyers</h2>
          {data.buyers.map((buyer, index) => (
            <div key={index} className="bg-white p-4 mb-2 rounded shadow">
              <img
                src={buyer.image}
                alt={buyer.name}
                className="w-12 h-12 rounded-full mb-2"
              />
              <h3 className="font-semibold">{buyer.name}</h3>
              <p className="text-gray-500">{buyer.role}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Eullers Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Eullers</h2>
          {data.eullers.map((euller, index) => (
            <div key={index} className="bg-white p-4 mb-2 rounded shadow">
              <img
                src={euller.image}
                alt={euller.name}
                className="w-12 h-12 rounded-full mb-2"
              />
              <h3 className="font-semibold">{euller.name}</h3>
              <p className="text-gray-500">{euller.role}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Sellers Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Sellers</h2>
          {data.sellers.map((seller, index) => (
            <div key={index} className="bg-white p-4 mb-2 rounded shadow">
              <img
                src={seller.image}
                alt={seller.name}
                className="w-12 h-12 rounded-full mb-2"
              />
              <h3 className="font-semibold">{seller.name}</h3>
              <p className="text-gray-500">{seller.role}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
   
  );
};

export default ManageUsers;

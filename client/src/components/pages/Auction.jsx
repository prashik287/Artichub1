import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading  from './Loading.jsx'
const Auction = () => {
  const [artItems, setArtItems] = useState([]);  // Art items available for auction
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const navigate = useNavigate();  // To navigate to the bidding page

  // Fetch art items available for auction
  useEffect(() => {
    const fetchArtItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:7000/api/auctions');
        setArtItems(response.data);
      } catch (error) {
        console.error('Error fetching auction items:', error);
        setError('Error fetching auction items.');
      } finally {
        setLoading(false);  // Stop loading once data is fetched or error occurs
      }
    };

    fetchArtItems();
  }, []);

  // Function to navigate to the bid page for a selected art item
  const handleBidClick = (artId) => {
    navigate(`/auction/${artId}`);  // Navigate to the bid page with the selected art item's ID
  };

  return (
    <div className="mt-[-1] ml-60 font-mono bg-blue-500 h-auto">
    <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Auction Page</h1>

    {/* Loading Animation */}
    {loading && (
      <div className="flex justify-center items-center">
        <Loading/>
      </div>
    )}

    {/* Error Message */}
    {error && (
      <p className="text-red-500 text-center">{error}</p>
    )}

    {/* Auction Item List */}
    {!loading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {artItems.length ? artItems.map((art) => (
        <div key={art._id} className="border p-4 rounded shadow-lg bg-white">
        <img src={art.image} alt={art.name} className="w-full h-40 object-cover mb-2" />
        <h2 className="text-xl font-semibold">{art.title}</h2>
        <p>{art.description}</p>
        <p><strong>Starting Price:</strong> ${art.price}</p>
        <button
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => handleBidClick(art._id)}  // Navigate on click
        >
        Place Bid
        </button>
        </div>
      )) : <p>No auction items available.</p>}
      </div>
    )}
    </div>
    </div>
  );
};

export default Auction;

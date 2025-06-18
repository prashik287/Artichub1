import React, { useEffect, useState } from "react";
import axios from "axios"; // Missing import

const Product = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error handling

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const token = localStorage.getItem('access-token');
        if (!token) {
          throw new Error("No access token found");
        }
        
        const response = await axios.get(
          'http://127.0.0.1:8000/api/product/seller/', 
          { 
            headers: { 
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json" 
            }
          }
        );
        console.log
        setArtworks(response.data); // Assuming the response contains the artworks data
      } catch (err) {
        setError(err.message);
        console.error("Error fetching artworks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8 ml-[-4] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-100 min-h-screen">
      {artworks.length > 0 ? (
        artworks.map((art, index) => (
          <div key={index} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-105">
            <img src={art.image} alt={art.title} className="w-full h-60 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold">{art.title}</h2>
              <p className="text-gray-600 text-sm">Year: {art.yearCreation}</p>
              <p className="text-gray-600 text-sm">Condition: {art.condition}</p>
              <p className="text-gray-600 text-sm">Period: {art.period}</p>
              <p className="text-gray-600 text-sm">Category: {art.category}</p>
              <p className="text-gray-600 text-sm">Signed: {art.signed ? "Yes" : "No"}</p>
              <p className="text-gray-800 font-semibold mt-2">Price: ₹{art.price}</p>
              <p className="text-gray-500 text-sm">
                Sale Type: {art.saleType === "sell" ? "Direct Sale" : "Auction"}
              </p>
              {art.saleType === "auction" && (
                <>
                  <p className="text-sm text-blue-500">
                    Auction Start: {new Date(art.auctionStartDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-red-500">
                    Auction End: {new Date(art.auctionEndDate).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          No artworks found
        </div>
      )}
    </div>
  );
};

export default Product;
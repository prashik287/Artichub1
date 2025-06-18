// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Home1() {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Navigate to Product Details Page
//   const redir = (productId) => {
//     if (!productId) {
//       console.error("Product ID is undefined or invalid.");
//       return;
//     }
//     console.log(`Navigating to /product/${productId}`);
//     navigate(`/product/${productId}`);
//   };

//   // Fetch product data from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/product/sale/"
//         );
//         console.log("API Response:", response.data);
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch products. Please try again later.");
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className="bg-white p-8 h-screen overflow-auto">
//       {/* Show Error if API Fails */}
//       {error && <div className="text-red-500">{error}</div>}

//       {/* Display Product Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <div
//               key={product.id || product.productId || product._id} // Use fallback if key changes
//               className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-200"
//             >
//               {/* Product Image */}
//               <div className="relative w-full h-64 overflow-hidden rounded-lg">
//                 <img
//                   src={product.image || "https://via.placeholder.com/200"}
//                   alt={product.title || "No title"}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Product Details */}
//               <div className="mt-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   {product.title?.length > 25
//                     ? `${product.title.slice(0, 25)}...`
//                     : product.title}
//                 </h2>
//                 <p className="text-gray-600 mt-1">
//                   {product.condition?.length > 50
//                     ? `${product.condition.slice(0, 50)}...`
//                     : product.condition}
//                 </p>
//                 <p className="text-lg font-semibold text-green-600 mt-2">
//                   ₹{parseFloat(product.price).toLocaleString()}
//                 </p>

//                 {/* Auction Info */}
//                 {product.saleType === "auction" && (
//                   <p className="text-sm text-red-500 mt-1">
//                     Auction:{" "}
//                     {product.auctionStartDate
//                       ? new Date(product.auctionStartDate).toDateString()
//                       : "N/A"}{" "}
//                     -{" "}
//                     {product.auctionEndDate
//                       ? new Date(product.auctionEndDate).toDateString()
//                       : "N/A"}
//                   </p>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-between items-center mt-4">
//               <div className="bg-blue-400 p-4 rounded-lg">
//               <button
//                   onClick={() => redir(product.id)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
//                 >
//                   Buy Now 🛒
//                 </button>
//               </div>

//                 <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
//                   Add to Cart 🛍️
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 col-span-4">
//             No products available.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home1;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home1() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Navigate to Product Details Page
  const redir = (productId) => {
    if (!productId) {
      console.error("Product ID is undefined or invalid.");
      return;
    }
    console.log(`Navigating to /product/${productId}`);
    navigate(`/product/${productId}`);
  };

  // Fetch product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/product/sale/");
        console.log("API Response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  // Function to generate watermarked image URLs
  const getWatermarkedImage = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/200";

    if (imageUrl.includes("githubusercontent")) {
      return `https://imgproxy.yourserver.com/insecure/l_watermark,w_100,o_50/plain/${imageUrl}`;
    } else if (imageUrl.includes("cloudinary.com")) {
      return `https://res.cloudinary.com/demo/image/fetch/l_watermark,w_100,o_50/${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div className="bg-white p-8 h-screen overflow-auto">
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id || product.productId || product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-200"
            >
              <div className="relative w-full h-64 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.title || "No title"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {product.title?.length > 25
                    ? `${product.title.slice(0, 25)}...`
                    : product.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {product.condition?.length > 50
                    ? `${product.condition.slice(0, 50)}...`
                    : product.condition}
                </p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  ₹{parseFloat(product.price).toLocaleString()}
                </p>

                {product.saleType === "auction" && (
                  <p className="text-sm text-red-500 mt-1">
                    Auction: {product.auctionStartDate ? new Date(product.auctionStartDate).toDateString() : "N/A"} - {product.auctionEndDate ? new Date(product.auctionEndDate).toDateString() : "N/A"}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="bg-blue-400 p-4 rounded-lg">
                  <button
                    onClick={() => redir(product.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Buy Now 🛒
                  </button>
                </div>

                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
                  Add to Cart 🛍️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-4">No products available.</div>
        )}
      </div>
    </div>
  );
}

export default Home1;

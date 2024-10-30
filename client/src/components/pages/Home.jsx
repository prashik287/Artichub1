import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading.jsx'
const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState({}); // Track loading status for each image
  const [isDataLoading, setIsDataLoading] = useState(true); // Track overall data loading state
  const location = useLocation();

  useEffect(() => {
    axios
    .get('http://127.0.0.1:7000/api/art-data')
    .then((response) => {
      setProducts(response.data);
      setFilteredProducts(response.data); // Initialize filteredProducts with all products
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    })
    .finally(() => {
      setIsDataLoading(false); // Stop loading once data is fetched
    });
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('search'); // Get search term from URL
    if (query) {
      const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Show all products if no search term
    }
  }, [location.search, products]);

  // Handle when the image is loaded
  const handleImageLoad = (productId) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [productId]: false, // Mark the image as loaded
    }));
  };

  // Handle when the image starts loading
  const handleImageStartLoad = (productId) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [productId]: true, // Mark the image as loading
    }));
  };

  return (
    <div className='mt-[-1] ml-60 font-mono'>
    <div className="h-auto w-full dark:bg-blue-500 bg-gray-100">
    <div className="container mx-auto p-4">
    <h1 className="text-4xl font-bold text-center mb-8">Welcome to ArticHub</h1>

    {/* Full-page loading animation */}
    {isDataLoading ? (
      <div className="flex justify-center items-center min-h-screen">
          <Loading/>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProducts.map((product) => (
        <Link to={`/product/${product._id}`} state={{ product }} key={product._id}>
        <div
        className={`border rounded-lg shadow-md p-4 bg-white ${
          loading[product._id] ? 'animate-pulse' : ''
        }`}
        >
        {/* Display loading animation or image */}
        {loading[product._id] ? (
          <div className="w-full h-60 bg-gray-300 flex items-center justify-center rounded-md">
              <Loading/>
          </div>
        ) : (
          <img
          src={product.image}
          alt={product.title}
          className="w-full h-60 object-cover rounded-md mb-4"
          onLoad={() => handleImageLoad(product._id)}
          onError={() => handleImageLoad(product._id)} // Handle image load error
          onLoadStart={() => handleImageStartLoad(product._id)} // Ensure the loading animation starts
          />
        )}
        <h2 className="text-lg font-bold mb-2">{product.title}</h2>

        <div className="flex justify-between items-center">
        <span className="text-orange-500 text-xl">
        {product.Quantity > 0 ? `₹${product.price}` : 'Sold Out'}
        </span>
        <button className="px-2 py-1 bg-gray-200 rounded-full" disabled={product.Quantity === 0}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
        >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        </button>
        </div>
        </div>
        </Link>
      ))}
      </div>
    )}
    </div>
    </div>
    </div>
  );
};

export default Home;

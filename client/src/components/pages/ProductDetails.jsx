import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(location.state?.product || null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' }); 
  const [loading, setLoading] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) {
        try {
          const response = await axios.get(`http://127.0.0.1:7000/api/art-data/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    
    fetchProduct();
  }, [id, product]);

  // Fetch seller data
  useEffect(() => {
    const fetchSeller = async () => {
      if (product?.seller) {
        try {
          const sellerResponse = await axios.get(`http://127.0.0.1:7000/seller/seller/${product.seller}`);
          setSeller(sellerResponse.data);
        } catch (error) {
          console.error('Error fetching seller:', error);
        }
      }
    };

    fetchSeller();
  }, [product]);
  // Fetch product reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewResponse = await axios.get(`http://127.0.0.1:7000/reviewer/reviews/${id}`);
        setReviews(reviewResponse.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  // Handle new review input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login'); 
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const reviewData = {
        ...newReview,
        email: decoded.user.email,
      };
      
      const response = await axios.post(`http://127.0.0.1:7000/reviewer/reviews/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setReviews(prevReviews => [...prevReviews, response.data.review]); // Add the new review
        setNewReview({ rating: 1, comment: '' }); // Reset form
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Navigate to checkout
  const toggleBuyForm = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/checkout/${id}`, {
        state: { product },
      });
    }
  };

  return (
    <div className="mt-[-1] ml-60 font-mono">
  <div className="bg-gray-50 min-h-screen font-sans dark:bg-blue-500">
    <div className="container mx-auto p-6">
      {/* Product Image and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6">
        {/* Product Image */}
        <div>
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-auto object-cover rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product?.title}</h1>

          {seller && (
            <>
              <p className="text-xl mb-2 text-gray-600">
                Artist: <span className="font-semibold text-gray-800">{seller.firstName} {seller.lastName}</span>
              </p>
              <p className="text-xl mb-4 text-gray-600">
                Store: <span className="font-semibold text-gray-800">{seller.storeName}</span>
              </p>
            </>
          )}


          <p className="text-lg mb-4 text-gray-600">
          <span className="font-semibold text-gray-800">Quantity:</span>{product?.Quantity}
          </p>
          <p className="text-lg mb-4 text-gray-600">
          <span className="font-semibold text-gray-800"> Category:</span> {product?.category}
          </p>
          <p className="text-lg mb-4 text-gray-600">
          <span className="font-semibold text-gray-800">Description:</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {product?.signed} <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className='text-gray-500 font-bold'> Period:</span> {product?.period} <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className='text-gray-500 font-bold'> Creation Year:</span> {product?.yearCreation} <br />


          {product.condition}</p>
          <div className="text-2xl text-orange-600 font-bold mb-4">₹{product?.price}</div>

          <button
            onClick={toggleBuyForm}
            className="w-full py-2 bg-orange-500 text-white rounded-lg transition duration-300 hover:bg-orange-600"
            disabled={product?.Quantity === 0}
          >
            {product?.Quantity > 0 ? 'Buy Now' : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reviews</h2>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-300 transition duration-200 hover:shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-gray-800">{review.buyer}</p>
                  <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Add a new review form */}
        <form onSubmit={handleSubmitReview} className="mt-6 p-4 bg-gray-50 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Add a Review</h3>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-md font-semibold text-gray-700">Rating</label>
            <select
              id="rating"
              name="rating"
              value={newReview.rating}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-400"
              required
            >
              <option value="" disabled>Select rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>{rating}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-md font-semibold text-gray-700">Comment</label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-400"
              rows="4"
              placeholder="Write your review here"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg transition duration-300 hover:bg-blue-700">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductDetails;

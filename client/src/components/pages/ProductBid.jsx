import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const socket = io('http://127.0.0.1:7000');

const ProductBid = () => {
  const { id } = useParams();
  const [ArtItem, setArtItem] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [error, setError] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [seller, setseller] = useState(null);
  const [store, setStore] = useState(null);
  const [startprice , setstartprice] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(true); // New loading state for seller

  useEffect(() => {
    const fetchArtItem = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:7000/api/auction/${id}`);
        setArtItem(response.data);
        setBidAmount(response.data.highestBid ? response.data.highestBid.amount + 1 : response.data.startingPrice);
        setstartprice(response.data.price)

        // Fetch seller data after ArtItem is set
        fetchSellerData(response.data.seller);
      } catch (error) {
        console.error('Error fetching auction item:', error);
        setError('Error fetching auction item.');
      }
    };

    const fetchSellerData = async (sellerId) => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        try {
          const response = await axios.get(`http://127.0.0.1:7000/seller/seller/${sellerId}`);
          console.log(response.data);
          setseller(response.data); // Set seller name
          setStore(response.data.store);
          setLoadingSeller(false); // Set loading to false after fetching seller
          console.log(decoded);
        } catch (error) {
          console.error('Error fetching seller data:', error);
          setError('Error fetching seller data.');
          setLoadingSeller(false); // Set loading to false even on error
        }
      } else {
        setLoadingSeller(false); // No token, set loading to false
      }
    };

    fetchArtItem(); // Fetch art item

    socket.on(`bidUpdate-${id}`, (newBid) => {
      setArtItem((prevArt) => ({
        ...prevArt,
        highestBid: { amount: newBid.bidAmount, bidder: newBid.bidder },
      }));
      setBidAmount(newBid.bidAmount + 1);
    });

    socket.on('startPayment', (data) => {
      if (data.artId === id) {
        handlePayment(data.paymentOrderId, data.bidAmount);
      }
    });

    return () => {
      socket.off(`bidUpdate-${id}`);
    };
  }, [id]);

  const placeBid = async () => {
    if (!ArtItem || bidAmount <= (ArtItem.highestBid ? ArtItem.highestBid.amount : ArtItem.startingPrice)) {
      setError('Bid must be higher than the current bid.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const email = decoded.user._id;

      socket.emit('placeBid', {
        artId: ArtItem._id,
        bidAmount,
        bidder: email,
      });

      setError(null);

      // Clear any previous timer
      if (timerId) {
        clearTimeout(timerId);
      }

      // Set a new timer for 30 seconds
      const newTimerId = setTimeout(() => {
        handlePayment(ArtItem.highestBid ? ArtItem.highestBid.amount * 100 : bidAmount * 100, bidAmount);
      }, 30000);

      setTimerId(newTimerId); // Store the timer ID

    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Error placing bid.');
    }
  };

  const handlePayment = async (orderId, bidAmount) => {
    const options = {
      key: process.env.RAZOR_KEY,
      amount: bidAmount * 100,
      currency: 'INR',
      name: 'ArticHub',
      description: 'Auction Payment',
      order_id: orderId,
      handler: async (response) => {
        socket.emit('paymentSuccess', {
          artId: id,
          paymentOrderId: orderId,
        });
        alert('Payment successful!');

        // Optionally, fetch the updated art item to check if sold out
        const updatedArtItem = await axios.get(`http://127.0.0.1:7000/api/auction/${id}`);
        if (updatedArtItem.data.Quantity === 0) {
          setArtItem((prevArt) => ({
            ...prevArt,
            Quantity: 0,
          }));
        }
      },
      prefill: {
        name: 'Bidder',
        email: 'bidder@example.com',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (!ArtItem) return <p className="text-white">Loading...</p>;

  if (loadingSeller) return <p className="text-white">Loading seller data...</p>; // Show loading for seller

  if (ArtItem.Quantity === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-blue-500 p-6">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{ArtItem.title}</h2>
      <p className="text-xl text-red-600 mb-2">This item has been sold out.</p>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-blue-500 p-6 ">
    <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900">
    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{ArtItem.title}</h2>
    <p className="text-xl text-gray-600 mb-2">
    Starting price: <span className="font-semibold text-blue-600">{startprice} INR</span>
    </p>
    <p className="text-xl text-gray-600 mb-2">
    Current highest bid: <span className="font-semibold text-blue-600">{ArtItem.highestBid ? ArtItem.highestBid.amount : ArtItem.price} INR</span>
    </p>

    {/* Display the product image */}
    {ArtItem.image && (
      <img
      src={ArtItem.image}
      alt={ArtItem.title}
      className="w-full h-auto rounded-lg shadow-md mb-4"
      />
    )}

    <div className='pt-4'>
    <h3 className="text-lg  text-white font-semibold mb-2">Description:</h3>
    <p className='text-white'>{ArtItem.condition}</p><br/ >
    <div className="flex items-center justify-between mb-4 text-white">
    <div className="flex items-center space-x-2">
    <p className="text-gray-700 dark:text-white font-medium">Seller: {seller ? seller.firstName: 'Loading...'}</p>
    </div>
    </div>
    </div>

    <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="bidAmount">Your Bid:</label>
    <input
    type="number"
    id="bidAmount"
    value={bidAmount}
    onChange={(e) => setBidAmount(Number(e.target.value))}
    className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 w-full"
    placeholder="Enter your bid amount"
    />

    <button
    onClick={placeBid}
    className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
    >
    Place Bid
    </button>

    {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
    </div>
  );
};

export default ProductBid;

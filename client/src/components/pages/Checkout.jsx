import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure correct import

const Checkout = () => {
  const { state } = useLocation();
  const { product, quantity } = state || {}; // Ensure fallback to avoid errors
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return null;
  }

  let user;
  try {
    user = jwtDecode(token).user; // Wrap in try-catch
  } catch (error) {
    console.error('Token decoding error:', error);
    navigate('/login'); // Redirect if token is invalid
    return null;
  }

  const totalAmount = product ? (product.price * quantity).toFixed(2) : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { address, city, state, zipCode } = formData;
    if (!address || !city || !state || !zipCode) {
      setMessage('Please fill all the required fields.');
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) {
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
        setMessage('Failed to load payment gateway.');
        return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log(user._id)
        const response = await axios.post('http://127.0.0.1:7000/buy/checkout', {
            productId: product._id,
            userId: user._id,
            quantity:1,
            paymentMethod: 'Razorpay',
            ...formData,
        });

        const order = response.data;
        console.log('Order ID:', order.OrderId);
        console.log('Razorpay Order:', order.orderId);

        const options = {
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            name: 'ArtisticHub',
            description: `Order for ${product.name}`,
            image: '/your_logo.png',
            order_id: order.orderId,
            handler: async (response) => {
                try {
                    const result = await axios.post('http://127.0.0.1:7000/buy/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        order_id: order.OrderId
                    });

                    if (result.data.success) {
                        setMessage('Payment successful!');
                        setTimeout(() => navigate('/'), 2000);
                    } else {
                        setMessage('Payment verification failed.');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    setMessage('An error occurred during payment verification.');
                }
            },
            prefill: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                contact: user.phone || '9999999999',
            },
            theme: { color: '#F37254' },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.log('Error during payment initiation:', error);
        setMessage('An error occurred during payment initiation.');
    } finally {
        setLoading(false);
    }
  };

  const states = [
    { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] },
    { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belgaum'] },
    { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
    { name: 'West Bengal', cities: ['Kolkata', 'Siliguri', 'Durgapur', 'Asansol', 'Howrah'] },
    // Add remaining states and cities here...
  ];

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: '' });
  };

  const selectedState = states.find((state) => state.name === formData.state);
  const cities = selectedState ? selectedState.cities : [];

  if (!product) {
    return <div>No product data available.</div>;
  }

  return (
    <div className="mt-10 ml-60 font-mono min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>

        <div className="mb-4">
          <h2 className="text-2xl">{product.name}</h2>
          <img src={product.image} alt={product.name} className="w-48 h-auto mb-4" />
          <p>Artist: {product.artist}</p>
          <p>Price: ₹{product.price}</p>
          <p>Quantity: {quantity}</p>
          <p>Total Amount: ₹{totalAmount}</p>
        </div>

        {/* Checkout Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                required
              >
                <option value="" disabled>Select your city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                className="w-full border px-3 py-2 rounded-lg"
                required
              >
                <option value="" disabled>Select your state</option>
                {states.map((state) => (
                  <option key={state.name} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Enter your zip code"
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                readOnly
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRazorpayPayment}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </form>

        {message && <div className="mt-4 text-red-600">{message}</div>}
      </div>
    </div>
  );
};

export default Checkout;

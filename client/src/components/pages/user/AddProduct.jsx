import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './file-upload.css';
import { jwtDecode } from 'jwt-decode';

const categories = ['Painting', 'Sculpture', 'Photography', 'Digital Art'];

const ProductForm = () => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        Quantity: '',
        price: '',
        category: categories[0],
        image: '',
        saleType: 'sell',
        auctionStartDate: '',
        auctionEndDate: '',
        sellerId: ''
    });

    const [modalMessage, setModalMessage] = useState(''); // Modal message state
    const [showModal, setShowModal] = useState(false); // To control modal visibility

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setProductData((prevState) => ({
                ...prevState,
                sellerId: decoded.user._id
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductData({ ...productData, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', productData.image);
        formData.append('upload_preset', 'artichub'); // Replace with your Cloudinary upload preset

        try {
            // Upload image to Cloudinary
            const uploadResponse = await axios.post('https://api.cloudinary.com/v1_1/dvo3jxlku/image/upload', formData);
            const imageUrl = uploadResponse.data.secure_url;

            // Send product data to your backend
            const response = await axios.post('http://127.0.0.1:7000/product/add', {
                ...productData,
                image: imageUrl
            });
            setModalMessage('Product listed successfully!');
        } catch (error) {
            setModalMessage('Failed to list the product. Please try again.');
        }
        setShowModal(true); // Show the modal after the response
    };

    const closeModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-center mb-5">Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="Quantity">Quantity</label>
                    <input
                        type="number"
                        name="Quantity"
                        min="1"
                        value={productData.Quantity}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        min="1"
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
                    <select
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label className="block text-gray-700 mb-2" htmlFor="image">Upload Image</label>
                    <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Sale Type</label>
                    <div className="flex items-center">
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="saleType"
                                value="sell"
                                checked={productData.saleType === 'sell'}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            Direct Sell
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="saleType"
                                value="auction"
                                checked={productData.saleType === 'auction'}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            Auction
                        </label>
                    </div>
                </div>

                {productData.saleType === 'auction' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="auctionStartDate">Auction Start Date</label>
                            <input
                                type="datetime-local"
                                name="auctionStartDate"
                                value={productData.auctionStartDate}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="auctionEndDate">Auction End Date</label>
                            <input
                                type="datetime-local"
                                name="auctionEndDate"
                                value={productData.auctionEndDate}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Submit Product
                </button>
            </form>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Status</h2>
                        <p>{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;

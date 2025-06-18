import axios from 'axios';
import React, { useState } from 'react';

function CreateProduct() {
  const [formData, setFormData] = useState({
    title: '',
    yearCreation: '',
    signed: false,
    condition: '',
    period: 'Contemporary',
    category: 'Abstract',
    t2ype: 'Painting', // New field
    image: null,
    quantity: 1,
    saleType: 'fixed',
    auctionStartDate: '',
    auctionEndDate: '',
    price: '',
    bids: 0,
    highestBid: 0
  });

  const periods = ['Contemporary', 'Post-War', '19th Century', 'Modern'];
  const categories = [
    'Post-Minimalism', 'Abstract Expressionism', 'Abstract', 'Baroque',
    'Minimalism', 'Surrealism', 'Realism', 'Post-Impressionism',
    'Magic Realism', 'Impressionism', 'Modernism', 'Conceptual',
    'Neo-Expressionism', 'Expressionism', 'Nouveau Réalisme', 'Pop Art',
    'Neogeo', 'Social Realism', 'Street Art', 'Photorealism',
    'Environmental Art', 'Cubism', 'Geometric Abstraction', 'Art Nouveau',
    'Romanticism', 'Traditional', 'Organic/Biomorphic Abstraction',
    'Feminist Art', 'Performance Art', 'Art Brut', 'Punk', 'Art Deco', 'Painting'
  ];
  
  // New art types array
  const t2ypes = ['Painting', 'Sculpture', 'Photography', 'Digital'];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access-token');
      const formDataToSend = new FormData();
      console.log(formData)
      const response = await axios.post('http://127.0.0.1:8000/api/product/add/',{condition:formData.condition,price:formData.price,title:formData.title,yearCreation:formData.yearCreation},{headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }})
      // ... (keep existing axios post call the same)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="relative bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 h-[100%]">
    <div className="max-w-3xl mx-auto h-full">
      <div className="bg-white shadow-xl rounded-lg overflow-y-auto h-full"> {/* Added overflow-y-auto and h-full */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Art Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
  
  
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input 
                  type="file" 
                  id="image"
                  name="image" 
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
                <label htmlFor="image" className="cursor-pointer">
                  {formData.image ? (
                    <img 
                      src={URL.createObjectURL(formData.image)} 
                      alt="Preview" 
                      className="mx-auto h-48 object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Click to upload artwork image</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className='text-black'>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className='text-black'>
                  <label htmlFor="yearCreation" className="block text-sm font-medium text-gray-700">Year of Creation*</label>
                  <input
                    type="number"
                    id="yearCreation"
                    name="yearCreation"
                    value={formData.yearCreation}
                    onChange={handleChange}
                    min="1000"
                    max={new Date().getFullYear()}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                {/* New Art Type Field */}
                <div className='text-black'>
                  <label htmlFor="t2ype" className="block text-sm font-medium text-gray-700">Art Type*</label>
                  <select
                    id="t2ype"
                    name="t2ype"
                    value={formData.t2ype}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {t2ypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className='text-black'>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period*</label>
                  <select
                    id="period"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {periods.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>

                <div className='text-black'>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category*</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className='text-black'>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition*</label>
                  <input
                    type="text"
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="signed"
                    name="signed"
                    checked={formData.signed}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="signed" className="ml-2 block text-sm text-gray-700">Signed by artist</label>
                </div>
              </div>

              {/* Sale Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sale Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="saleType" className="block text-sm font-medium text-gray-700">Sale Type*</label>
                    <select
                      id="saleType"
                      name="saleType"
                      value={formData.saleType}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="auction">Auction</option>
                    </select>
                  </div>

                  {formData.saleType === 'fixed' ? (
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price*</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="auctionStartDate" className="block text-sm font-medium text-gray-700">Auction Start Date*</label>
                        <input
                          type="datetime-local"
                          id="auctionStartDate"
                          name="auctionStartDate"
                          value={formData.auctionStartDate}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="auctionEndDate" className="block text-sm font-medium text-gray-700">Auction End Date*</label>
                        <input
                          type="datetime-local"
                          id="auctionEndDate"
                          name="auctionEndDate"
                          value={formData.auctionEndDate}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity*</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 p-6">

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Art Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateProduct;
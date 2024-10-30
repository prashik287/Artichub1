import React, { useState } from 'react';
import axios from 'axios';
import illust from './images/4898275.jpg';

const CustomerCareForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Submitting:", formData); // Log the data being submitted

        // Ensure all fields are filled before submission
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            console.error("All fields must be filled");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:7000/feed/feedback", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            // Optionally, show an error message to the user
        }
    }

    return (
        <div className="ml-60 flex flex-col md:flex-row items-center justify-center min-h-screen dark:bg-blue-500 bg-gray-100">
            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-lg p-8 m-8 md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Care</h2>
                <p className="text-gray-600 mb-4">How can our customers receive assistance?</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                    type="email"
                    id="email"
                    name="email"  // Added name attribute
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Select a subject</option>
                            <option value="message">For the message</option>
                            <option value="question">A general inquiry?</option>
                            <option value="bug">Report a bug</option>

                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                        Submit
                    </button>
                </form>

                {/* Contact Details Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Details</h3>
                    <div className="space-y-2">
                        <p className="text-gray-600">prashikjadhav17@gmail.com</p>
                        <p className="text-gray-600">Prashik Jadhav</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Phone Numbers</h3>
                    <div className="space-y-2">
                        <p className="text-gray-600">+917738216810</p>
                        {/* <p className="text-gray-600">281-CNHSAOSI</p> */}
                    </div>
                </div>

                <div className="mt-8 bg-gray-100 rounded-md p-4">
                    <h3 className="text-lg font-medium text-gray-800">FREQUENTLY ASKED QUESTIONS</h3>
                    {/* Add your FAQ content here */}
                </div>
            </div>

            {/* Illustration */}
            <div className="hidden md:block md:w-1/2">
                <img src={illust} alt="Customer Support Illustration" />
            </div>
        </div>
    );
};

export default CustomerCareForm;

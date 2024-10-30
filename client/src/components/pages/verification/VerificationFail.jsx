import React, { useState } from 'react';
import axios from 'axios';

const VerificationFail = () => {
  const [Formdata, setFormdata] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Submit");
    try {
      // Sending the Formdata directly as JSON
      const response = await axios.post("http://127.0.0.1:9000/feed/feedback", Formdata);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="mt-[-1] mx-auto font-mono">
      <div className="flex justify-center items-center min-h-screen dark:bg-lime-900">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-center mb-8">
            We’d love to hear from you! Please fill out the form below.
          </p>
          <div className='flex'>
            <div className='w-75 border border-gray-500 p-4'>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"  // Added name attribute
                    value={Formdata.name}
                    onChange={(e) => setFormdata({ ...Formdata, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"  // Added name attribute
                    value={Formdata.email}
                    onChange={(e) => setFormdata({ ...Formdata, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"  // Added name attribute
                    value={Formdata.subject}
                    onChange={(e) => setFormdata({ ...Formdata, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"  // Added name attribute
                    value={Formdata.message}
                    onChange={(e) => setFormdata({ ...Formdata, message: e.target.value })}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className='ml-10 w-2/3 border border-gray-500 rounded-lg p-4'>
              <h3 className="text-lg font-bold text-gray-800">Contact Information</h3>
              <p className="text-gray-600 mt-4">Email Address:</p>
              <p className="text-gray-800 font-semibold">support@artichub.com</p>
              <p className="text-gray-600 mt-4">Phone Number:</p>
              <p className="text-gray-800 font-semibold">+1 (234) 567-8901</p>
              <p className="text-gray-600 mt-4">Address:</p>
              <p className="text-gray-800 font-semibold">123 Art Street, Creativity City, CA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationFail;

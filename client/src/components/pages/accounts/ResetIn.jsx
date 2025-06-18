import axios from 'axios';
import React, { useState } from 'react';

function ResetIn() {
    const [userdata, setUserdata] = useState({
        email: ""
    });
    const [resp,setresp] = useState(null)

    const sendlnk = async (e) => {
        e.preventDefault();
        console.log(userdata);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/password-reset/', {
                email: userdata.email,
            });
            console.log(response);
            setresp(response)
        } catch (error) {
            console.error("Error sending reset link:", error);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-br w-[80%] h-[80%] from-gray-100 to-blue-100 rounded-lg relative">
            <div className="text-blue-500 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">Forgot Password?</h1>
                    <p className="text-gray-600 mt-2">Enter your email to receive a reset link.</p>
                </div>
                <form onSubmit={sendlnk} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={userdata.email}
                            onChange={(e) => setUserdata({ ...userdata, email: e.target.value })}
                            className="mt-1 block w-full p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 text-gray-700"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </form>
            </div>

            {/* Fixed overlay */}
        
                    {/* <div className="absolute top-70 left-80 w-[40%] h-[20%] bg-gray-300 bg-opacity-80 flex items-center justify-center z-20 border rounded-4xl">
                    <p className="text-lg font-bold text-blue-900">Hellp</p>
                </div> */}
        
        </div>
    );
}

export default ResetIn;

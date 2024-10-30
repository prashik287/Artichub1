import React from 'react';
import { Link } from 'react-router-dom';

const ListingManager = () => {
    return (
        <div className=" mt-[-1] ml-60 flex flex-col md:flex-row justify-around p-5 dark:bg-blue-500 min-h-screen ">
            {/* Add Product Card */}
            <div className="bg-white shadow-lg rounded-lg p-5 w-full md:w-1/3 m-2 flex flex-col justify-center items-center h-full">
    <h2 className="text-xl font-bold mb-4 text-center">Add Product to Listing</h2>
    <form className="flex flex-col items-center">
        <Link to="/newproduct">
        <button 
            type="submit" 
            className="bg-blue-500 text-white rounded p-2 w-full text-center"
        >
            Add Product
        </button>
        </Link>
    </form>
</div>


            {/* Modify Listing Card */}
            <div className="bg-white shadow-lg rounded-lg p-5 w-full md:w-1/3 m-2 flex flex-col justify-center items-center h-full">
    <h2 className="text-xl font-bold mb-4 text-center">Modify Listing</h2>
    <form className="flex flex-col items-center">
        <button 
            type="submit" 
            className="bg-blue-500 text-white rounded p-2 w-full text-center"
        >
            Modify 
        </button>
    </form>
</div>

            {/* Delete Listing Card */}
            <div className="bg-white shadow-lg rounded-lg p-5 w-full md:w-1/3 m-2 flex flex-col justify-center items-center h-full">
    <h2 className="text-xl font-bold mb-4 text-center">Delete a Listing</h2>
    <form className="flex flex-col items-center">
        <button 
            type="submit" 
            className="bg-blue-500 text-white rounded p-2 w-full text-center"
        >
            Delete
        </button>
    </form>
</div><br /><br />
<div className="bg-white shadow-lg rounded-lg p-5 w-full md:w-1/3 m-2 flex flex-col justify-center items-center h-full">
    <h2 className="text-xl font-bold mb-4 text-center">View Listing</h2>
    <form className="flex flex-col items-center">
       <Link to="/dashboard"> <button
            type="submit" 
            className="bg-blue-500 text-white rounded p-2 w-full text-center"
        >
            View
        </button>
        </Link>
    </form>
</div>
        </div>
    );
};

export default ListingManager;

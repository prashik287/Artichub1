import React, { useState, useEffect } from 'react';

import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";

import { CiSearch } from "react-icons/ci";

import { Link, useNavigate } from 'react-router-dom';

import { useUser  } from '../UserContext'; // Adjust path as necessary

import { FaShoppingCart } from "react-icons/fa";

import { jwtDecode } from 'jwt-decode';


const Navbar = () => {

  const [dark, setDark] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const { userdata, setUserdata } = useUser ();

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [IsAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  const token = localStorage.getItem("token");

  useEffect(() => {


    if (token) {

      const decodedData = jwtDecode(token);

      setUserdata(decodedData);

      setIsLoggedIn(true);

      console.log(decodedData.user.email);

    }

  }, [token]);


  useEffect(() => {

    if (userdata && userdata.acctype === 'admin') {

      setIsAdmin(true);

    } else {

      setIsAdmin(false);

    }

  }, [userdata]);


  const logout = () => {

    localStorage.removeItem("token");

    setUserdata(null);

    setIsLoggedIn(false);

    navigate('/login');

  };


  const darkModeHandle = () => {

    setDark(!dark);

    document.body.classList.toggle("dark");

  };


  const handleSearch = () => {

    navigate(`/` + `?search=${searchTerm}`); // Navigate to home with search term

    setSearchTerm(''); // Clear the search input after submitting

  };

  return (
    <nav className="bg-gray-400 py-4 dark:bg-gray-800 dark:text-white font-mono font-semibold sticky top-0 z-40 shadow-md">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center ml-10">
   
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="block lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl focus:outline-none">☰</button>
        </div>

        {/* Links and Search (Hidden on mobile) */}
        <div className={`lg:flex lg:items-center lg:w-auto w-full ${menuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col lg:flex-row lg:space-x-6 lg:items-center w-full lg:w-auto space-y-4 lg:space-y-0 text-center">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/">TODAY'S DEALS</Link></li>
            <li><Link to="/">TOP SELLER</Link></li>
            <li><Link to="/">ADVISE</Link></li>
            <li><Link to="/auction">AUCTIONS</Link></li>
          </ul>

 {/* Search Bar */}

 <div className="flex justify-center mt-4 lg:mt-0 lg:ml-4 px-4">

<input 

  type="text" 

  placeholder="Search by Name" 

  className="w-full rounded-full px-4 py-2" 

  value={searchTerm} 

  onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change

/>

<button 

  className='ml-2 bg-blue-500 text-white px-4 rounded-full' 

  onClick={handleSearch} // Call handleSearch on button click

>

  <CiSearch />

</button>

</div>

        </div>

        <div>

     
        </div>

        {/* Conditional Rendering for Login/Logout Button */}
        {isLoggedIn ? (
          <button onClick={logout} className="bg-blue-500 text-white px-4 py-2 rounded-full mr-4">Logout</button>
        ) : (
          <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-2 rounded-full mr-4">Login</button>
        )}

        {/* Dark Mode Toggle */}
        <div className="flex mr-2">
          {dark ? (
            <MdOutlineLightMode className="text-3xl cursor-pointer" onClick={darkModeHandle} />
          ) : (
            <MdDarkMode className="text-3xl cursor-pointer" onClick={darkModeHandle} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

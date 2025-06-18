// import React,{useState} from 'react'
// import "./Sidebar.css"
// import { Box,TextField } from '@radix-ui/themes'
// import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
// import { Text } from '@radix-ui/themes'
// import { useAuth } from '../../AuthContext'
// import { Link } from 'react-router-dom'
// function Sidebar() {
//   const { user } = useAuth();
//   const [ openHelo,setopenHelp ] = useState(false)
//   const [ isLogged,setIslogged] = useState(true)
//   const [isAdmin,setIsAdmin ] = useState(false)
//   const [isSeller,setIsseller ] = useState(true)
//   return (
//     <Box className='Sidebar'>``
//       <Box className='SideContent'>

//         {/* Search bar  */}
//         <Box className='SearchBar'> 
//           <TextField.Root placeholder='Search by name' >
//             <TextField.Slot className='searchbox' type="Search">
//               <MagnifyingGlassIcon height="16" width="16" />
//             </TextField.Slot>
//           </TextField.Root>
//         </Box>
//         {/* Trending */}

//         <Box className='help'>
//           <Box>
//           <Box className='labeli'>
//                     <Link to="/auctions">  <Text> Auctions </Text></Link>
//           </Box>
//                   <Box className='labeli'>
//                       <Text> Trending </Text>
//                   </Box>
//                   <ul className='listm'>
//                       <li className='lim'  >Paintings</li>
//                       <li className='lim'  >Sculptures</li>
//                       <li className='lim'  >Photographs</li>
//                   </ul>
//           </Box>
//         </Box>

//         {/* Help and Support */}
//         <Box className='help'>
//           <Box>
//                   <Box className='labeli'>
//                       <Text> Help & Support </Text>
//                   </Box>
//                   <ul className='listm'>
//                       <li className='lim'  >FAQs</li>
//                       <li className='lim'  >Privacy Policy</li>
//                       <Link to="/care">
//                       <li className='lim'  >Customer Care</li>
//                       </Link>
//                   </ul>
//           </Box>
//         </Box>

         

//          {/* Setting */}

//          <Box className='help'>
//           <Box>
//                   <Box className='labeli'>
//                       <Text> Settings </Text>
//                   </Box>

//                   {
//                     user ? (
//                      <>
//                      {
//                       user.role =="" ?
//                       (
//                         <ul className='listm'>
//                       <li className='lim'  >Admin Dashboard</li>
//                       <li className='lim'  >Manage Users</li>
//                       <li className='lim'  >Manage Orders</li>
//                       <li className='lim'  >Product Management</li>
//                   </ul>
//                       ):user.role == "artist" ? (
//                         <ul className='listm'>
//                         <li className='lim'  >Seller Dashboard</li>
//                         <Link to='/manage'>
//                         <li className='lim'  >Manage Listing</li>
//                         </Link>
//                         <li className='lim'  >Sales Reports</li>
                      
//                     </ul>
//                       ):(
//                         <ul className='listm'>
//                                       <Link to="/accounts/settings">
//                         <li className='lim'  >Account Settings</li>
//                         </Link>
//                         <Link to='/orders'>
//                         <li className='lim'  >My Orders</li>
//                         </Link> 
//                         <li className='lim'  >Preferences</li>
                      
//                     </ul>
//                       )
//                      }
//                      </>
//                     ):(
//                       <ul className='listm'>
//                         <li className='lim'  >Sign In</li>
//                       </ul>

//                     )
//                   }

//           </Box>
//         </Box>



//         </Box>
//     </Box>
//   )
// }

// export default Sidebar

import React from "react";
import { FaSearch, FaHome, FaChartLine, FaHandsHelping, FaCogs } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-75 h-screen fixed bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl text-white p-5 flex flex-col">
      
      {/* Search Bar */}
      <div className=" p-10 relative top-20 mb-6 ">
        <FaSearch className="absolute left-40 top-1/2 transform -translate-y-1/2 text-gray-400" aria-label="Search" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full px-4 py-2 pl-10 bg-gray-800 text-white rounded-lg shadow-lg outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-4">
        
        {/* Auctions */}
        <div className="p-4 mt-5">
        <Link to="/auctions" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition duration-300">
          <FaHome className="text-gray-300" aria-label="Auctions" />
          <span className="text-gray-300 hover:text-white">Auctions</span>
        </Link>
        </div>

        {/* Trending */}
        <div className=" p-8">
          <div className="flex items-center space-x-3  space-y-4  mb-2 text-gray-400">
            <FaChartLine aria-label="Trending" />
            <h3 className="uppercase font-semibold">Trending</h3>
          </div>
          <ul className="pl-6 space-y-4 ">
            <li className="hover:text-gray-300 cursor-pointer">🎨 Paintings</li>
            <li className="hover:text-gray-300 cursor-pointer">🗿 Sculptures</li>
            <li className="hover:text-gray-300 cursor-pointer">📷 Photographs</li>
          </ul>
        </div>

        {/* Help & Support */}
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-2 text-gray-400">
            <FaHandsHelping aria-label="Help & Support" />
            <h3 className="uppercase font-semibold mb-4">Help & Support</h3>
          </div>
          <ul className="pl-6 space-y-4 ">
            <li className="hover:text-gray-300 cursor-pointer top-2">❓ FAQs</li>
            <li className="hover:text-gray-300 cursor-pointer">🔒 Privacy Policy</li>
            <Link to="/care" className="block hover:text-gray-300">
              📞 Customer Care
            </Link>
          </ul>
        </div>

        {/* Settings */}
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-2 text-gray-400">
            <FaCogs aria-label="Settings" />
            <h3 className="uppercase font-semibold">Settings</h3>
          </div>
          {user ? (
            <ul className="pl-6 space-y-2">
              {user.role === "admin" ? (
                <>
                  <Link to="/admin/dashboard" className="block hover:text-gray-300">⚙️ Admin Dashboard</Link>
                  <Link to="/admin/users" className="block hover:text-gray-300">👥 Manage Users</Link>
                  <Link to="/admin/orders" className="block hover:text-gray-300">📦 Manage Orders</Link>
                  <Link to="/admin/products" className="block hover:text-gray-300">🛒 Product Management</Link>
                </>
              ) : user.role === "artist" ? (
                <>
                  <Link to="/artist/dashboard" className="block hover:text-gray-300">🎭 Seller Dashboard</Link>
                  <Link to="/manage" className="block hover:text-gray-300">🏷️ Manage Listing</Link>
                  <Link to="/sales-reports" className="block hover:text-gray-300">📊 Sales Reports</Link>
                </>
              ) : (
                <>
                  <Link to="/accounts/settings" className="block hover:text-gray-300">⚙️ Account Settings</Link>
                  <Link to="/orders" className="block hover:text-gray-300">📦 My Orders</Link>
                  <li className="hover:text-gray-300 cursor-pointer">🔧 Preferences</li>
                </>
              )}
            </ul>
          ) : (
            <ul className="pl-6">
              <Link to="/login" className="block hover:text-gray-300 cursor-pointer">🔑 Sign In</Link>
            </ul>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-center text-gray-500 text-sm">
        Ⓒ 2025 Artichub | Made with ❤️
      </div>
    </div>
  );
}

export default Sidebar;

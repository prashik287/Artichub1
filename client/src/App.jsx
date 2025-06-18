import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@radix-ui/themes";
import "./App.css";
import {Sidebar,Home1,FAQs,Home,Navbar} from './components/pages/Tpage/termpages'
import AccordionDemo from "./components/pages/Tpage/FAQs";
import { useAuth } from "./components/AuthContext";
import {ArtSettings,ArtistDash,ResetIn,ResetPass,CustomerCare,Order,Login,Product} from './components/pages/accounts/Accounts'
import  { CreateProduct,ProductDetails,ManageList } from './components/pages/products/products'
import Chatbot from "./components/ml/Chatbox";
import AuctionList from "./components/Auction/AuctionList";
import { PaymentSuccess ,PaymentFailed,PaymentCancelled } from './components/pages/payments/payments'

function App() {
  const { user } = useAuth();
  console.log(document.cookie.csrf);

  // State to toggle chatbot visibility
  const [showChatbot, setShowChatbot] = useState(false);

  // Toggle function
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <Box className="bg-white fixed h-screen w-screen">
      <Router>
        <Box className="bg-white">
          <Navbar />
        </Box>
        <Box className="main-content bg-white">
          <Sidebar />
          <Box className="pl-[40%] bg-white">
            <Routes>
              {user?.role === "Artist" ? (
                <Route path="/" element={<Home />} />
              ) : (
                <Route path="/" element={<Home1 />} />
              )}
              <Route
                path="/reset-password/:uid/:token"
                element={<ResetPass />}
              />
              <Route path="/reset-password/" element={<ResetIn />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faqs" element={<AccordionDemo />} />
              <Route path="/dashboard" element={<ArtistDash />} />
              <Route path="/accounts/settings" element={<ArtSettings />} />
              <Route path="/care" element={<CustomerCare />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/manage" element={<ManageList />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/auctions" element={<AuctionList/>}/>
              <Route path="/cancel" element={<PaymentCancelled/>}/>
              <Route path="/fail" element={<PaymentFailed/>}/>
              <Route path="/modify-product" element={<Product/>}/>
            </Routes>

            {/* Chatbot Icon & Chat Window */}
            <div className="fixed bottom-5 right-5 flex items-end">
              {/* Chatbot Icon (Click to Open/Close) */}
              <button
                onClick={toggleChatbot}
                className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
              >
                {/* Bot Icon */}
                {showChatbot ? (
                  <span className="text-lg">❌</span> // Close Icon
                ) : (
                  <span className="text-lg">🤖</span> // Bot Icon
                )}
              </button>

              {/* Chatbot Window */}
              {showChatbot && (
                <div className="bg-black text-white w-[350px] h-[450px] ml-4 rounded-lg shadow-lg overflow-hidden">
                  <Chatbot />
                </div>
              )}
            </div>
          </Box>
        </Box>
      </Router>
    </Box>
  );
}

export default App;

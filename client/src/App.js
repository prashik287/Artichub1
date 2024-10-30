import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import { Navbar, Sidebar, Home, Signup, Login, VerificationSuccess, VerificationFail, Dashboard, Contact, CustomerCareForm, PrivacyPolicy, AdminLogin, ManageUsers, ProductDetails, ResendVerification, AccountSettings, BuyService, Checkout, Preferences, MyOrder, AddProduct, Auction,ProductBid,ListingManager,PasswordResetRequest} from './components/components';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark class to the root element based on the state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className=' bg-gray-100 dark:bg-blue-500'>
      <I18nextProvider i18n={i18n}>
        <UserProvider>
          <Router>
            <Navbar />
            <Sidebar />
            <button onClick={() => setDarkMode(!darkMode)}>PasswordResetRequest,ProductDetails,ProductSummary
              Toggle Dark Mode
            </button>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/register' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/verification-success' element={<VerificationSuccess />} />
              <Route path='/verification-fail' element={<VerificationFail />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/CustomerCare' element={<CustomerCareForm />} />
              <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
              <Route path='/auth' element={<AdminLogin />} />
              <Route path='/*' element={<VerificationFail />} />
              <Route path='/manageusers' element={<ManageUsers />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path='/resend-verification' element={<ResendVerification />} />
              <Route path="/user/account" element={<AccountSettings />} />
              <Route path="/user/buyservice" element={<BuyService />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/prefer" element={<Preferences />} />
              <Route path="/users/orders" element={<MyOrder />} />
              <Route path='/newproduct' element={<AddProduct />} />
              <Route path="/auction" element={<Auction />} />
              <Route path="/auction/:id" element={<ProductBid />} />
              <Route path="/listingmanager" element={<ListingManager />} />
              <Route path='/resetpass' element={<PasswordResetRequest />} />
            </Routes>
          </Router>
        </UserProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;

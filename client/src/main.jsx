import React from 'react';
import ReactDOM from 'react-dom/client';
import "@radix-ui/themes/styles.css"
import App from './App.jsx';
import  { Theme } from '@radix-ui/themes'
import { AuthProvider } from "./components/AuthContext.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme  accentColor='iris' grayColor='sand' radius='large' appearance='dark'> 
    <AuthProvider>
      
      <App />
      </AuthProvider>
   
      </Theme>
     

  </React.StrictMode>
);

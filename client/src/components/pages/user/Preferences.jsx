import React, { useState, useEffect } from "react";
import axios from "axios";
import i18n from "../../../i18n";  // Import i18n

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: true,
    language: "en",
    currency: "USD",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save preferences to backend
      const res = await axios.post("http://127.0.0.1:7000/pref/preferences", preferences);

      // Update i18n language based on preferences
      i18n.changeLanguage(preferences.language);

      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences", error);
    }
  };

  useEffect(() => {
    // Automatically change language when user selects a new language
    i18n.changeLanguage(preferences.language);
  }, [preferences.language]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Set Your Preferences</h2>
        <form onSubmit={handleSubmit}>
          {/* Theme Preference */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Theme</label>
            <select
              name="theme"
              value={preferences.theme}
              onChange={handleInputChange}
              className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Notifications Preference */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications"
                checked={preferences.notifications}
                onChange={handleInputChange}
                className="mr-2"
              />
              Enable Notifications
            </label>
          </div>

          {/* Language Preference */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Language</label>
            <select
              name="language"
              value={preferences.language}
              onChange={handleInputChange}
              className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          {/* Currency Preference */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Currency</label>
            <select
              name="currency"
              value={preferences.currency}
              onChange={handleInputChange}
              className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default Preferences;

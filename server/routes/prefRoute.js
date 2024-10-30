const express = require("express");
const router = express.Router();

// Mock database or user data storage
let userPreferences = {};

// Route to save preferences
router.post("/preferences", (req, res) => {
  const { theme, notifications, language, currency } = req.body;

  // Ensure all required fields are provided
  if (!theme || typeof notifications === "undefined" || !language || !currency) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Save preferences to a mock database or user object
  userPreferences = {
    theme,
    notifications,
    language,
    currency,
  };

  return res.status(200).json({ message: "Preferences saved successfully", userPreferences });
});

// Route to get preferences (optional, if needed for fetching user preferences)
router.get("/preferences", (req, res) => {
  return res.status(200).json(userPreferences);
});

module.exports = router;

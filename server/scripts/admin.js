const admin = require('../models/admin');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const existingUser = await admin.findOne({ email: "admin@artichub.com" });
    if (existingUser) {
      console.log("Admin already exists");
        
    }

    // Wait for the bcrypt hash to resolve
    const hashedPassword = await bcrypt.hash("Lucifer", 10);

    const newAdmin = await admin.create({
      firstName: "Mr",
      lastName: "Admin",
      email: "admin@artichub.com",
      password: hashedPassword, // Use the awaited hash
      role: "admin"
    });
    newAdmin.save()
    console.log("New Admin created");
  } catch (error) {
    console.log(error);
  }
}

module.exports = createAdmin;

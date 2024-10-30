const  express  = require('express')
const cors = require('cors')
const router = express.Router()
const addproductController  = require('../controllers/addproduct')
const cloudinary = require('cloudinary').v2;
router.use(cors())

router.post('/add', addproductController.addProduct)

cloudinary.config({
  cloud_name: process.env.cloud,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Generate Cloudinary signature
router.post('/get-signature', (req, res) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  const folder = 'product_images'; // Folder where the images will be stored
  const public_id = req.body.public_id; // Optional: If you want to provide a public_id for the image

  // Generate the signature using the same parameters you'll send to Cloudinary
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, public_id },
    process.env.api_secret // Make sure this matches your config
  );

  res.json({
    signature,
    timestamp,
    cloudName: process.env.cloud,
    apiKey: process.env.api_key,
    folder,
    public_id, // Send back the public_id so the client uses the same
  });
});


module.exports =router
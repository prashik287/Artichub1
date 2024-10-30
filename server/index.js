const express = require('express');
const signupRoute = require('./routes/signup');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoute = require('./routes/login');
const FeedbackRoute = require('./routes/message');
const adminRoute = require('./routes/adminLogin');
const resendmail = require('./routes/resendmail');
const admincreate = require('./scripts/admin');
const passreset = require('./routes/pass-reset');
const verifyEmailRoute = require('./routes/verifyEmail');
const productRoute = require('./routes/products');
const updateuser = require('./routes/updateuser');
const buyRoute = require('./routes/buyroute');
require('dotenv').config();
const Art = require('./models/Products'); // Use correct model for art data
const data = require('./data/test.json');
const retrieveRoute = require('./routes/retrieve')
const createOrder = require('./routes/createorder')
const mongoose = require('mongoose');  // Import mongoose to handle ObjectId
const prefRoute = require('./routes/prefRoute.js')
const app = express();
const getSellerRoute = require('./routes/getseller')
const setReviewRoute = require('./routes/setreview')
const OrderRoute = require('./routes/Order')
const addproductRoute = require('./routes/addproduct')
const PORT = process.env.PORT || 7000; // Fixed PORT assignment
const http = require('http')
const server = http.createServer(app);
const path =  require('path')
const { Server } = require('socket.io')
const sellerartRoute = require('./routes/sellerart')
const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Remove trailing slashes
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true, // Enable credentials if needed
    },
  });


const Razorpay = require('razorpay');
if (!process.env.RAZOR_KEY || !process.env.RAZOR_SECRET) {
    throw new Error('Razorpay Key ID and Key Secret must be defined in the environment variables.');
}

// Configure Razorpay

// Configure Razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
});

let auctionTimers = {};

io.on('connection', (client) => {
    console.log('New user connected', client.id);

    client.on('placeBid', async (data) => {
        try {
            const { artId, bidAmount, bidder } = data;
            const artItem = await Art.findById(artId);
            if (!artItem) {
                console.error('Art item not found');
                return;
            }
    
            // Ensure bid is higher than the current highest bid
            if (!artItem.highestBid || bidAmount > artItem.highestBid.amount) {
                artItem.highestBid = { amount: bidAmount, bidder, bidTime: new Date() };
                await artItem.save();
    
                io.emit(`bidUpdate-${artId}`, { bidAmount, bidder });
    
                // Clear any existing timers for this artId
                if (auctionTimers[artId]) clearTimeout(auctionTimers[artId]);
    
                // Set a new timer for 30 seconds
                auctionTimers[artId] = setTimeout(async () => {
                    const paymentOrder = await razorpayInstance.orders.create({
                        amount: bidAmount * 100,
                        currency: "INR",
                        receipt: `receipt_${artId}`,
                        payment_capture: 1,
                    });
    
                    io.emit('startPayment', {
                        paymentOrderId: paymentOrder.id,
                        bidAmount,
                        artId,
                    });
    
                    console.log(`Payment initiated for ${bidder} on art item ${artId}`);
    
                }, 30000); // Set the timeout to 30 seconds
            } else {
                console.log('Bid is too low.');
            }
        } catch (error) {
            console.error('Error processing bid:', error);
        }
    });
    client.on('paymentSuccess', async (data) => {
        try {
          const { artId, paymentOrderId } = data;
          const artItem = await Art.findById(artId);
          if (artItem && artItem.Quantity > 0) {
            artItem.Quantity -= 1; // Reduce quantity
            await artItem.save();
            console.log(`Product ${artId} sold to ${artItem.highestBid.bidder}`);
            io.emit(`auctionEnd-${artId}`, { message: 'Auction ended, product sold', artId });
          } else {
            console.error('Product not found or already sold out');
          }
        } catch (error) {
          console.error('Error updating product after payment:', error);
        }
      });
      

    client.on('disconnect', () => {
        console.log('User disconnected', client.id);
    });
});

app.use(express.static(path.resolve("./public")))

app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded payloads
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Specify allowed origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // If you're using cookies, etc.
  }));
  
// Endpoint to fetch test data (from local JSON file)
app.get('/api/test-data', (req, res) => {
    res.json(data);
});


// Endpoint to fetch all art data from MongoDB
app.get('/api/art-data', async (req, res) => {
    try {
        const products = await Art.find({ saleType:"sell"});  // Fetch products from MongoDB
        if (products.length > 0) {
            console.log('Products fetched:', products);  // Log products
            res.json(products);  // Send products back as JSON
        } else {
            console.log('No products found');
            res.status(404).json({ message: 'No products available' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});
app.get('/api/auctions', async (req, res) => {
    try {
        const products = await Art.find({saleType:"auction"});  // Fetch products from MongoDB
        if (products.length > 0) {
            console.log('Products fetched:', products);  // Log products
            res.json(products);  // Send products back as JSON
        } else {
            console.log('No products found');
            res.status(404).json({ message: 'No products available' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Fetch a single art item by ObjectId
app.get('/api/art-data/:id', async (req, res) => {
    const { id } = req.params;
    
    // Validate and convert `id` to ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId format' });
    }
    try {
        const product = await Art.findById(id);  // Find the product by its ObjectId
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});
app.get('/api/auction/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    try {
        const product = await Art.findById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});
app.put('/api/auction/:id/bid', async (req, res) => {
    const { id } = req.params;

    // Log headers to debug
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    const { bidAmount, bidder } = req.body; // Ensure req.body is populated

    // Validate bid amount
    if (!bidAmount || bidAmount <= 0) {
        return res.status(400).json({ message: 'Invalid bid amount' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    try {
        const product = await Art.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (!product.highestBid || bidAmount > product.highestBid.amount) {
            product.highestBid = {
                amount: bidAmount,
                bidder: bidder,
                bidTime: new Date()
            };

            await product.save();
            res.status(200).json({ message: 'Bid placed successfully', highestBid: product.highestBid });
        } else {
            res.status(400).json({ message: 'Bid must be higher than the current highest bid' });
        }
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Error placing bid' });
    }
});


// Server-side route to update product quantity (by ObjectId)
app.put('/api/art-data/:id', async (req, res) => {
    const { id } = req.params;
    
    // Validate and convert `id` to ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    try {
        // Find product by ID and update its quantity
        const product = await Art.findById(id);
        if (product) {
            product.Quantity = 0;  // Set quantity to zero
            await product.save();  // Save the updated product
            res.status(200).json({ message: 'Product marked as sold out' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product quantity' });
    }
});
app.get('/', (req, res)=>{
    return res.sendFile('./public/index.html')
});
app.use(bodyParser.json());
app.use("/user", signupRoute);
app.use('/auth', loginRoute);
app.use("/feed", FeedbackRoute);
app.use('/admin', adminRoute);
app.use('/email', verifyEmailRoute);
app.use('/resendmail', resendmail);
app.use('/resetpassword', passreset);
app.use('/products', productRoute);
app.use('/update', updateuser);
app.use('/retrieve', retrieveRoute);
app.use('/buy', buyRoute);
app.use('/order', createOrder);
app.use('/pref',prefRoute)
app.use('/seller',getSellerRoute)
app.use('/reviewer',setReviewRoute)
app.use("/o",OrderRoute)
app.use('/product',addproductRoute)
app.use('/st',sellerartRoute)
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

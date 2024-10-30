const { default: mongoose } = require("mongoose");
const Product = require("../models/Products");

async function addProduct(productData) {
  try {
    const { name, description, price, Quantity, category, image, sellerId ,saleType,auctionStartDate,auctionEndDate } = productData;

    // Check for required fields and throw specific error for the missing field
    if (!name) {
      throw new Error('Product name is required');
    }
    if (!description) {
      throw new Error('Description is required');
    }
    if (Quantity == null) {
      throw new Error('Quantity is required');
    }
    if (!price) {
      throw new Error('Price is required');
    }
    if (!category) {
      throw new Error('Category is required');
    }
    if (!image) {
      throw new Error('Image is required');
    }
    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    // Check if the product already exists
    const existingProduct = await Product.findOne({ image   : image });
    if (existingProduct) {
      throw new Error('Product already exists');
    }

    const newProduct = new Product({
      title: name,
      condition: description, // Assigning description properly
      Quantity : Quantity,
      price,
      saleType:saleType,
      auctionStartDate:auctionStartDate,
      auctionEndDate:auctionEndDate,
      category,
      image,
      bids : [],
      highestBid : [],
      seller: sellerId
    });

    await newProduct.save();

    return newProduct;
  } catch (error) {
    console.error("Error while adding product: ", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  addProduct
};

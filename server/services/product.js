const Art = require('../models/Products'); // Import the Art model
const Eseller = require('../models/Eseller'); // Import the Eseller model

async function addProduct(productData, sellerId) {
    const { id, name, Quantity, price, category, image } = productData;

    // Check for required fields
    if (!id || !name  || Quantity == null || !price || !category || !image) {
        throw new Error('All fields are required');
    }

    // Check if the product already exists
    const existingProduct = await Art.findOne({ id });
    if (existingProduct) {
        throw new Error('Product with this ID already exists');
    }

    // Check if the seller exists
    const seller = await Eseller.findById(sellerId);
    if (!seller) {
        throw new Error('Seller not found');
    }

    // Create the new product with reference to the seller
    const newProduct = await Art.create({
        id,
        name,
        Quantity,
        price,
        category,
        image,
        seller: sellerId // Add reference to the seller
    });

    return newProduct;
}

module.exports = {
    addProduct
};

const Ebuyer = require('../models/Ebuyer')
const Eseller = require('../models/Eseller')
const Product = require('../models/Products')
const Purchase = require('../models/Purchase')
const sendEmail = require('../utils/sendEmail')

async function buyart(buyerId,productId,purchaseData) {
    const {quantity,payment_method, address,city,state,zipcode,country} = purchaseData
    if (!quantity ||!payment_method ||!address ||!city ||!state ||!zipcode ||!country) {
        throw new Error('All fields are required')
    }
    const buyer = await Ebuyer.findById(buyerId)
    if (!buyer) {
        throw new Error('Invalid buyer ID')
    }

    const product = await Product.findById(productId)
    if (!product){
        throw new Error('Invalid product ID')
    }
    if (product.quantity < quantity) {
        throw new Error('Not enough stock for the requested quantity')
    }
    product.quantity = quantity
    await product.save()

    //create a new purchase object

    const purchase = new Purchase.create({
        buyer: buyer._id,
        product: product._id,
        quantity: quantity,
        payment_method:payment_method,
        shippingAddress:{
            address,
            city,
            state,
            zipcode,
            country
        },
        totalPrice: product.price * quantity,
        purchaseDate:new Date(),
        status: 'Pending'
    }).save()
        // Send purchase confirmation email
        const message = `
        Hi ${buyer.firstName},

        Thank you for your purchase!

        You have successfully purchased the product "${product.title}" (Quantity: ${quantity}).

        Your total payment: $${purchase.totalPrice}
        Shipping to: ${address}, ${city}, ${state}, ${zipCode}, ${country}

        We will notify you when the seller ships your product.

        Regards,
        ArtisticHub Team
    `;
    await sendEmail(buyer.email, 'Purchase Confirmation', message);

    return purchase;


}


module.exports = {
    buyart
}
const buyservice = require('../services/buy')


async function buyart(req, res) {
    try {
        const buyerId = req.user._id;
        const productId = req.params.productId;
        const purchaseData = req.body;
        const purchase = await buyservice.buyart(buyerId, productId, purchaseData);
        res.status(201).json({ purchase, message: "Purchase successful" });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Use 400 for client errors
    }
}

module.exports = {
    buyart,
};
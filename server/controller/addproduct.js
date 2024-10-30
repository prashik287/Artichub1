const addProductService = require('../services/addProduct')
async function addProduct(req,res) {
    try{
        const productData = req.body
        const product = await addProductService.addProduct(productData)
        res.status(201).json({ product, message: "Listed Successfully successful" });

    }catch(error){
        res.status(400).json({ error: error.message }); // Use 400 for client errors

    }
    

}

module.exports = {
    addProduct
}
const express = require('express');
const cors = require('cors');
const router = express.Router();
const Product = require('../models/Products')

router.use(cors());

router.post('/:id/arts',async(req,res)=>{
    const { storename } = req.params
    const { acctype } = req.body
    try{
        const arts = await Product.find({ store : storename })
        if (arts.length === 0) {
            return res.status(404).json({ message: 'No arts found for this store.' });
        }

         res.json(arts);
    }catch(error){
        console.error("Errror Occured :" , error)
         res.status(500).json({ message: 'Server error. Please try again later.' });
    }
})
module.exports = router

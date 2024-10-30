const verifyservice = require('../services/verifyemail')

async function verifyEmail(req,res){
    try{
        await verifyservice.verifyemail(req,res)
    }catch(error){
        res.status(400).json({error: error})
    }
}

module.exports={
    verifyEmail
}
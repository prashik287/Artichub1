const updateService = require('../services/updateinfo')

async function updateUser(req,res) {
    try{
        const userData = req.body
        const updatedUser = await updateService.updateuser(userData)
        res.status(200).json({ updatedUser })
    }catch(error){
        console.log(error)
        res.status(400).json({error: error})
    }
}

module.exports={
    updateUser
}

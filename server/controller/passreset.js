const resetservice =  require('../services/passwordreset')

async function resetPassword(req,res){
    try{
        const userData = req.body
        const user = await resetservice.passreset(userData)
        res.status(201).json({ user, message: "Check your inbox for Password reset link" });


    }catch(error){
        res.status(400).json({error: error})
    }
}

module.exports={
    resetPassword
}
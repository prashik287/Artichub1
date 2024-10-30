const FeedService = require('../services/message')

async function sendfeed(req,res) {
    try{
        const userFeed = req.body
        const newMsg = await FeedService.sendfeed(userFeed)
        res.status(201).json({newMsg})
    }catch(error){
        res.status(400).json({error: error})
    }

}
module.exports= {
    sendfeed
}
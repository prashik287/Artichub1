const express = require('express');
const messageController = require('../controllers/message')
const router = express.Router()

router.post('/feedback',messageController.sendfeed)

module.exports = router;
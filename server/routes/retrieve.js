const retrieveController = require('../controllers/getUser');
const express = require('express');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.post('/retrieve', retrieveController.retrieveusers);

module.exports = router;

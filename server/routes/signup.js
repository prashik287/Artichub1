const express = require('express');
const signupController = require('../controllers/userControllller')
const router = express.Router();
const cors = require('cors');

router.use(cors())

router.post('/register', signupController.createUser);

module.exports = router;

const express = require('express');
const emailController = require('../controllers/resendmail');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.post('/resendmail', emailController.resendVerificationEmail);

module.exports = router;

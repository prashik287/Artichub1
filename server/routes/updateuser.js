const updatedUControllers = require('../controllers/updateuser')
const express = require('express');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.post('/update', updatedUControllers.updateUser);

module.exports = router;
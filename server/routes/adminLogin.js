const  express  = require('express')
const cors = require('cors')
const { adminLogin  } = require('../controllers/adminlogin')
const router = express.Router()
router.use(cors())
router.post('/login', adminLogin);
module.exports = router
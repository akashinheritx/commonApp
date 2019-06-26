const router = express.Router();
const demoController = require('../controllers/demo.controller');

router.get('/send-text-message', demoController.sendTextMessage);

module.exports = router;
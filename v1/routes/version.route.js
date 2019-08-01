const router = express.Router();
const {version_validator} = require('../../middleware/version.validator');
const {validatorFunc} = require('../../helper/commonFunction.helper');
const versionController = require('../controllers/version.controller');
const auth = require('../../middleware/auth.middleware');

router.post('/createVersionNumber', auth, version_validator, validatorFunc, versionController.createVersion);
router.get('/getAllVersionNumber', auth, versionController.getAllVersionData);

module.exports = router;
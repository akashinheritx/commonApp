const router = express.Router();
const emailFormatController = require('../controllers/emailTemplate.controller');
const {emailTemplate_validator} = require('../../middleware/emailTemplate.middleware');
const {validatorFunc} = require('../../helper/commonFunction.helper');
const auth = require('../../middleware/auth.middleware');

router.post('/createEmailTemplate', auth, emailTemplate_validator, validatorFunc, emailFormatController.createEmailTemplate);
router.post('/updateEmailTemplate/:id', auth, emailTemplate_validator, validatorFunc, emailFormatController.updateEmailTemplate);

router.get('/getSingleEmailTemplate/:id',auth, emailFormatController.getSingleEmailTemplate);
router.get('/getAllEmailTemplate',auth, emailFormatController.getAllEmailTemplate);
router.delete('/deleteEmailTemplate/:id',auth, emailFormatController.deleteEmailTemplate);

module.exports = router;
const router = express.Router();
const smsFormatController = require('../controllers/smsTemplate.controller');
const {smsTemplate_validator} = require('../../middleware/smsTemplate.middleware');
const {validatorFunc} = require('../../helper/commonFunction.helper');
const auth = require('../../middleware/auth.middleware');

router.post('/createSMSTemplate', auth, smsTemplate_validator, validatorFunc, smsFormatController.createSMSTemplate);
router.post('/updateSMSTemplate/:id', auth, smsTemplate_validator, validatorFunc, smsFormatController.updateSMSTemplate);

router.get('/getSingleSMSTemplate/:id',auth, smsFormatController.getSingleSMSTemplate);
router.get('/getAllSMSTemplate',auth, smsFormatController.getAllSMSTemplate);

router.delete('/deleteSMSTemplate/:id',auth, smsFormatController.deleteSMSTemplate);

module.exports = router;
const router = express.Router();
const User = require('../../models/user.model');
const { loginSchema, forgetPasswordSchema, setNewPasswordSchema } = require('../../middleware/validator');
const {register_validator} = require('../../middleware/register.validator');
const {validatorFunc} = require('../../helper/commonFunction.helper');
const userController = require('../controllers/user.controller');
const auth = require('../../middleware/auth.middleware');
const profileUpload = require('../../middleware/uploadProfileImage');

router.post('/user-login', userController.userLogin);
router.post('/admin-login', userController.adminLogin);
router.post('/register', profileUpload, register_validator, validatorFunc, userController.register);
router.post('/change-password', auth, userController.changePassword);
router.get('/get-user-profile', auth, userController.getUserProfile);
router.post('/update-user-profile', auth, profileUpload, userController.updateUserProfile);
router.post('/forgot-password', forgetPasswordSchema, userController.forgotPassword);
router.get('/reset-password/:token*?', userController.forgotUrl);
router.post('/set-password', userController.setNewPassword);
router.post('/logout', auth, userController.logoutSingleDevice);
router.post('/logout-all', auth, userController.logoutAllDevice);

router.post('/forgot-password-with-otp', forgetPasswordSchema, userController.sendOtp);
router.post('/set-new-password-with-otp', userController.setNewPasswordByOTP);


module.exports = router;
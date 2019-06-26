const router = express.Router();
const User = require('../../models/user.model');
const { loginSchema, forgetPasswordSchema, setNewPasswordSchema } = require('../../middleware/validator');
const userController = require('../controllers/user.controller');
const auth = require('../../middleware/auth.middleware');
const profileUpload = require('../../middleware/uploadProfileImage');

router.post('/user-login', userController.userLogin);
router.post('/admin-login', userController.adminLogin);
router.post('/register', profileUpload, userController.register);
router.post('/change-password', auth, userController.changePassword);
router.get('/get-user-profile', auth, userController.getUserProfile);
router.post('/update-user-profile', auth, profileUpload, userController.updateUserProfile);
router.post('/forgot-password', forgetPasswordSchema, userController.forgotPassword);
router.get('/reset-password/:token*?', userController.forgotUrl);
router.post('/set-password', setNewPasswordSchema, userController.setNewPassword);
router.post('/logout', auth, userController.logoutSingleDevice);
router.post('/logout-all', auth, userController.logoutAllDevice);

module.exports = router;
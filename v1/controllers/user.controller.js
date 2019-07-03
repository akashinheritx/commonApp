const { loginSchema } = require('../../middleware/validator');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const dateFormat = require('../../helper/dateFormate.helper');
const constants = require('../../config/constants');
const commonMessage = require('../../helper/commonMessage.helper');
const commonFunction = require('../../helper/commonFunction.helper');
const logService = require('../../services/log.service');
const sendEmail = require('../../services/email.service');
const accountCreatedTemplate = require('../../services/emailTemplate/accountCreatedTemplate');
const forgotPasswordTemplate = require('../../services/emailTemplate/forgotPasswordTemplate');
const forgotPasswordOtpTemplate = require('../../services/emailTemplate/forgotPasswordOtpTemplate');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const keys = require('../../keys/keys');

const Message = commonMessage.MESSAGE;

//user login
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredential(email, password);
        
        if (user.user_type !== constants.USER_TYPE.USER) {
            return res.status(400).send({
                status: constants.STATUS_CODE.FAIL,
                message: Message.UNAUTHRIZED_LOGIN,
                error: false,
                data : {}
            });
        }

        const devicelogin = await User.deviceLogin(user.tokens);

        const token = await user.generateToken('2m');

        data = user;
        
        if (data.profile_pic) {
            data.profile_pic = req.app.locals.base_url + '/' + constants.PROFILE_IMG_URL + '/' + user.profile_pic;
        }
        
        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.SUCCESSFULL_LOGIN,
            error: false,
            data : data
        });

        logService.responseData(req, data);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: error.message,
            error: true,
            data: {},
        });

        logService.responseData(req, error);
    }
}

//admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredential(email, password);

        if (user.user_type !== constants.USER_TYPE.ADMIN) {
            return res.status(400).send({
                status: constants.STATUS_CODE.FAIL,
                message: Message.UNAUTHRIZED_LOGIN,
                error: false,
                data : {}
            });
        }
        
        const devicelogin = await User.deviceLogin(user.tokens);
        
        const token = await user.generateToken();
        user.tokens.token = token;
        await user.save();        
        
        if (user.profile_pic) {
            user.profile_pic = req.app.locals.base_url + '/' + constants.PROFILE_IMG_URL + '/' + user.profile_pic;
        }
        
        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.SUCCESSFULL_LOGIN,
            error: false,
            data : {user, token}
        });

        logService.responseData(req, data);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });

        logService.responseData(req, error);
    }
}

//register user and admin
exports.register = async (req, res) => {
    try{
        let reqdata = req.body;

        var isUserExist = await User.findOne({email: reqdata.email, deleted_at:null});
        
        if(isUserExist){
            if(req.file){
                profileImgPath = constants.PROFILE_IMG_PATH+'/'+req.file.filename;
                await commonFunction.removeFile(profileImgPath);
            }

            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.EMAIL_ALREADY_EXISTS,
                error: true,
                data: {},
            });
        }

        //get user type and entry accoring to table
        if(!reqdata.user_type){
            return res.status(422).send({
                status:constants.STATUS_CODE.VALIDATION,
                message: Message.USER_TYPE_REQUIRED,
                error: true,
                data: {},
            });
        }

        user = new User();
        user.first_name = reqdata.first_name;
        user.last_name = reqdata.last_name;

        if(reqdata.gender){
            user.gender = reqdata.gender
        }
        if(reqdata.dob){
            user.dob = reqdata.dob;
        }

        user.email = reqdata.email;
        user.user_type = parseInt(reqdata.user_type);
        user.password = await bcrypt.hash(reqdata.password, 10);

        if(reqdata.mobile_number){
            user.mobile_number = reqdata.mobile_number;
        }
    
        if(req.file){
            user.profile_pic = req.file.filename
            profileImgPath = constants.PROFILE_IMG_PATH+'/'+req.file.filename
            await commonFunction.resizeImage(profileImgPath);
        }

        user.created_at = await dateFormat.set_current_timestamp();
        user.updated_at = await dateFormat.set_current_timestamp();
        user.actual_updated_at = await dateFormat.set_current_timestamp();

        user.status = constants.STATUS.INACTIVE;

        let userdata = await user.save();

        await sendEmail(user.email, 'Welcome to App', accountCreatedTemplate({ email:reqdata.email, password:reqdata.password, first_name:reqdata.first_name, last_name:reqdata.last_name}))
        // console.log('email has been sent')
        
       
        return res.status(201).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.NEW_USER_CREATED,
            error: false,
            data : userdata
        });

        logService.responseData(req, userdata);

    }catch(error){
        console.log(error)
        if(req.file){
            profileImgPath = constants.PROFILE_IMG_PATH+'/'+req.file.filename;
            await commonFunction.removeFile(profileImgPath);
        }
        res.status(400).send({
            status:constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data:{}
        });

        logService.responseData(req, error);
    }
}

//change password
exports.changePassword = async (req, res) => {

    try {
        let reqdata = req.body;

        let user = await User.findOne({ _id: req.user._id, deleted_at: null });

        if (!user) {
            return res.status(404).send({
                status: constants.STATUS_CODE.NOT_FOUND,
                message: Message.USER_DETAILS_NOT_AVAILABLE,
                error: true,
                data: {},
            });
        }

        //checking for valid password
        if (!user.validPassword(reqdata.old_password)) {
            return res.status(400).send({
                status: constants.STATUS_CODE.FAIL,
                message: Message.INVALID_PASSWORD,
                error: true,
                data: {},
            });
        }

        //checking for password length
        if (reqdata.new_password.length < 6) {
            return res.status(400).send({
                status: constants.STATUS_CODE.VALIDATION,
                message: Message.PASSWORD_MIN_LENGTH,
                error: true,
                data: {},
            });
        }

        user.password = await bcrypt.hash(reqdata.new_password, 10); 
        user.updated_at = await dateFormat.set_current_timestamp();
        user.actual_updated_at = await dateFormat.set_current_timestamp();
        await user.save();

        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.PASSWORD_UPDATE_SUCCESS,
            error: false,
            data: {},
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });
    }
}

//get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userData = req.user;
        if (userData.profile_pic !== null) {
            userData.profile_pic = req.app.locals.base_url + '/' + constants.PROFILE_IMG_URL + '/' + userData.profile_pic;
        } else {
            userData.profile_pic = "";
        }
        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.PROFILE_FETCH_SUCCESS,
            error: false,
            data: userData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });
    }
}

//update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        let reqdata = req.body;
        
        const user = await User.findOne({ _id: req.user._id, deleted_at: null });
        if (!user) {
            profileImgPath = constants.PROFILE_IMG_PATH + '/' + req.file.filename;
            await commonFunction.removeFile(profileImgPath);

            return res.status(404).send({
                status: constants.STATUS_CODE.NOT_FOUND,
                message: Message.USER_DETAILS_NOT_AVAILABLE,
                error: true,
                data: {},
            });
        }

        oldImageName = user.profile_pic;

        user.first_name = reqdata.first_name;
        user.last_name = reqdata.last_name;

        if(reqdata.gender){
            user.gender = reqdata.gender
        }
        if(reqdata.dob){
            user.dob = reqdata.dob;
        }

        if(reqdata.mobile_number){
            user.mobile_number = reqdata.mobile_number;
        }
    
        if(req.file){
            user.profile_pic = req.file.filename
            profileImgPath = constants.PROFILE_IMG_PATH+'/'+req.file.filename
            await commonFunction.resizeImage(profileImgPath);
        }

        user.updated_at = await dateFormat.set_current_timestamp();
        user.actual_updated_at = await dateFormat.set_current_timestamp();

        let savedData = await user.save();

        if (savedData) {
            if (req.file) {
                profileImgPath = constants.PROFILE_IMG_PATH + '/' + oldImageName; //profile path
                await commonFunction.removeFile(profileImgPath);  //remove old images
            }
        }

        if (!savedData.profile_pic == '') {
            savedData.profile_pic = req.app.locals.base_url + '/' + constants.PROFILE_IMG_URL + '/' + savedData.profile_pic;
        }

        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.PROFILE_UPDATE_SUCCESS,
            error: false,
            data: savedData
        });

    } catch (error) {
        res.status(400).send({
            status: constants.STATUS_CODE.NOT_FOUND,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });
    }
}

exports.sendOtp = async (req, res) => {
    try {
        let email = req.body.email;
        var user = await User.findOne({ email, deleted_at: null });
        // const logoUrl = req.app.locals.base_url + '/' + constants.LOGO_IMG_URL + '/' + 'logo.png';
        if (!user) {
            return res.status(404).send({
                status: constants.STATUS_CODE.NOT_FOUND,
                message: message.email_not_found,
                error: true,
                data: {},
            });
        }
        // var token = jwt.sign({ email }, keys.JWT_SECRET).toString();
        
        user.otp = await commonFunction.generateRandomOtp();
        //add hours to check expire time
        user.otp_expires = dateFormat.add_time_to_current_timestamp(1, 'hours');
        await user.save();
        const mailUrl = req.app.locals.base_url + '/api/v1/users/reset-password/';
        await sendEmail(email, 'Check Your OTP', forgotPasswordOtpTemplate({ otp: user.otp, /*logo: logoUrl*/ }));
        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.FORGOTPASSWORD_OTP_SUCCESS,
            error: false,
            data: {}
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.FORGOTPASSWORD_OTP_FAIL,
            error: true,
            data: {},
        });
    }
}

//set new password with otp
exports.setNewPasswordByOTP = async (req, res) => {
    try {
        const { otp, new_password } = req.body;
        // let currentDate = moment().format();
        let currentDate = await dateFormat.set_current_timestamp();
        
        
        //check token with expire time
        var user = await User.findOne({ otp, otp_expires: { $gte: currentDate } });       
        console.log(user)
        if (!user) {
            res.status(404).send({
                status: constants.STATUS_CODE.FAIL,
                message: Message.USER_DETAILS_NOT_AVAILABLE,
                error: true,
                data: {},
            });
        }
        user.password = await bcrypt.hash(new_password, 10);
        user.otp = null;
        user.updated_at = await dateFormat.set_current_timestamp();
        await user.save();
        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.PASSWORD_UPDATE_SUCCESS,
            error: false,
            data: {}
        });
    }catch (error) {
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        let email = req.body.email;
        var user = await User.findOne({ email, deleted_at: null });
        // const logoUrl = req.app.locals.base_url + '/' + constants.LOGO_IMG_URL + '/' + 'logo.png';
        if (!user) {
            return res.status(404).send({
                status: constants.STATUS_CODE.NOT_FOUND,
                message: message.USER_DETAILS_NOT_AVAILABLE,
                error: true,
                data: {},
            });
        }
        var token = jwt.sign({ email }, keys.JWT_SECRET).toString();
        user.reset_password_token = token;
        //add hours to check expire time
        user.reset_password_expires = dateFormat.add_time_to_current_timestamp(1, 'hours');
        await user.save();
        const mailUrl = req.app.locals.base_url + '/api/v1/users/reset-password/';
    await sendEmail(email, 'Password Reset', forgotPasswordTemplate({ url: mailUrl + token, /*logo: logoUrl*/ }));
        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.FORGOTPASSWORD_EMAIL_SUCCESS,
            error: false,
            data: {}
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.FORGOTPASSWORD_EMAIL_FAIL,
            error: true,
            data: {},
        });
    }
}

exports.forgotUrl = async (req, res) => {
    try {
        if(req.params.token){
            reset_password_token = req.params.token;
            // let currentDate = moment().format();
            let currentDate = await dateFormat.set_current_timestamp();
            var user = await User.findOne({ reset_password_token, reset_password_expires: { $gte: currentDate } });
            console.log(user);
            
            if (!user) {
                req.flash('error','Your link has been expired.');
            }
        }
        
        res.render('forgotPassword',{
            req: req,
            error : req.flash("error"),
		    success: req.flash("success"),
        });
        // res.status(200).send({
        //     status: constants.STATUS_CODE.SUCCESS,
        //     message: Message.resetPassword_token_success,
        //     error: false,
        //     data: {},
        // });
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.general_error_content,
            error: true,
            data: {},
        });
    }
}

exports.setNewPassword = async (req, res) => {
    backDURL=req.header('Referer') || '/';
    backURL=req.app.locals.base_url + '/api/v1/users/reset-password';
    try {
        const { new_password, reset_password_token } = req.body;
        // let currentDate = moment().format();
        let currentDate = await dateFormat.set_current_timestamp();
        if(!reset_password_token){
            req.flash('error','Your link has been expired.');
            return res.redirect(backURL);
        }
        
        //check token with expire time
        var user = await User.findOne({ reset_password_token, reset_password_expires: { $gte: currentDate } });       
        console.log(user)
        if (!user) {
            req.flash('error','Your link has been expired.');
            console.log(backURL)
            return res.redirect(backURL);
        }
        user.password = await bcrypt.hash(new_password, 10);
        user.reset_password_token = null;
        user.updated_at = await dateFormat.set_current_timestamp();
        await user.save();
        req.flash('success','Your password has been reset successfully');
        res.redirect(backURL);
    }
    catch (error) {
        console.log(error);
        req.flash('error','Exception: '+error.message);
        res.redirect(backURL);
        //res.status(400).send({ message: 'Unable to reset password', error: true, e: error });
    }
}

//logout user from single device
exports.logoutSingleDevice = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.LOGOUT_SUCCESS,
            error: false,
            data: {},
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.LOGOUT_FAILED,
            error: true,
            data: {},
        })
    }
}


//logout user from all devices
exports.logoutAllDevice = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: Message.LOGOUT_SUCCESS,
            error: false,
            data: {},
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.LOGOUT_FAILED,
            error: true,
            data: {},
        })
    }
}
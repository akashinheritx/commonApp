const bcrypt = require('bcryptjs');
const decode = require('jwt-decode')
const constants = require('../config/constants');
const commonMessage = require('../helper/commonMessage.helper');
const Message = commonMessage.MESSAGE;
const jwt = require('jsonwebtoken');
const keys = require('../keys/keys');
const dateFormat = require('../helper/dateFormate.helper');

const allMultipleDeviceLogin = constants.MULTIPLE_DEVICE_LOGIN || false;
const singleDeviceOnLoginLogOutOtherDevice = false;
const tokenExpireTime = constants.TOKEN_EXPIRE_TIME || '365d';

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
		trim: true
	},
	last_name: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		default : null,
	},
	dob: {
		type: String,
		default : null
	},
	user_type: {
		type: Number,
		required: true
	},
	mobile_number: {
		type: String,
		default: null
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	profile_pic: {
		type: String,
		default : null
	},
	created_at: {
		type: Number,
	},
	updated_at: {
		type: Number,
	},
	actual_updated_at: {
		type: Number,
	},
	deleted_at: {
		type: Number,
		default : null
	},
	reset_password_token: {
		type: String
	},
	reset_password_expires: {
		type: Number
	},
	otp: {
		type: Number
	},
	otp_expires: {
		type: Number
	},
	status: {
		type: Number,
		default: 0
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
},
	{
		collection: 'user_master'
	}
);

//checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

// find user by credentials 
userSchema.statics.findByCredential = async function (email, password) {
	const user = await User.findOne({ email, deleted_at:null });

	if (!user) {
		throw new Error('Unable to login');
	}

	if (!user.validPassword(password)){
        throw new Error('Invalid email or password')
    }

	return user;
}

// device login 
userSchema.statics.checkSettingForDeviceLogin = async function (token) {
	//restrict user to login if setting for multidevice login is off
    if(!allMultipleDeviceLogin){
        if(((token).length) > 1){
        	throw new Error(Message.MULTIPLE_DEVICE_LOGIN_NOT_ALLOWED);
        }
    }
}

// for generating token
userSchema.methods.generateToken = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id.toString() }, keys.JWT_SECRET,{
		expiresIn: tokenExpireTime
	  });
	//all multiple device to login with same credential
	if(allMultipleDeviceLogin){
		user.tokens = user.tokens.concat({ token });
		await user.save();
		return token;
	}else{
		//on device other device login logout from all other devices
		if(singleDeviceOnLoginLogOutOtherDevice){
			user.tokens = [];
			user.tokens = user.tokens.concat({ token });
			await user.save();
			return token;
		}else{
			//if token not exist then add token else same token will remain as it is.
			if(((user.tokens).length) == 0){
				user.tokens = user.tokens.concat({ token });
				await user.save();
				return token;
			}else if(user.tokens.length>0){
			const decoded = decode(user.tokens[0].token)
			currentTime = await dateFormat.set_current_timestamp_in_seconds();
			console.log(decoded.exp < currentTime);
			if(decoded.exp < currentTime){
				user.tokens = [];
				user.tokens = user.tokens.concat({ token });
				await user.save();
				return token;
			}else{
				//if token is not esxpired then it will come here
			}
			}
		}
	}
}

// to send minimal objects
userSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();
	return userObj;
}

const User = mongoose.model('user_master', userSchema);
module.exports = User;
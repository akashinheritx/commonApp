const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true})
var _ = require('lodash');
const { validationResult } = require('express-validator');

const constants = require('../config/constants');

//resize image
exports.resizeImage = function(imagePath){
    gm(imagePath)
        .resize(240,240)
        .gravity('Center')
        // .extent(width,height)
        .noProfile()
        .write(imagePath, function (err) {
            if (err) {
                console.log(err)
                throw new Error();
            }
        });
}

//remove files
exports.removeFile = function(delPath){
    if (fs.existsSync(delPath)) {
        fs.unlinkSync(delPath);
    }
}

//replace string with object keys and value
exports.replaceStringWithObjectData = function(str, object){
	if(!_.isEmpty(object)){
		stringStartSymbol = (typeof(constants.ENCRYPT_STRING.START_SYMBOL)===undefined) ? '{!{' : constants.ENCRYPT_STRING.START_SYMBOL

		stringEndSymbol = (typeof(constants.ENCRYPT_STRING.END_SYMBOL)===undefined) ? '}!}' : constants.ENCRYPT_STRING.END_SYMBOL

		for (data in object) {
			msg = stringStartSymbol+data+stringEndSymbol
			str = str.replace(msg, object[data])
		}
		return str;
	}
	return "";
}

//generate random otp
exports.generateRandomOtp = function(){
    otp = Math.floor((Math.random()*999999)+111111)
    return otp;
}

// show validation error message
exports.validatorFunc = (req, res, next) => {
    let errArray = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(422).send({
          statusCode:constants.STATUS_CODE.VALIDATION,
          message: errors.array()[0].msg,
          error: true,
          data:{}
        });

    }
    next();
  };
const keys = require('../../keys/keys');
const constants = require('../../config/constants');
const commonFunction = require('../../helper/commonFunction.helper');
const commonMessage = require('../../helper/commonMessage.helper');
const sendSMS = require('../../services/sendSMS.service');

exports.sendTextMessage = async (req, res) => {
    try{
        data = {
            name : "viral raval",
            amount : 100000
        }

        textContent = await commonFunction.replaceStringWithObjectData(commonMessage.SMS.WELCOME_MESSAGE,data)

        data = await sendSMS('+918347587797',textContent);

        res.status(200).send({
            status: constants.STATUS_CODE.SUCCESS,
            message: commonMessage.MESSAGE.TWILIO_SMS_SEND_SUCCESS,
            error: false,
            data : data
        });
    }catch(error){
        console.log(error)
        res.status(400).send({
            status: constants.STATUS_CODE.FAIL,
            message: commonMessage.MESSAGE.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });
    }
}
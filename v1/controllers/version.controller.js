const VersionNumber = require('../../models/version.model');
const User = require('../../models/user.model');
const dateFormat = require('../../helper/dateFormate.helper');
const constants = require('../../config/constants');
const commonMessage = require('../../helper/commonMessage.helper');
const commonFunction = require('../../helper/commonFunction.helper');
const notificationService = require('../../services/notification');
const logService = require('../../services/log.service');
const Message = commonMessage.MESSAGE;

//create Version
exports.createVersion = async (req, res) => {

    try{
        let reqdata = req.body;

        var version = (reqdata.versionNumber).trim()
        
        var regex = new RegExp('^' + version.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
        
        var isversionNumberExist = await VersionNumber.findOne({$and:[{versionNumber: {$regex : regex}}, {deviceType: reqdata.deviceType}]});
        
        if(isversionNumberExist){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.VERSION_ALREADY_EXISTS,
                error: true,
                data: {},
            });
        }

        var isversionNumberLower = await VersionNumber.findOne({$and:[{versionNumber:{$gte:version}}, {deviceType: reqdata.deviceType}]})
        if(isversionNumberLower){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.VERSION_NUMBER_LOWER,
                error: true,
                data: {},
            });
        }

        versionNum = new VersionNumber();
        versionNum.versionNumber = reqdata.versionNumber;
        versionNum.deviceType = reqdata.deviceType;
        versionNum.isForceUpdate = reqdata.isForceUpdate;
        versionNum.created_at = dateFormat.set_current_timestamp();
        versionNum.updated_at = dateFormat.set_current_timestamp();

        let versionNumData = await versionNum.save();
        if(versionNumData){
            d_type = new RegExp(versionNumData.deviceType, 'i');
            //Send Notification
            var user = await User.find({deviceType:d_type});
            for(i=0;i<user.length;i++){
                console.log(i);
                if(user[i].deviceToken){
                    var message = 'Dear Mooer, There is new features availbale for this app please update your app.'
                    await notificationService.sendNotification(user[i]._id, message, 'Update App', user[i].deviceToken, user[i].deviceType);
                    console.log('notification send');                    
                }else{
                    console.log('device token not available');
                }
            }
        }
        res.status(201).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.VERSION_NUMBER_CREATED_SUCCESS,
            error: false,
            data : versionNumData
        });

        logService.responseData(req, versionNumData);

    }catch(error){
        console.log(error)
        
        res.status(400).send({
            status:constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data:{}
        });

        logService.responseData(req, error);
    }
}

//get all version number data
exports.getAllVersionData = async (req, res) => {

    try{
        VersionData = await VersionNumber.find()
        
        if(VersionData.length <=0){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_VERSION_DETAILS_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.VERSION_DETAIL_RETRIEVE,
            error: false,
            data : VersionData
        });

        logService.responseData(req, VersionData);

    }catch(error){
        console.log(error)
        
        res.status(400).send({
            status:constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data:{}
        });

        logService.responseData(req, error);
    }
}
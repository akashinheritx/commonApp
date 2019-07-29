const SMSFormat = require('../../models/smsTemplate.model');
const dateFormat = require('../../helper/dateFormate.helper');
const constants = require('../../config/constants');
const commonMessage = require('../../helper/commonMessage.helper');
const commonFunction = require('../../helper/commonFunction.helper');
const logService = require('../../services/log.service');

const Message = commonMessage.MESSAGE;

//create SMS template
exports.createSMSTemplate = async (req, res) => {

    try{
        let reqdata = req.body;

        var smsTemplateTitle = (reqdata.title).trim()
        var regex = new RegExp('^' + smsTemplateTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
        var isTemplateExist = await SMSFormat.findOne({title: {$regex : regex}});
        
        if(isTemplateExist){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.TITLE_ALREADY_EXISTS,
                error: true,
                data: {},
            });
        }
        
        var getId = await SMSFormat.aggregate([{$group : {_id : null, id_max : {$max : "$id"}}}]);
        if(getId.length<=0){
            var id = 0;    
        }else{
            var id = getId[0].id_max+1;
        }
    
        smsTemplate = new SMSFormat();
        smsTemplate.id = id;
        smsTemplate.title = reqdata.title;
        smsTemplate.keys = reqdata.keys;
        smsTemplate.subject = reqdata.subject;
        smsTemplate.body = reqdata.body;
        smsTemplate.status = reqdata.status;
        smsTemplate.created_at = dateFormat.set_current_timestamp();
        smsTemplate.updated_at = dateFormat.set_current_timestamp();

        let smsTemplateData = await smsTemplate.save();

        res.status(201).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.SMS_TEMPLATE_CREATED_SUCCESS,
            error: false,
            data : smsTemplateData
        });

        logService.responseData(req, smsTemplateData);

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

//get single SMS Template
exports.getSingleSMSTemplate = async (req, res) => {

    try{
        SMSTemplate = await SMSFormat.findById(req.params.id)
        
        if(!SMSTemplate){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_SMS_TEMPLATE_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.SMS_TEMPLATE_RETRIEVE,
            error: false,
            data : SMSTemplate
        });

        logService.responseData(req, SMSTemplate);

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

//get all SMS Templates
exports.getAllSMSTemplate = async (req, res) => {

    try{
        SMSTemplateData = await SMSFormat.find()
        
        if(SMSTemplateData.length <=0){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_SMS_TEMPLATE_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.SMS_TEMPLATE_RETRIEVE,
            error: false,
            data : SMSTemplateData
        });

        logService.responseData(req, SMSTemplateData);

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

//update SMS template
exports.updateSMSTemplate = async (req, res) => {

    try{
        let reqdata = req.body;

        smsFormatData = await SMSFormat.findById(req.params.id)

        if(!smsFormatData){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_SMS_TEMPLATE_EXISTS,
                error: true,
                data: {},
            });
        }

        var smsTemplateTitle = (reqdata.title).trim()
        var regex = new RegExp('^' + smsTemplateTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
        var isTemplateTitle = await SMSFormat.findOne({title: {$regex : regex}, _id: { 
            $ne: req.params.id
        },});
        
        if(isTemplateTitle){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.TITLE_ALREADY_EXISTS,
                error: true,
                data: {},
            });
        }

        smsFormatData.title = reqdata.title;
        smsFormatData.keys = reqdata.keys;
        smsFormatData.subject = reqdata.subject;
        smsFormatData.body = reqdata.body;
        smsFormatData.status = reqdata.status;
        smsFormatData.created_at = dateFormat.set_current_timestamp();
        smsFormatData.updated_at = dateFormat.set_current_timestamp();

        let updatedSMSFormatData = await smsFormatData.save();

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.SMS_TEMPLATE_UPDATED_SUCCESS,
            error: false,
            data : updatedSMSFormatData
        });

        logService.responseData(req, updatedSMSFormatData);

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

//delete SMS Template
exports.deleteSMSTemplate = async (req, res) => {

    try{
        DeletedSMSTemplate = await SMSFormat.findByIdAndDelete(req.params.id)
        
        if(!DeletedSMSTemplate){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_SMS_FORMAT_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.SMS_TEMPLATE_DELETED,
            error: false,
            data : DeletedSMSTemplate
        });

        logService.responseData(req, DeletedSMSTemplate);

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
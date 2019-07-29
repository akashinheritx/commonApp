const EmailFormat = require('../../models/emailTemplate.model');
const dateFormat = require('../../helper/dateFormate.helper');
const constants = require('../../config/constants');
const commonMessage = require('../../helper/commonMessage.helper');
const commonFunction = require('../../helper/commonFunction.helper');
const logService = require('../../services/log.service');

const Message = commonMessage.MESSAGE;

//create email template
exports.createEmailTemplate = async (req, res) => {

    try{
        let reqdata = req.body;

        var emailTemplateTitle = (reqdata.title).trim()
        var regex = new RegExp('^' + emailTemplateTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
        var isTemplateExist = await EmailFormat.findOne({title: {$regex : regex}});
        
        if(isTemplateExist){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.TITLE_ALREADY_EXISTS,
                error: true,
                data: {},
            });
        }

        var getId = await EmailFormat.aggregate([{$group : {_id : null, id_max : {$max : "$id"}}}]);
        if(getId.length<=0){
            var id = 0;    
        }else{
            var id = getId[0].id_max+1;
        }
    
        emailFormat = new EmailFormat();
        emailFormat.id = id;
        emailFormat.title = reqdata.title;
        emailFormat.keys = reqdata.keys;
        emailFormat.subject = reqdata.subject;
        emailFormat.body = reqdata.body;
        emailFormat.status = reqdata.status;
        emailFormat.created_at = dateFormat.set_current_timestamp();
        emailFormat.updated_at = dateFormat.set_current_timestamp();

        let emailFormatData = await emailFormat.save();

        res.status(201).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.EMAIL_FORMAT_CREATED_SUCCESS,
            error: false,
            data : emailFormatData
        });

        logService.responseData(req, emailFormatData);

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

//get single Email Template
exports.getSingleEmailTemplate = async (req, res) => {

    try{
        EmailTemplate = await EmailFormat.findById(req.params.id)
        
        if(!EmailTemplate){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_EMAIL_FORMAT_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.EMAIL_TEMPLATE_RETRIEVE,
            error: false,
            data : EmailTemplate
        });

        logService.responseData(req, EmailTemplate);

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

//get all Email Templates
exports.getAllEmailTemplate = async (req, res) => {

    try{
        EmailTemplateData = await EmailFormat.find()
        
        if(EmailTemplateData.length <=0){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_EMAIL_FORMAT_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.EMAIL_TEMPLATE_RETRIEVE,
            error: false,
            data : EmailTemplateData
        });

        logService.responseData(req, EmailTemplateData);

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

//update email template
exports.updateEmailTemplate = async (req, res) => {

    try{
        let reqdata = req.body;

        emailFormatData = await EmailFormat.findById(req.params.id)

        if(!emailFormatData){
            return res.status(500).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_EMAIL_FORMAT_EXISTS,
                error: true,
                data: {},
            });
        }

        var emailTemplateTitle = (reqdata.title).trim()
        var regex = new RegExp('^' + emailTemplateTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
        var isTemplateTitle = await EmailFormat.findOne({title: {$regex : regex}, _id: { 
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

        emailFormatData.title = reqdata.title;
        emailFormatData.keys = reqdata.keys;
        emailFormatData.subject = reqdata.subject;
        emailFormatData.body = reqdata.body;
        emailFormatData.status = reqdata.status;
        emailFormatData.created_at = dateFormat.set_current_timestamp();
        emailFormatData.updated_at = dateFormat.set_current_timestamp();

        let updatedEmailFormatData = await emailFormatData.save();

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.EMAIL_FORMAT_UPDATED_SUCCESS,
            error: false,
            data : updatedEmailFormatData
        });

        logService.responseData(req, updatedEmailFormatData);

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

//delete Email Template
exports.deleteEmailTemplate = async (req, res) => {

    try{
        DeletedEmailTemplate = await EmailFormat.findByIdAndDelete(req.params.id)
        
        if(!DeletedEmailTemplate){
            return res.status(404).send({
                status:constants.STATUS_CODE.FAIL,
                message: Message.NO_EMAIL_FORMAT_EXISTS,
                error: true,
                data: {},
            });
        }

        res.status(200).send({
            status:constants.STATUS_CODE.SUCCESS,
            message: Message.EMAIL_TEMPLATE_DELETED,
            error: false,
            data : DeletedEmailTemplate
        });

        logService.responseData(req, DeletedEmailTemplate);

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
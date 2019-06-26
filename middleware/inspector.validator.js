const constant = require('../config/constants');

const addInspectorValidate = async(req,res,next) =>{
    try{
        const { email,user_name,mobile_number } = req.body;
        if(!email) {
            return res.status(400).send({
                status: constant.STATUS_CODE.FAIL,
                message: 'Email is required',
                error: true,
                data: {}
            });
        }else{
            let isValidEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(email);
            if(!isValidEmail){
                return res.status(400).send({
                    status: constant.STATUS_CODE.FAIL,
                    message: 'Email is not valid',
                    error: true,
                    data: {}
                }); 
            }
        }
        if(!user_name){
            return res.status(400).send({
                status: constant.STATUS_CODE.FAIL,
                message: 'User name is required',
                error: true,
                data: {}
            });
        }
        if(!mobile_number){
            return res.status(400).send({
                status: constant.STATUS_CODE.FAIL,
                message: 'Mobile number is required',
                error: true,
                data: {}
            });
        }else{
            let isValidPhone = /^[2-9]{2}[0-9]{8}$/.test(mobile_number);
            if(!isValidPhone){
                return res.status(400).send({
                    status: constant.STATUS_CODE.FAIL,
                    message: 'Not valid mobile number',
                    error: true,
                    data: {}
                }); 
            }
        }
        next();
    } catch(e){
        res.status(400).send({
            status: constant.STATUS_CODE.FAIL,
            message: 'Somethig went wrong',
            error: true,
            data: {}
        }); 
    }
}



module.exports = {
    addInspectorValidate
}
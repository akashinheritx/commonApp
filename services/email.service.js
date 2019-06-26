const sgMail = require('@sendgrid/mail');

const constants=require('../config/constants');

sgMail.setApiKey(constants.SENDGRID_API_KEY);

//Set up email service
const sendMail = async (to, subject, body) => {
    try {
        const msg = {
            to: to,
            from: constants.EMAIL_FROM,
            subject: subject,
            html:body
        }
        await sgMail.send(msg);
        return true;
    }
    catch (err) {
        console.log(err);
        
        throw new Error('Email could not be send.');
    }
}

module.exports = sendMail;
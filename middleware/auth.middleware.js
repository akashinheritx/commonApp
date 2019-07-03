const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const constants = require('../config/constants');
const commonMessage = require('../helper/commonMessage.helper');
const keys = require('../keys/keys');

const Message = commonMessage.MESSAGE;

let auth = async function (req, res, next) {
    try {
        // var token = req.headers['x-access-token'];
        const token = req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            throw new Error('No token provided.');
        }
        const decoded = jwt.verify(token, keys.JWT_SECRET);
        
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if (!user) {
            return res.status(401).send({
                status: constants.STATUS_CODE.FAIL,
                message: Message.UNAUTHRIZED_LOGIN,
                error: true,
                data: {},
            });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send({
            status: constants.STATUS_CODE.FAIL,
            message: Message.GENERAL_CATCH_MESSAGE,
            error: true,
            data: {},
        });
    }
}

module.exports = auth;
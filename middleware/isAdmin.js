const constant = require('../config/constants');
const message = require('../helper/commonMessage');

const isAdmin = async (req, res, next) => {
    const user_type = req.user.user_type;
    if (user_type !== 1) {
        return res.status(401).send({
            status: constant.STATUS_CODE.FAIL,
            message: message.invalid_user,
            error: true,
            data: {},
        });
    }
    next();
}

module.exports = isAdmin;


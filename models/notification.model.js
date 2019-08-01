const mongoose = require('mongoose');
const moment = require('moment');
var mongoosePaginate = require('mongoose-paginate');

var notificationSchema = new mongoose.Schema({
    notification: {
        type: String,
        required: true
    },
    notificationDateTime: {
        type: Number,
        required: true,
    },
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isRead: {
        type: Number,
        default: 0
    }
});
notificationSchema.plugin(mongoosePaginate);
var Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
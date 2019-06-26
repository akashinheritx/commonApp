const mongoose = require('mongoose');

var loggerSchema = new mongoose.Schema({
    url: {
        type: String,
        default: null
    },
    orginalUrl: {
        type: String,
        default: null
    },
    method: {
        type: String,
        default: null
    },
    body: {
        type: Object,
        default: null
    },
    response:{
        type:Object,
        default:null
    },
    created_at: {
        type: Number,
    },
    logged_in_user: {
        type: String,
        default: null
    }
});
var Logger = mongoose.model('Loggger', loggerSchema);
module.exports = Logger;
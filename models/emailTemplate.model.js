const mongoose = require('mongoose');

var emailSchema = new mongoose.Schema({
    id:{
        type: Number,
    },
    title: {
        type: String,
        default: null,
        trim: true,
    },
    keys:{
        type: String,
        default: null,
        trim: true,
    },
    subject: {
        type: String,
        default: null,
        trim: true,
    },
    body: {
        type: String,
        default: null,
        trim: true,
    },
    status:{
        type:Number,
        default:null
    },
    created_at: {
        type: Number,
    },
    updated_at: {
        type: Number,
    },
});
var EmailFormat = mongoose.model('email_formats', emailSchema);
module.exports = EmailFormat;
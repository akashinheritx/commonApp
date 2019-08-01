const mongoose = require('mongoose');

var versionSchema = new mongoose.Schema({
    versionNumber: {
        type: String,
        default: null,
        trim: true,
    },
    deviceType: {
        type: String,
        default: null,
        trim: true,
    },
    isForceUpdate: {
        type: Number,
        default: null,
        trim: true,
    },
    created_at: {
        type: Number,
    },
    updated_at: {
        type: Number,
    },
});
var VersionNumber = mongoose.model('version_numbers', versionSchema);
module.exports = VersionNumber;
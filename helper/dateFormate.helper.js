const moment = require('moment');

//return current timestamp in milli seconds
exports.set_current_timestamp = function(){
    return moment().format("x");
}

exports.getDateFormatFromTimeStamp = function(dt){
    return moment.unix(dt).format("MM/DD/YYYY")    
}
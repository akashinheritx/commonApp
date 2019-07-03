const moment = require('moment');

//return current timestamp in milli seconds
exports.set_current_timestamp = function(){
    return moment().format("x");
}

//return current timestamp in seconds
exports.set_current_timestamp_in_seconds = function(){
    return moment().format("X");
}

exports.getDateFormatFromTimeStamp = function(dt){
    return moment.unix(dt).format("MM/DD/YYYY")    
}

//add time to current timestamp
exports.add_time_to_current_timestamp = function(number,timeformat){
    return moment().add(number,timeformat).format("x");
}
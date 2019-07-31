const mongoose = require('mongoose')

const socialSchema = new mongoose.Schema({
    method:{
        type:String,
        enum:['google','facebook'],
        required:true
    },
    google:{
        id:{
            type:String
        },
        name:{
            type:String,
            lowercase:true
        },
        email:{
            type:String,
            lowercase:true
        },
        token:{
            type:String
        },
    },
    facebook:{
        id:{
            type:String
        },
        name:{
            type:String,
            lowercase:true
        },
        email:{
            type:String,
            lowercase:true
        },
        token:{
            type:String
        },
    }
});

const Social = new mongoose.model('socials', socialSchema)
module.exports = Social
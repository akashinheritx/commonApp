const multer = require('multer');
const path = require('path');

const constants = require('../config/constants');

//store for profile image

var profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    profileImgPath = constants.PROFILE_IMG_PATH;
     cb(null, profileImgPath)
    },
     filename: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
           return cb(new Error('Please upload a vaild image file'));
        }
        var ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now()+ext)
    },
    limits: {
        fileSize: 1000000
    }
});
var profileUpload = multer({storage: profileStorage}).single('profile_pic');
module.exports = profileUpload
global.mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/user.model');
const dateFormat = require('../helper/dateFormate.helper');
const keys = require('../keys/keys');

mongoose.connect(keys.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
}).then(() => {
    console.log('Database is connected');
}, err => {
    console.log('Can not cannect to the database', err);
});

mongoose.connection.on('connected', async () => {
    // console.log('Connected');
    /*try {
        const checkAdmin = await User.findOne({
            email: 'admin@t2d2.com'
        });
        if (!checkAdmin) {
            const admin = new User({
                user_name : 'admin',
                email: 'admin@t2d2.com',
                password: 'admin@123',
                mobile_number : '7894561230',
                user_type : 1,
                created_at: dateFormat.set_current_timestamp()
            });
            let users = await admin.save();
            console.log('Admin is created');
        }
    } catch (e) {
        console.log(e);
    }*/
});

mongoose.connection.on('error', function (err) {
    console.log('Mongodb connection failed. ' + err);
});

module.exports = mongoose;
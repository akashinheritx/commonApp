FCM = require('fcm-node');
const Notification = require('../models/notification.model');
const dateFormat = require('../helper/dateFormate.helper');

var SERVER_API_KEY = 'AAAAG_YwJGk:APA91bGM-iFdxIHrcvzBma44z59f2q_v5ezkHJYO0tj61BmZxV4yPkR4Q8cfDD6qVIthUyT17sOsqkxZPd4HYLsj7kre6GZzzFHyKnpUhcqnw3xBYLHxsNo8Z7A5apMQ0rdi84O1vOo4';//put your api key here
var fcmCli = new FCM(SERVER_API_KEY);

exports.sendNotification = async function (userid, message, title, token) {
try {
    if(token){
        // Create Payload to send Notification
            var notificationPayload = {
                to: token,
                priority: 'high',
                content_available: true,
                notification: { //notification object
                    title: title, body: message, sound: "default"/*, badge: notificationCount*/
                }
            };
            fcmCli.send(notificationPayload, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!")
                } else {
                    console.log("Successfully sent with response: ", response)
                }
            })
    }
            //  Save Notification in Database
            if (userid){
                const notificationCreate = await new Notification({
                    notification: message,
                    _userId: userid,
                    notificationDateTime: dateFormat.set_current_timestamp(),

                });
                notificationCreate.save();
            }
} catch (error) {
    throw Error(error);
}
}
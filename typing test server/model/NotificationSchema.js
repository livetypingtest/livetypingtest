require('../config/DataBase')
const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema({

    userId: String,
    fcmToken: { type : String, default : '' }

}, { collection : "notification" });

module.exports = mongoose.model('notification', NotificationSchema);  
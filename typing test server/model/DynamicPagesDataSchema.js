require('../config/DataBase')
const mongoose = require('mongoose')

const DynamicPagesDataSchema = mongoose.Schema({

    termsCondition : {
        createdat : { type: Date, default: '' },
        title : { type : String, default : '' },
        content : { type : String, default : '' },
    },
    privacyPolicy : {
        createdat : { type: Date, default: '' },
        title : { type : String, default : '' },
        content : { type : String, default : '' },
    },
    about : {
        createdat : { type: Date, default: '' },
        metaData : [
            {
                title : { type : String, default : '' },
                content : { type : String, default : '' },
                imageUrl : { type : String, default : '' },
                button : {
                    title : { type : String, default : '' },
                    url : { type : String, default : '' },
                }
            }
        ]
    },
    homePageSEO : {
            index : { type : String, default : '' },
            seoDescription : { type : String, default : '' },
            seoTitle : { type : String, default : '' },
            imageUrl : { type : String, default : '' },
            imageKey : { type : String, default : '' },
    },
    manageAds : {
        adsClientID: { type: String, default: '' },
        adSlot: { type: String, default: '' }
    },
    contact : [{
        name : { type : String, default : '' },
        email : { type : String, default : '' },
        message : { type : String, default : '' },
        senderid : { type : String, default : '' },
        reply : { type : String, default : '' },
        time : { type : Date, default : Date.now() },
        status : { type : String, default : 'unseen' },
    }],
    googleAnalytics: {
        trackingId: { type: String, default: '' }
    }

}, { collection : "dynamiPages" });

module.exports = mongoose.model('dynamiPages', DynamicPagesDataSchema);  
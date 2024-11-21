require('../config/DataBase')
const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({

    username : String,
    email : String,
    password : String,
    role : { type : String, default : 'admin' },
    blockUser : [{
        accountid : { type : String, default : '' }
    }],
    paragraphs: {
        Min1: {
            easy: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            medium: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            hard: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ]
        },
        Min3: {
            easy: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            medium: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            hard: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ]
        },
        Min5: {
            easy: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            medium: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ],
            hard: [
                {
                    id: { type: String, required: true },
                    para: { type: String, required: true }
                }
            ]
        },
    },
    blog : [
        {
            title : { type : String, default : '' },
            content : { type : String, default : '' },
            status : { type : String, default : '' },
            index : { type : String, default : '' },
            seoDescription : { type : String, default : '' },
            seoTitle : { type : String, default : '' },
            description : { type : String, default : '' },
            permalink : { type : String, default : '' },
            category : { type : Array, default : [] },
            tags : { type : Array, default : [] },
            createdat : { type : Date, default : Date.now() },
            featuredImage : {
                name : { type : String, default : '' },
                path : { type : String, default : '' }
            }
        }
    ],
    profileimage : {
        originalname : { type : String, default : '' },
        s3key : { type : String, default : '' },
        s3url : { type : String, default : '' },
        updatedat : { type : Date, default : new Date() },
    },
    blogCategory : { type : Array, default : [] }


}, { collection : "admindata" });

module.exports = mongoose.model('admindata', AdminSchema);  
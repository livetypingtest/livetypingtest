const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const userModel = require('../model/UserSchema')
const adminModel = require('../model/AdminSchema')
const DataModel = require('../model/DynamicPagesDataSchema')
const notificationModel = require('../model/NotificationSchema')
const key = require('../config/token_Keys');
const randNum = require('random-number')
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config(); 
const nodemailer = require("nodemailer");
const { S3Client, PutObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');


const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0; // Avoid division by zero
    const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
    return sum / numbers.length; // Return the average
};


// Initialize AWS S3 client using v3 SDK
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  // Multer S3 storage configuration
  const storage = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const newFilename = `profile/${uniqueSuffix}${extension}`;
      cb(null, newFilename); // S3 key (path within the bucket)
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Function to delete an existing image from S3
  const deleteImageFromS3 = async (imageKey) => {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand); // Using the v3 SDK method
      console.log("Existing profile image deleted from S3 successfully.");
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  };
  

route.get('/local', async (req, res) => {
    try {
        const adminData = await adminModel.find({}).lean(); // Use .lean() for better performance if you don't need Mongoose documents

        // Check if adminData exists and has at least one item
        if (!adminData.length) {
            return res.status(404).send({ status: 404, message: 'No admin data found' });
        }
        const homePageSEO = await DataModel.findOne({}, { homePageSEO: 1, _id: 0 });
        const blogData = adminData[0]?.blog || []; // Fallback to an empty array if blog is undefined
        const filteredBlogData = blogData.filter(value => value.status === 'Published'); // Filter published blogs
        
        const localData = {
            paragraphs: adminData[0]?.paragraphs || [], // Fallback to empty array if paragraphs is undefined
            blog: filteredBlogData,
            blogCategory: adminData[0]?.blogCategory || [], // Fallback to empty array if blogCategory is undefined
            homePageSEO : homePageSEO?.homePageSEO
        };

        res.status(200).send({ status: 200, localData }); // Send successful response
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ status: 500, message: 'Internal server error' }); // Handle server errors
    }
});


route.get('/', async(req, res) => {
    // console.log(req.headers.authorization)
    if(req.headers.authorization){
        let ID = jwt.decode(req.headers.authorization, key)
        // console.log(ID.id)
        let userData = await userModel.findOne({_id : ID?.id})
        const adminData = await adminModel.find({})
        if(userData) {
            userData = {
                accountid : userData?.accountid,
                createdate : userData?.createdate,
                email :  userData?.email,
                highestrecord1min :  userData?.highestrecord1min,
                highestrecord3min : userData?.highestrecord3min,
                highestrecord5min : userData?.highestrecord5min,
                match_1 : userData?.match_1, 
                match_3 : userData?.match_3, 
                match_5 : userData?.match_5, 
                password : userData?.password ,
                profileimage : userData?.profileimage,
                top1minavg : userData?.top1minavg,
                top3minavg : userData?.top3minavg,
                top5minavg : userData?.top5minavg, 
                username : userData?.username,
                isblock : userData?.isblocked?.status,
                authType :userData?.authType,
            }
            res.send({ status : 200, userdata : userData })
        }else{
            res.send({status : 403})
        }
    }
});

route.get('/dashdata/:limit/:type', async (req, res) => {
    const fetchFilteredData = async (filterType, limit) => {
        const levels = ['all', 'easy', 'medium', 'hard'];
        const queries = levels.map(level => ({
            [`${filterType}.${level}.avgwpm`]: { $gt: 40 },
            [`${filterType}.${level}.avgconsis`]: { $gt: 8 },
            [`${filterType}.${level}.avgacc`]: { $gt: 90 }
        }));

        const results = await userModel.find({
            $or: queries
        });

        return results;
    };

    const limit = parseInt(req.params.limit, 10);
    const type = req.params.type;

    const typeMap = {
        '1': 'top1minavg',
        '3': 'top3minavg',
        '5': 'top5minavg'
    };

    const matchMap = {
        '1': 'match_1',
        '3': 'match_3',
        '5': 'match_5'
    };

    const filterType = typeMap[type];
    const matchType = matchMap[type];

    if (!filterType || !matchType) {
        return res.status(400).send({ message: 'Invalid type provided' });
    }

    const allUser = await fetchFilteredData(filterType, limit);

    const extractLevelData = (matchData, level) => {
        const filteredData = matchData?.filter(value => value.level === level);
        return {
            avgWpm: calculateAverage(filteredData.map(value => parseFloat(value.avgwpm))),
            avgAcc: calculateAverage(filteredData.map(value => parseFloat(value.avgacc))),
            avgConsis: calculateAverage(filteredData.map(value => parseFloat(value.avgconsis))),
        };
    };

    const filteredData = allUser.map(user => {
        const matchData = user[matchType] || [];

        // Extract data for easy, medium, and hard levels
        const easyData = extractLevelData(matchData, 'easy');
        const mediumData = extractLevelData(matchData, 'medium');
        const hardData = extractLevelData(matchData, 'hard');

        // Return the structured response with overall and levels data
        return {
            username: user?.username,
            profile: user?.profileimage,
            overall: {
                avgWpm: calculateAverage(matchData.map(value => parseFloat(value.avgwpm))),
                avgAcc: calculateAverage(matchData.map(value => parseFloat(value.avgacc))),
                avgConsis: calculateAverage(matchData.map(value => parseFloat(value.avgconsis))),
            },
            levels: {
                easy: easyData,
                medium: mediumData,
                hard: hardData,
            }
        };
    });

    // Sort users based on overall performance in descending order for ranking
    const sortedData = filteredData.sort((a, b) => {
        // Ranking priority: avgWpm > avgConsis > avgAcc
        const scoreA = a.overall.avgWpm * 0.5 + a.overall.avgConsis * 0.3 + a.overall.avgAcc * 0.2;
        const scoreB = b.overall.avgWpm * 0.5 + b.overall.avgConsis * 0.3 + b.overall.avgAcc * 0.2;
        return scoreB - scoreA;
    });

    // Slice the top 100 users
    const top100 = sortedData.slice(0, 100);

    // Add ranking to the data
    const rankedData = top100.map((user, index) => ({
        rank: index + 1,
        ...user
    }));

    res.send({ status: 200, userData: rankedData, type: "leaderboard", message: "Leaderboard Data" });
});


route.post('/signin/google', async(req, res) => {
    const token = Object.keys(req.body)[0];
    // Fetch user information from Google's Userinfo API
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const userInfo = await userInfoResponse.json();
    const {email_verified, email} = userInfo;
    const isUserExist = await userModel.findOne({email : email})
    if(isUserExist) {
        if(email_verified) {
            if(!isUserExist?.isblocked?.status) {
                const ID = {id : isUserExist?._id};
                const token = jwt.sign(ID, key)
                res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
            } else res.send({ status : 402, message : "Your Account is blocked", type : 'block-unblock' })
        }
    } else res.send({ status : 401, message : "Email ID is Invalid", type : 'signin' })
    
});

route.post('/signin', async(req, res) => {
    const { signin, password, type } = req.body;
    let isUserExist;
    if(type === 'username') {
        isUserExist = await userModel.findOne({ username : signin }) 
    } else {
        isUserExist = await userModel.findOne({ email : signin }) 
    }
    if(isUserExist) {
        if(sha(password) === isUserExist?.password) {
            if(!isUserExist?.isblocked.status) {
                const ID = {id : isUserExist?._id};
                const token = jwt.sign(ID, key)
                res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
            } else res.send({ status : 402, message : "Your Account is blocked", type : 'block-unblock' })
        } else res.send({ status : 402, message : "Password is Incorrect", type : 'signin' })
    } else res.send({ status : 401, message : "Email ID is Invalid", type : 'signin' })
});

route.post('/signup/google', async(req, res) => {

    const {token, createdate} = req.body;
    // Fetch user information from Google's Userinfo API
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const userInfo = await userInfoResponse.json();
    const {email_verified, email} = userInfo;
    const username = email?.split('@')[0]
        const isUserExist = await userModel.findOne({ email : email })
        if(!isUserExist) {
            if(email_verified) {
                const accountID = randNum.generator({ min : 100000, max : 9999999, integer : true });
                const finalData = {
                    username : username,
                    email : email,
                    createdate : createdate,
                    accountid : accountID(),
                    googleId : token,
                    authType : {google : true, email : false}
                }

                // sending mail--------------------
                // Create a Nodemailer transporter using your Gmail account
                const transporter = nodemailer.createTransport({
                    host: "smtp-relay.brevo.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.BREVO_SMTP_MAIL,
                        pass: process.env.BREVO_SMTP_API_KEY
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                const message = {
                    line1: "Thank you for joining LiveTypingTest! We're delighted to have you on board.",
                    line2: "If you have any questions or need support, feel free to reach out to us anytime.",
                    line3: "Wishing you a fantastic journey with us!",
                    designation: "Best Regards",
                }
            
                const htmlContent = `<html><body>
                    <table style="text-align: left">
                        <tr><th>${message.line1}</th></tr>
                        <tr><th>${message.line2}</th></tr>
                        <tr><th>${message.line3}</th></tr>
                        <tr><th>${message.designation}</th></tr>
                        <tr><th>Admin</th></tr>
                    </table>
                    </body></html>`;
                
                    await transporter.sendMail({
                        from: `"Live Typing Test" <${process.env.BREVO_SENDER_MAIL}>`,
                        to: email,
                        subject: `Welcome to LiveTypingTest! 🎉`,
                        html: htmlContent
                    });
                // sending mail--------------------


                // console.log(finalData)
            await userModel.create(finalData)
            const getUser = await userModel.findOne({ email : email })
            await notificationModel.create({userId : getUser?._id, fcmToken : ''})
            const ID = {id : getUser?._id};
            const userToken = jwt.sign(ID, key)
            res.send({ status : 200, token : userToken, message : "Signup Successfully", type : 'signup' })
            }
        } else res.send({ status : 402, message : "Email ID Exist", type : 'signup' }) 

})

route.post('/signup', async(req, res) => {
    const { email, username, password, createdate } = req.body;

    const checkUserName = await userModel.findOne({ username : username })
    if(!checkUserName) {
        const checkEmail = await userModel.findOne({ email : email })
        if(!checkEmail) {
            const accountID = randNum.generator({ min : 100000, max : 9999999, integer : true });
            const finalData = {
                username : username,
                email : email,
                password : sha(password),
                createdate : createdate,
                accountid : accountID(),
                authType : {google : false, email : true}
            }

            // sending mail--------------------
                // Create a Nodemailer transporter using your Gmail account
                const transporter = nodemailer.createTransport({
                    host: "smtp-relay.brevo.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.BREVO_SMTP_MAIL,
                        pass: process.env.BREVO_SMTP_API_KEY
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                const message = {
                    line1: "Thank you for joining LiveTypingTest! We're delighted to have you on board.",
                    line2: "If you have any questions or need support, feel free to reach out to us anytime.",
                    line3: "Wishing you a fantastic journey with us!",
                    designation: "Best Regards",
                }
            
                const htmlContent = `<html><body>
                    <table style="text-align: left">
                        <tr><th>${message.line1}</th></tr>
                        <tr><th>${message.line2}</th></tr>
                        <tr><th>${message.line3}</th></tr>
                        <tr><th>${message.designation}</th></tr>
                        <tr><th>Admin</th></tr>
                    </table>
                    </body></html>`;
                
                    await transporter.sendMail({
                        from: `"Live Typing Test" <${process.env.BREVO_SENDER_MAIL}>`,
                        to: email,
                        subject: `Welcome to LiveTypingTest! 🎉`,
                        html: htmlContent
                    });
                // sending mail--------------------


            await userModel.create(finalData)
            const getUser = await userModel.findOne({ email : email })
            await notificationModel.create({userId : getUser?._id, fcmToken : ''})
            const ID = {id : getUser?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, message : "Account Created Successfully", type : 'signup', token : token })
        } else res.send({ status : 402, message : "Email ID Exist", type : 'signup' }) 
    } else res.send({ status : 402, message : "username exist", type : 'signup' })

})

route.post('/updatepass/:id', async(req, res) => {
    if(req.headers.authorization){
        const ID = jwt.decode(req.params.id, key)
        // console.log(ID.id, req.body )
        const { currentpassword, newpassword } = req.body;
        const findUser = await userModel.findOne({ _id : ID.id })
        if(currentpassword) {
            if(findUser) {
                if(findUser?.password === sha(currentpassword)) {
                    await userModel.updateOne({ _id : ID?.id }, { password : sha(newpassword) })
                    res.send({ status : 200, type : "updatepassword", message : "Password Updated Succefully" })
                } else res.send({ status : 401, type : "updatepassword", message : "Current Password is Incorrect" })
            }
        } else {
            if(findUser) {
                if(findUser?.password === '') {
                    await userModel.updateOne({ _id : ID?.id }, { password : sha(newpassword) })
                    res.send({ status : 200, type : "updatepassword", message : "Password Added Succefully" })
                }
            }
        }
    }
});

route.post('/', async (req, res) => {
    try {
        // Validate authorization header
        if (!req.headers.authorization) {
            return res.status(401).send({ status: 401, message: "Authorization header is missing", type: "auth" });
        }

        const ID = jwt.decode(req.headers.authorization, key);
        if (!ID || !ID.id) {
            return res.status(401).send({ status: 401, message: "Invalid token or ID", type: "auth" });
        }

        const { data, date } = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).send({ status: 400, message: "Invalid data payload", type: "validation" });
        }

        // Destructure data fields with default fallback values
        const {
            wpm = [],
            consistency = [],
            accuracy = [],
            correctChars = 0,
            incorrectChars = 0,
            timeOfCompletion = 0,
            extraChars = 0,
            time = 0,
            level = "easy"
        } = data;

        // Validate numeric fields
        if (!Array.isArray(wpm) || !Array.isArray(consistency) || !Array.isArray(accuracy)) {
            return res.status(400).send({ status: 400, message: "wpm, consistency, and accuracy must be arrays", type: "validation" });
        }
        if (![15, 60, 180, 300].includes(time)) {
            return res.status(400).send({ status: 400, message: "Invalid time value", type: "validation" });
        }

        // Ensure calculations do not involve NaN values
        const avgWpm = calculateAverage(wpm);
        const avgConsis = calculateAverage(consistency);
        const avgAcc = calculateAverage(accuracy);
        if ([avgWpm, avgConsis, avgAcc].some(val => isNaN(val))) {
            return res.status(400).send({ status: 400, message: "Invalid average calculations, check input data", type: "calculation" });
        }

        const testData = {
            accuracy,
            consistency,
            wpm,
            avgwpm: avgWpm,
            avgacc: avgAcc,
            avgconsis: avgConsis,
            matchdate: date,
            time,
            level: level || "easy",
            timeofcompletion: timeOfCompletion,
            characters: {
                correct: correctChars,
                incorrect: incorrectChars,
                extra: extraChars,
            }
        };

        // Mapping match properties and validation
        const matchPropertyMap = {
            60: 'match_1',
            15: 'match_1',
            180: 'match_3',
            300: 'match_5',
        };
        const findPropertyMatch = {
            'match_1': "top1minavg",
            'match_3': "top3minavg",
            'match_5': "top5minavg",
        };

        const matchProperty = matchPropertyMap[time];
        if (!matchProperty) {
            return res.status(400).send({ status: 400, message: "Invalid match property", type: "validation" });
        }

        // Proceed with database updates
        await userModel.updateOne({ _id: ID.id }, { $push: { [matchProperty]: testData } });

        const getUserData = await userModel.findOne({ _id: ID.id });
        if (!getUserData) {
            return res.status(404).send({ status: 404, message: "User not found", type: "database" });
        }

        const findProperty = findPropertyMatch[matchProperty];
        const checkDataPresent = getUserData?.[matchProperty] || [];
        let finalAvgResult;

        if (checkDataPresent.length > 0) {
            const getTotalAvgData = getUserData?.[findProperty] || {};
            const dataLength = checkDataPresent.length;

            // Avoid invalid levels
            let levelDataLength = checkDataPresent.filter(value => value.level === level).length;

            const calculateNewAverage = (currentAvg = 0, newValue = 0, length = 1) => {
                if (isNaN(currentAvg) || isNaN(newValue) || length <= 0) {
                    return newValue;
                }
                return Math.min((currentAvg * (length - 1) + newValue) / length, 100);
            };

            // Calculate averages
            const allData = {
                avgwpm: calculateNewAverage(getTotalAvgData?.all?.avgwpm, avgWpm, dataLength),
                avgacc: calculateNewAverage(getTotalAvgData?.all?.avgacc, avgAcc, dataLength),
                avgconsis: calculateNewAverage(getTotalAvgData?.all?.avgconsis, avgConsis, dataLength),
            };

            const levelData = {
                avgwpm: calculateNewAverage(getTotalAvgData?.[level]?.avgwpm, avgWpm, levelDataLength),
                avgacc: calculateNewAverage(getTotalAvgData?.[level]?.avgacc, avgAcc, levelDataLength),
                avgconsis: calculateNewAverage(getTotalAvgData?.[level]?.avgconsis, avgConsis, levelDataLength),
            };

            finalAvgResult = {
                all: allData,
                [level]: levelData,
            };

            // Update averages in DB
            await userModel.updateMany(
                { _id: ID.id },
                { $set: { [`${findProperty}.all`]: allData, [`${findProperty}.${level}`]: levelData } }
            );
        }

        // Mapping match properties to total average fields
        const findRecordMatch = {
            60: 'highestrecord1min',
            15: 'highestrecord1min',
            180: 'highestrecord3min',
            300: 'highestrecord5min',
        };
        const getProp = findRecordMatch[time]
        const getHighestRecord = getUserData?.[getProp]
        const getHighestRecordLevel = getHighestRecord[level]
        const combinationData = ((avgAcc + avgConsis + avgWpm) / 3)
        let recordBreak;
        // console.log("I am main Highest Record : ", getHighestRecord)
        // console.log("I am level Highest Record : ", getHighestRecordLevel)
        // console.log("I am Combination Data : ", combinationData)
        if(getHighestRecordLevel?.combination) {
            if(getHighestRecordLevel?.combination < combinationData) {
                await userModel.updateOne({_id : ID.id}, { $set: { [`${getProp}.${level}.combination`]: combinationData}} )
                recordBreak = {
                    oldRecord : getHighestRecordLevel,
                    newRecord : combinationData
                }
            }
        } else {
            await userModel.updateOne({_id : ID.id}, { $set: { [`${getProp}.${level}.combination`]: combinationData}} )
        }
        // console.log("I am Record Breaker : ", recordBreak)
        

        return res.send({ status: 200, message: "test complete", type: "update", stats: testData, avgData : finalAvgResult, recordBreak : recordBreak });

    } catch (error) {
        console.error("Error in route:", error);
        return res.status(500).send({ status: 500, message: "Internal Server Error", type: "server", error: error.message });
    }
});

// Route to handle profile picture upload
route.post('/upload-profile', upload.single('profile'), async (req, res) => {
    if (req.headers.authorization) {
      const ID = jwt.decode(req.headers.authorization, key);
  
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded or invalid file type.' });
      }
  
      try {
        const isProfilePresent = await userModel.findOne({ _id: ID.id });
  
        if (isProfilePresent) {
          const existingImageKey = isProfilePresent?.profileimage?.s3key;
  
          // Delete the previous profile image from S3 if it exists
          if (existingImageKey) {
            await deleteImageFromS3(existingImageKey);
          }
  
          // Upload new profile image data
          const profileData = {
            originalname: req.file.originalname,
            s3key: req.file.key, // The S3 key (path) for the file
            s3url: req.file.location, // The URL to access the file
            updatedat: new Date()
          };
  
          // Update the user's profile with the new image data
          await userModel.updateOne({ _id: ID?.id }, { profileimage: profileData });
  
          // Send the details back to the client
          return res.send({ status: 200, message: "Profile Uploaded Successfully", type: "profile", profile: profileData });
        } else {
          return res.status(404).send({ message: "User not found" });
        }
      } catch (err) {
        console.error('Error processing profile upload:', err);
        return res.status(500).send({ message: "Internal server error" });
      }
    } else {
      return res.status(401).send({ message: "Unauthorized request." });
    }
});

route.put('/', async(req, res) => {
    
});

route.delete('/', async (req, res) => {
    try {
        // Check for the presence of the Authorization header
        if (req.headers.authorization) {
            // Decode the JWT token
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, key); // Using jwt.verify instead of decode for security
            
            // Check if the requesting user exists
            const checkAccount = await userModel.findOne({_id: decoded.id});
            if (!checkAccount) {
                return res.status(404).send({status: 404, message: 'User not found'});
            }

            const imageKey = checkAccount?.profileimage?.s3Key

            if(imageKey) {
                await deleteImageFromS3(imageKey)
            }

            // Delete the account based on the accountid parameter
            const deletionResult = await userModel.deleteOne({_id: decoded.id});
            await notificationModel.deleteOne({userId: decoded.id});
            if (deletionResult.deletedCount === 0) {
                return res.status(404).send({status: 404, message: 'Account not found or already deleted'});
            }

            // Successful deletion response
            res.send({
                status: 200,
                type: 'delete',
                message: 'Account Deleted Successfully'
            });
        } else {
            // If no authorization header is present
            res.status(401).send({status: 401, message: 'Authorization header missing'});
        }
    } catch (error) {
        // Catch any errors that occur
        console.error(error);
        res.status(500).send({status: 500, message: 'An error occurred while deleting the account'});
    }
});

// Route to save FCM token
route.post("/save-token", async (req, res) => {
    const { token, userId } = req.body;
    let ID = jwt.decode(userId, key)
    try {
        await notificationModel.updateOne({ userId : ID?.id }, { fcmToken: token });
        res.sendStatus(200);
    } catch (error) {
        console.error("Error saving token:", error);
        res.sendStatus(500);
    }
});


module.exports = route;


// route.post('/', async (req, res) => {
//     // console.log(req.body)
//     if (req.headers.authorization) {
//         const ID = jwt.decode(req.headers.authorization, key);
//         const { wpm, consistency, accuracy, correctChars, incorrectChars, timeOfCompletion, extraChars, time, level } = req.body.data;
//         const {date} = req.body
        
//         const avgWpm = calculateAverage(wpm)
//         const avgConsis = calculateAverage(consistency)
//         const avgAcc = calculateAverage(accuracy)
        
//         const testData = { 
//             accuracy : accuracy,
//             consistency : consistency,
//             wpm : wpm,
//             avgwpm : avgWpm,
//             avgacc : avgAcc,
//             avgconsis : avgConsis,
//             matchdate : date,
//             time : time,
//             level : level !== "" ? level : 'easy',
//             timeofcompletion : timeOfCompletion,
//             characters : { 
//                 correct : correctChars,
//                 incorrect : incorrectChars,
//                 extra : extraChars,
//             }}
            
//       // Create a mapping of time values to match properties
//         const matchPropertyMap = {
//             60: 'match_1',
//             15: 'match_1',
//             180: 'match_3',
//             300: 'match_5',
//         };

//         // Mapping match properties to total average fields
//         const findPropertyMatch = {
//             'match_1': "top1minavg",
//             'match_3': "top3minavg",
//             'match_5': "top5minavg",
//         };

//         // Helper function to calculate new average
//         const calculateNewAverage = (currentAvg, newValue, length) => {
//             if(currentAvg !== 0){
//                 const newAvg = (currentAvg * (length-1) + newValue) / (length); // Adjusted length to include the new value
//                 return Math.min(newAvg, 100); // Ensure the average does not exceed 100
//             } else {
//                 return newValue
//             }
            
//         };

//         const matchProperty = matchPropertyMap[time];
            
//         if (matchProperty) {
//             // Add new data to match property array
//             await userModel.updateOne({ _id: ID.id }, { $push: { [matchProperty]: testData } });
        
//             const getUserData = await userModel.findOne({ _id: ID.id });
        
//             const findProperty = findPropertyMatch[matchProperty];
//             const checkDataPresent = getUserData?.[matchProperty];
//             let finalAvgResult;
//             if (checkDataPresent?.length !== 0) {
//                 const getTotalAvgData = getUserData?.[findProperty];
//                 const dataLength = checkDataPresent?.length;
//                 let levelDataLength = checkDataPresent?.map(value => value.level === level)
//                 levelDataLength = levelDataLength?.length
        
//                 // Calculate all averages
//                 const allData = {
//                     avgwpm: calculateNewAverage(getTotalAvgData?.all?.avgwpm, avgWpm, dataLength),
//                     avgacc: calculateNewAverage(getTotalAvgData?.all?.avgacc, avgAcc, dataLength),
//                     avgconsis: calculateNewAverage(getTotalAvgData?.all?.avgconsis, avgConsis, dataLength),
//                 };
        
//                 // Calculate level-based averages
//                 const levelData = {
//                     avgwpm: calculateNewAverage(getTotalAvgData?.[level]?.avgwpm, avgWpm, dataLength),
//                     avgacc: calculateNewAverage(getTotalAvgData?.[level]?.avgacc, avgAcc, dataLength),
//                     avgconsis: calculateNewAverage(getTotalAvgData?.[level]?.avgconsis, avgConsis, dataLength),
//                 };

//                 finalAvgResult = {
//                     all : allData,
//                     [level] : levelData
//                 }
        
//                 // Update the document with the new averages
//                 await userModel.updateMany(
//                     { _id: ID.id },
//                     { $set: { [`${findProperty}.all`]: allData, [`${findProperty}.${level}`]: levelData } }
//                 );
//             } 

//             // Mapping match properties to total average fields
//             const findRecordMatch = {
//                 60: 'highestrecord1min',
//                 15: 'highestrecord1min',
//                 180: 'highestrecord3min',
//                 300: 'highestrecord5min',
//             };
//             const getProp = findRecordMatch[time]
//             const getHighestRecord = getUserData?.[getProp]
//             const getHighestRecordLevel = getHighestRecord[level]
//             const combinationData = ((avgAcc + avgConsis + avgWpm) / 3)
//             let recordBreak;
//             // console.log("I am main Highest Record : ", getHighestRecord)
//             // console.log("I am level Highest Record : ", getHighestRecordLevel)
//             // console.log("I am Combination Data : ", combinationData)
//             if(getHighestRecordLevel?.combination) {
//                 if(getHighestRecordLevel?.combination < combinationData) {
//                     await userModel.updateOne({_id : ID.id}, { $set: { [`${getProp}.${level}.combination`]: combinationData}} )
//                     recordBreak = {
//                         oldRecord : getHighestRecordLevel,
//                         newRecord : combinationData
//                     }
//                 }
//             } else {
//                 await userModel.updateOne({_id : ID.id}, { $set: { [`${getProp}.${level}.combination`]: combinationData}} )
//             }
//             // console.log("I am Record Breaker : ", recordBreak)
            

//             return res.send({ status: 200, message: "test complete", type: "update", stats: testData, avgData : finalAvgResult, recordBreak : recordBreak });
//         } else {
//             return res.send({status : 400, message : "Invalid time line", type : "update"});
//         }
//     } else {
//         return res.send({status : 401, message : "invalid ID", type : "auth"});
//     }
// });
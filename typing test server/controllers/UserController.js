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
                bio : userData?.bio,
                url : userData?.url
            }
            res.send({ status : 200, userdata : userData })

        }else{
            res.send({status : 403})
        }
    }
});

const calculatePoints = (metrics) => {
    const { avgWpm, avgConsis, avgAcc } = metrics;
    return avgWpm * 0.5 + avgConsis * 0.3 + avgAcc * 0.2;
};

route.get('/dashdata/:limit/:type/:level', async (req, res) => {
    const fetchFilteredData = async (filterType, limit) => {
        const levels = ['all', 'easy', 'medium', 'hard'];
        const queries = levels.map(level => ({
            [`${filterType}.${level}.avgwpm`]: { $gt: 60 },
            [`${filterType}.${level}.avgconsis`]: { $gt: 10 },
            [`${filterType}.${level}.avgacc`]: { $gt: 80 }
        }));

        const results = await userModel.find({
            $or: queries
        });

        return results;
    };

    const limit = parseInt(req.params.limit, 10);
    const type = req.params.type;
    const level = req.params.level


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

    // const allUser = await fetchFilteredData(filterType, limit);
    const allUser = await userModel
            .find({
                [`${filterType}.${level}.points`]: { $gte: 10 }, // Ensuring we fetch users with points
            })
            .sort({ [`${filterType}.${level}.points`]: -1 }) // Sort by points in descending order
            .limit(limit); // Limit the results to top `limit` users

        // console.log(users)

    // console.log('allUser',allUser?.map((value) => console.log(value?.username, value[matchType]?.length)))

    const extractLevelData = (matchData, level, user) => {
        const filteredData = matchData?.filter(value => value.level === level);
        const avgWpm = calculateAverage(filteredData.map(value => parseFloat(value.avgwpm)));
        const avgAcc = calculateAverage(filteredData.map(value => parseFloat(value.avgacc)));
        const avgConsis = calculateAverage(filteredData.map(value => parseFloat(value.avgconsis)));

        // Calculate points for the level
        // const points = calculatePoints({ avgWpm, avgConsis, avgAcc });
        return {
            avgWpm,
            avgAcc,
            avgConsis,
            points: user?.[filterType]?.[level]?.points, // Add points for each level
        };
    };

    const filteredData = allUser?.map(user => {
        const matchData = user[matchType] || [];
        const matchCount = matchData?.length;

        let levelData ;
        
        if(level !== 'all') {
            levelData = extractLevelData(matchData, level, user);
        } else {
            levelData = {
                avgWpm: calculateAverage(matchData.map(value => parseFloat(value.avgwpm))),
                avgAcc: calculateAverage(matchData.map(value => parseFloat(value.avgacc))),
                avgConsis: calculateAverage(matchData.map(value => parseFloat(value.avgconsis))),
                points: user?.[filterType]?.all?.points
            }
        }
        console.log(levelData)
        // Extract overall data

        const overallData = {

            avgWpm: calculateAverage(matchData.map(value => parseFloat(value.avgwpm))),
            avgAcc: calculateAverage(matchData.map(value => parseFloat(value.avgacc))),
            avgConsis: calculateAverage(matchData.map(value => parseFloat(value.avgconsis))),
        };
        const overallPoints = calculatePoints(overallData);
        // Return the structured response with overall and levels data
        return {
            username: user?.username,
            profile: user?.profileimage,
            matchCount,
            overall: levelData, // Include overall points
        };
    });

    // console.dir(filteredData, {depth: null})

    // Filter users with more than 10 matches
    const eligibleUsers = filteredData.filter(user => user.matchCount > 10);

    // Sort users based on overall performance in descending order for ranking
    const sortedData = eligibleUsers
        .filter(user => user.overall.avgWpm && user.overall.avgConsis && user.overall.avgAcc) // Ensure valid users
        .sort((a, b) => b.overall.points - a.overall.points); // Sort globally by overall points

        // console.dir(sortedData, {depth: null})

    // Slice the top 100 users
    const top100 = sortedData.slice(0, 100);

    // Add ranking to the data
    const rankedData = top100.map((user, index) => ({
        rank: index + 1,
        ...user
    }));

    res.send({ status: 200, userData: rankedData, type: "leaderboard", message: "Leaderboard Data" });
});

route.post('/signin/google', async (req, res) => {
    const token = Object.keys(req.body)[0];

    try {
        // Fetch user information from Google's Userinfo API
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userInfo = await userInfoResponse.json();
        const { email_verified, email, picture } = userInfo;

        // Check if the user exists in the database
        const isUserExist = await userModel.findOne({ email });

        if (isUserExist) {
            if (email_verified) {
                // Check if the user is blocked
                if (!isUserExist?.isblocked?.status) {
                    // Update the Google profile picture in the database
                    const updatedProfileImage = { ...isUserExist.profileimage };
                    if (picture) {
                        updatedProfileImage.googleProfile = picture;
                    }
                    if (updatedProfileImage.display === "") {
                        updatedProfileImage.display = "empty";
                    }

                    // Update the user document
                    isUserExist.profileimage = updatedProfileImage;
                    await isUserExist.save();
                    // console.log(picture)
                    const ID = { id: isUserExist?._id };
                    const token = jwt.sign(ID, key);

                    res.send({
                        status: 200,
                        token,
                        message: "Logged in Successfully",
                        type: 'signin',
                    });
                } else {
                    res.send({
                        status: 402,
                        message: "Your Account is blocked",
                        type: 'block-unblock',
                    });
                }
            } else {
                res.send({
                    status: 401,
                    message: "Email ID is not verified",
                    type: 'signin',
                });
            }
        } else {
            res.send({
                status: 401,
                message: "Email ID is Invalid",
                type: 'signin',
            });
        }
    } catch (error) {
        console.error("Error during Google Sign-In:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
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
    const {email_verified, email, picture} = userInfo;
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
                    authType : {google : true, email : false},
                    profileimage: {googleProfile: picture, display: 'google'}
                }
                // console.log(finalData?.profileimage)

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

                // Read the HTML file asynchronously
                fs.readFile(path.join(__dirname, '../utils/', 'welcomeEmail.html'), 'utf8', (err, htmlContent) => {
                    if (err) {
                        console.log("Error reading HTML file: ", err);
                        return res.status(500).send({ status: 500, message: "Internal Server Error" });
                    }

                    // Send the email with the HTML content
                    transporter.sendMail({
                        from: `"Live Typing Test" <${process.env.BREVO_SENDER_MAIL}>`,
                        to: email,
                        subject: `Welcome to LiveTypingTest! 🎉`,
                        html: htmlContent // Use the HTML content from the file
                    }, async (error, info) => {
                        if (error) {
                            console.log("Error sending email: ", error);
                            return res.status(500).send({ status: 500, message: "Failed to send email" });
                        }
                    });
                });
                // sending mail --------------------


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
                authType : {google : false, email : true},
                profileimage: {display: 'empty'}
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

                // Read the HTML file asynchronously
                fs.readFile(path.join(__dirname, '../utils/', 'welcomeEmail.html'), 'utf8', (err, htmlContent) => {
                    if (err) {
                        console.log("Error reading HTML file: ", err);
                        return res.status(500).send({ status: 500, message: "Internal Server Error" });
                    }

                    // Send the email with the HTML content
                    transporter.sendMail({
                        from: `"Live Typing Test" <${process.env.BREVO_SENDER_MAIL}>`,
                        to: email,
                        subject: `Welcome to LiveTypingTest! 🎉`,
                        html: htmlContent // Use the HTML content from the file
                    }, async (error, info) => {
                        if (error) {
                            console.log("Error sending email: ", error);
                            return res.status(500).send({ status: 500, message: "Failed to send email" });
                        }
                    });
                });
                // sending mail --------------------

                // Create the new user
                await userModel.create(finalData);
                const getUser = await userModel.findOne({ email : email });
                await notificationModel.create({ userId: getUser?._id, fcmToken: '' });
                const ID = { id: getUser?._id };
                const token = jwt.sign(ID, key);

                // Send the success response
                res.send({ status: 200, message: "Account Created Successfully", type: 'signup', token:token });
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

route.post('/forgotpass', async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body)

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            // Hash the password before saving it to the database
            const hashedPassword = sha(password)
            await userModel.updateOne({ email: email }, { $set: { password: hashedPassword } });

            if(!user?.isblocked.status) {
                const ID = {id : user?._id};
                const token = jwt.sign(ID, key)
                res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
            } else res.send({ status : 402, message : "Your Account is blocked", type : 'block-unblock' })

        } else {
            res.status(404).send({ status: 404, message: 'Email not found.', type: 'resetPassword' });
        }
    } catch (error) {
        console.error('Error in /user/forgotpass:', error);
        res.status(500).send({ status: 500, message: 'Server error. Please try again later.' });
    }
});

route.post('/forgotpass/mail', async (req, res) => {
    const { email } = req.body;

    try {
        const isUserExist = await userModel.findOne({ email: email });
        if (isUserExist) {
            const generateOtp = randNum.generator({ min: 1000, max: 9999, integer: true });
            const otp = generateOtp();

            // Nodemailer transporter configuration
            const transporter = nodemailer.createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.BREVO_SMTP_MAIL,
                    pass: process.env.BREVO_SMTP_API_KEY,
                },
                tls: { rejectUnauthorized: false },
            });

            const htmlContent = `<html><body>
                <table style="text-align: left">
                    <tr><th>Your OTP to Reset Password is :</th></tr>
                    <tr><th>${otp}</th></tr>
                </table>
            </body></html>`;

            await transporter.sendMail({
                from: `"Live Typing Test" <${process.env.BREVO_SENDER_MAIL}>`,
                to: email,
                subject: `Forgot Password LiveTypingTest`,
                html: htmlContent,
            });

            // Save OTP in the database
            await userModel.updateOne({ email: email }, { $set: { otp: otp } });

            res.status(200).send({
                status: 200,
                type: 'forgotPassword',
                message: 'OTP has been sent to your email.',
            });
        } else {
            res.status(404).send({ status: 404, message: 'Email ID is invalid.', type: 'forgotPassword' });
        }
    } catch (error) {
        console.error('Error in /user/forgotpass/mail:', error);
        res.status(500).send({ status: 500, message: 'Server error. Please try again later.' });
    }
});

route.post('/forgotpass/otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        
        console.log(user?.otp, otp)
        if (user) {
            if (user?.otp == otp) {
                // Delete OTP after successful verification
                await userModel.updateOne({ email: email }, { $unset: { otp: '' } });

                res.status(200).send({
                    status: 200,
                    type: 'verifyOtp',
                    message: 'OTP verified successfully.',
                });
            } else {
                res.status(400).send({
                    status: 400,
                    type: 'verifyOtp',
                    message: 'Invalid OTP. Please try again.',
                });
            }
        } else {
            res.status(404).send({ status: 404, message: 'Email not found.', type: 'verifyOtp' });
        }
    } catch (error) {
        console.error('Error in /user/forgotpass/otp:', error);
        res.status(500).send({ status: 500, message: 'Server error. Please try again later.' });
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

        const WPM_WEIGHT = 0.5;
        const ACCURACY_WEIGHT = 0.3;
        const CONSISTENCY_WEIGHT = 0.2;

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

        const totalPoints = (avgWpm * WPM_WEIGHT) + (avgAcc * ACCURACY_WEIGHT) + (avgConsis * CONSISTENCY_WEIGHT);
        // console.log('current match points: ', totalPoints)
        const testData = {
            accuracy,
            consistency,
            wpm,
            avgwpm: avgWpm,
            avgacc: avgAcc,
            avgconsis: avgConsis,
            points: totalPoints,
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

        if (checkDataPresent?.length > 0) {
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
                points: getTotalAvgData?.all?.points + totalPoints
            };
            
            const levelData = {
                avgwpm: calculateNewAverage(getTotalAvgData?.[level]?.avgwpm, avgWpm, levelDataLength),
                avgacc: calculateNewAverage(getTotalAvgData?.[level]?.avgacc, avgAcc, levelDataLength),
                avgconsis: calculateNewAverage(getTotalAvgData?.[level]?.avgconsis, avgConsis, levelDataLength),
                points: getTotalAvgData?.[level]?.points + totalPoints
            };

            finalAvgResult = {
                all: allData,
                [level]: levelData,
            };

            // console.dir(finalAvgResult, { depth: null })

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

        // Prepare the updated profile image data
        const profileData = {
            originalname: req.file.originalname,
            s3key: req.file.key, // The S3 key (path) for the file
            s3url: req.file.location, // The URL to access the file
            updatedat: new Date(),
        };

        // Update only the specified fields in the profileimage property
        await userModel.updateOne(
            { _id: ID.id },
            {
            $set: {
                'profileimage.originalname': profileData.originalname,
                'profileimage.s3key': profileData.s3key,
                'profileimage.s3url': profileData.s3url,
                'profileimage.updatedat': profileData.updatedat,
                'profileimage.display': 'custom',
            },
            }
        );

        const getProfile = await userModel.findOne({_id: ID?.id})

        // Send the details back to the client
        return res.send({
            status: 200,
            message: 'Profile Uploaded Successfully',
            type: 'profile',
            profile: getProfile?.profileimage,
        });
        } else {
        return res.status(404).send({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Error processing profile upload:', err);
        return res.status(500).send({ message: 'Internal server error' });
    }
    } else {
    return res.status(401).send({ message: 'Unauthorized request.' });
    }
});

route.post('/profile-status', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ status: 401, message: "Unauthorized", type: "error" });
        }

        const status = req.body.display; // Ensure you're accessing the correct field in the request body
        if (!status) {
            return res.status(400).send({ status: 400, message: "Invalid status data", type: "error" });
        }

        const ID = jwt.decode(req.headers.authorization, key);
        if (!ID?.id) {
            return res.status(401).send({ status: 401, message: "Invalid token", type: "error" });
        }

        await userModel.updateOne(
            { _id: ID.id },
            { $set: { 'profileimage.display': status } }
        );

        return res.send({
            status: 200,
            message: "Profile Uploaded Successfully",
            type: "profile",
            profile: status
        });
    } catch (error) {
        console.error("Error updating profile status:", error);
        return res.status(500).send({ status: 500, message: "Internal Server Error", type: "error" });
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

route.post('/clear-matches', async (req, res) => {
    try {
        // Update all users to clear their match arrays
        const result = await userModel.updateMany(
            {}, // Empty filter to match all documents
            {
                $set: {
                    match_1: [],
                    match_3: [],
                    match_5: [],
                    // Reset averages and records
                    top1minavg: {},
                    top3minavg: {},
                    top5minavg: {},
                    highestrecord1min: {},
                    highestrecord3min: {},
                    highestrecord5min: {}
                }
            }
        );

        res.status(200).send({
            status: 200,
            message: "All match data cleared successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error clearing match data:", error);
        res.status(500).send({
            status: 500,
            message: "Error clearing match data",
            error: error.message
        });
    }
});

route.post('/update-profile', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ 
                status: 401, 
                message: "Unauthorized", 
                type: "auth" 
            });
        }

        const ID = jwt.decode(req.headers.authorization, key);
        const { url, bio } = req.body;

        // Create update object with only provided fields
        const updateFields = {};
        if (url !== undefined) updateFields.url = url;
        if (bio !== undefined) updateFields.bio = bio;

        // Update user profile
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: ID.id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({
                status: 404,
                message: "User not found",
                type: "error"
            });
        }

        res.send({
            status: 200,
            message: "Profile updated successfully",
            type: "profile",
            data: {
                url: updatedUser.url,
                bio: updatedUser.bio
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send({
            status: 500,
            message: "Internal server error",
            type: "error"
        });
    }
});

module.exports = route;
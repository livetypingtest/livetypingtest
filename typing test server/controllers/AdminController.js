const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../model/AdminSchema')
const userModel = require('../model/UserSchema')
const DataModel = require('../model/DynamicPagesDataSchema')
const notificationModel = require('../model/NotificationSchema')
const key = require('../config/token_Keys');
const admin = require("firebase-admin");
require('dotenv').config();  // Load environment variables from .env
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand  } = require('@aws-sdk/client-s3');

const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Correctly replace escaped \n
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });


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

  // Multer storage configuration to save images locally
  const storageForHomeSEO = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const newFilename = `homeSeo/${uniqueSuffix}${extension}`;
    cb(null, newFilename); // S3 key (path within the bucket)
    }
});

// Use multer for file upload (local storage configuration)
const uploadForHomeSEO = multer({ storage: storageForHomeSEO });


route.use('/blog', require('./sub-controllers/BlogController'))
route.use('/users', require('./sub-controllers/UsersController'))


route.get('/', async(req, res) => {
    // console.log(req.headers.authorization)
    if(req.headers.authorization){
        let ID = jwt.decode(req.headers.authorization, key)
        let adminData = await adminModel.findOne({_id : ID?.id})
        let userCount = await userModel.countDocuments({})
        adminData = {
            email : adminData?.email,
            _id : adminData?.username,
            paragraphs : adminData?.paragraphs,
            blogCount : adminData?.blog?.length,
            block : adminData?.blockUser,
            userCount : userCount,
            blogCategory : adminData?.blogCategory,
            profileimage : adminData?.profileimage
        }
        if(adminData) {
            res.send({ status : 200, adminData : adminData })
        }else{
            res.send({status : 403})
        }
    }
});

route.post('/signin', async(req, res) => {
    const { signin, password, type } = req.body;
    // return
    let isUserExist;
    if(type === 'username') {
        isUserExist = await adminModel.findOne({ username : signin }) 
    } else {
        isUserExist = await adminModel.findOne({ email : signin }) 
    }
    if(isUserExist) {
        if(sha(password) === isUserExist?.password) {
            const ID = {id : isUserExist?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
        } else res.send({ status : 402, message : "Password is Incorrect", type : 'signin' })
    } else res.send({ status : 401, message : "Email ID is Invalid", type : 'signin' })
});

route.post('/add-para', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { paragraphs, level, time } = req.body;

        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        if (!isThisAdmin) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Map time to the correct nested field
        const changeTime = {
            '1': 'Min1',
            '3': 'Min3',
            '5': 'Min5',
        };
        const timeField = changeTime[time];
        if (!timeField) {
            return res.status(400).json({ message: "Invalid time parameter" });
        }

        // Define the dynamic path in paragraphs
        const arrayFieldPath = `paragraphs.${timeField}.${level}`;

        // Convert each paragraph to the format { id, para }
        const formattedParagraphs = paragraphs.map((paraObj) => ({
            id: paraObj.id || uuidv4(), // Generate a unique ID only if it doesn't exist
            para: paraObj.para,
        }));

        try {
            // Fetch existing paragraphs to check for duplicates
            const existingData = await adminModel.findOne({ _id: ID?.id });
            const existingParagraphs = existingData?.paragraphs[timeField]?.[level] || [];

            // Create a map of existing paragraphs by ID for quick lookup
            const existingMap = new Map(existingParagraphs.map(para => [para.id, para]));

            // Prepare updates and new paragraphs to push
            const updates = [];
            const paragraphsToPush = [];

            // Check each formatted paragraph
            for (const newPara of formattedParagraphs) {
                if (existingMap.has(newPara.id)) {
                    // Prepare to overwrite the existing paragraph if it exists
                    updates.push({
                        updateOne: {
                            filter: { _id: ID?.id, [`${arrayFieldPath}.id`]: newPara.id },
                            update: { $set: { [`${arrayFieldPath}.$.para`]: newPara.para } } // Update the existing paragraph
                        }
                    });
                } else {
                    // If the paragraph ID does not exist, add to the push array
                    paragraphsToPush.push(newPara);
                }
            }

            // Perform bulk updates for existing paragraphs
            if (updates.length > 0) {
                await adminModel.bulkWrite(updates);
            }

            // Push new paragraphs if any exist
            if (paragraphsToPush.length > 0) {
                await adminModel.updateOne(
                    { _id: ID?.id },
                    { $push: { [arrayFieldPath]: { $each: paragraphsToPush } } } // Push each new paragraph object
                );
            }

            const paraData = await adminModel.findOne({ _id: ID?.id });
            res.send({ status: 200, message: "Paragraphs added successfully", type: 'addpara', paragraphs: paraData?.paragraphs });
        } catch (error) {
            console.error("Error updating paragraphs:", error);
            res.status(500).json({ message: "An error occurred while adding paragraphs" });
        }
    } else {
        res.status(401).json({ message: "Authorization header missing" });
    }
});

route.post('/para', async (req, res) => {
    if(req.headers.authorization) {}
    const ID = jwt.decode(req.headers.authorization, key);
    const { id, time, level } = req.body;
    const isThisAdmin = await adminModel.findOne({ _id: ID?.id });

    if (isThisAdmin) {
        // Map `time` to the correct nested field
        const changeTime = {
            '1': 'Min1',
            '3': 'Min3',
            '5': 'Min5',
        };
        const timeField = changeTime[time];

        if (!timeField) {
            return res.status(400).json({ message: "Invalid time parameter" });
        }

        // Define the dynamic path in `paragraphs`
        const arrayFieldPath = `paragraphs.${timeField}.${level}`;

        // Use $pull to remove the object that matches the id from the array
        const result = await adminModel.updateOne(
            { _id: ID?.id },
            { $pull: { [arrayFieldPath]: { id: id } } } // Match by id
        );

        if (result.modifiedCount > 0) {
            return res.send({status : 200, message: "Paragraph deleted successfully", type : 'deletepara'});
        } else {
            return res.status(404).json({ message: "Paragraph not found" });
        }
    } else {
        return res.status(403).json({ message: "Unauthorized access" });
    }
});

// Route to send notification to all users
route.post("/send-notification", async (req, res) => {
    const { title, message, url } = req.body;
    
    try {
        // Find users with fcmToken
        const users = await notificationModel.find({ fcmToken: { $exists: true, $ne: null } });
        const tokens = users.map((user) => user.fcmToken);

        if (tokens.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid tokens available to send notification to.'
            });
        }

         // Get the local file path for the image
         const imageUrl = req.file ? `/assets/notification/${req.file.filename}` : null; // Store relative path

        //  console.log(imageUrl)

        const obj = {
            message : message
        }

        const payload = {
            notification: {
                title,
                body: message,
            }
        };

        // Send notifications to each device
        const response = await admin.messaging().sendEachForMulticast({
            tokens: tokens,
            notification: payload.notification,
        }).catch((error) => {
            // console.error("Error in sendEachForMulticast:", error);
            throw error; // Re-throw to catch in the main try-catch
        });
        

        // Check for individual failed tokens
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                failedTokens.push(tokens[idx]);
                // console.error("Error sending to token:", tokens[idx], resp.error);
            }
        });

        res.status(200).json({ 
            success: true,
            message: "Notification processed with possible individual failures.",
            failedTokens: failedTokens,
            successCount: response.successCount,
            failureCount: response.failureCount
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

route.put('/', async(req, res) => {
    if(req.headers.authorization){
        const ID = jwt.decode(req.headers.authorization, key)
        const { currentpassword, newpassword } = req.body;
        const findUser = await adminModel.findOne({ _id : ID?.id })
        // console.log(findUser)
        if(findUser) {
            if(findUser?.password === sha(currentpassword)) {
                await adminModel.updateOne({ _id : ID?.id }, { password : sha(newpassword) })
                res.send({ status : 200, type : "adminupdatepassword", message : "Password Updated Succefully" })
            } else res.send({ status : 401, type : "adminupdatepassword", message : "Current Password is Incorrect" })
        }
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
        const isProfilePresent = await adminModel.findOne({ _id : ID?.id });
  
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
        //   console.log(profileData)
  
          // Update the user's profile with the new image data
          await adminModel.updateOne({ _id : ID?.id }, { profileimage: profileData });
  
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

// Route for updating Home Page SEO
route.post('/home-seo', uploadForHomeSEO.single('seoImage'), async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { seoTitle, seoDiscription } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
    }

    const isProfilePresent = await DataModel.findOne({}, { homePageSEO: 1, _id: 0 });

    if (isProfilePresent) {
      const existingImageKey = isProfilePresent.homePageSEO?.imageKey;

      // Delete the previous image from S3 if it exists
      if (existingImageKey) {
        await deleteImageFromS3(existingImageKey);
      }
    }

    const newHomePageSEO = {
      seoTitle: seoTitle,
      seoDiscription: seoDiscription,
      imageUrl: req.file.location,
      imageKey: req.file.key,
    };

    await DataModel.updateOne(
      {}, // filter for matching document; leave empty if updating the first document
      {
        $set: { "homePageSEO": newHomePageSEO },
      },
      { upsert: true } // creates the document if it doesn't exist
    );

    res.status(200).json({
      status: 200,
      message: "Home Page SEO updated successfully.",
      type: "homepageseo",
      result: {
        seoTitle,
        seoDiscription,
        imageUrl: req.file.location,
      },
    });
  } catch (error) {
    console.error("Error updating Home Page SEO:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

route.post('/ads', async (req, res) => {
    if(req.headers.authorization) {
        const { adsClientID, adSlot } = req.body

    }
})

route.get('/ads', async (req, res) => {
    if(req.headers.authorization) {
        const { adsClientID, adSlot } = req.body

    }
})

route.post('/google-analytics', async (req, res) => {
    console.log(req.headers.authorization)
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ status: 401, message: 'Unauthorized access' });
        }

        const { trackingId } = req.body;

        if (!trackingId) {
            return res.status(400).json({ status: 400, message: 'Tracking ID is required' });
        }

        // Check if the document already exists
        const document = await DataModel.findOne();

        if (document) {
            // Update existing document
            document.googleAnalytics.trackingId = trackingId;
            await document.save();
        } else {
            // Create a new document if none exists
            const newDocument = new DataModel({
                googleAnalytics: { trackingId }
            });
            await newDocument.save();
        }

        res.status(200).json({ status: 200, message: 'Tracking ID saved successfully' });
    } catch (error) {
        console.error('Error saving tracking ID:', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});

route.get('/google-analytics', async (req, res) => {
    try {

        // Fetch the document
        const document = await DataModel.findOne();

        if (!document || !document.googleAnalytics || !document.googleAnalytics.trackingId) {
            return res.status(404).json({ status: 404, message: 'Tracking ID not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Tracking ID fetched successfully',
            trackingId: document.googleAnalytics.trackingId,
        });
    } catch (error) {
        console.error('Error fetching tracking ID:', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
});




module.exports = route;
module.exports = (adminModel, DataModel, key) => {
  const route = require("express").Router();
  const multer = require("multer");
  const AWS = require("aws-sdk");
  const path = require('path')
    require('dotenv').config();
    const jwt = require('jsonwebtoken');


// Initialize S3 client
const s3Client = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

  // Set up multer for handling file uploads
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage }).array("images", 10); // Limit to 10 images
  const uploadSingle = multer({ storage: storage }).single("image");

// Function to delete an existing image from S3
const deleteImageFromS3 = async (imageKey) => {
    if (!imageKey) {
        console.log("No imageKey provided, skipping deletion.");
        return;
    }

    try {
        await s3Client.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
        }).promise();
        console.log("Existing profile image deleted from S3 successfully.");
    } catch (error) {
        console.error("Error deleting image from S3:", error);
    }
};


    route.get('/', async(req, res) => {
        const data = await DataModel.find({})
        if(data?.length !== 0) {
            // console.log(data[0]?.about)
            res.send({status : 200, type : 'about', result : data[0]?.about})
        }
    })

    // Route to handle the file upload
    route.post("/", upload, async (req, res) => {
        const files = req.files;
        const { title, content, btnTitle, buttonUrls, date } = req.body; // Extract arrays from req.body

        if (!files || files.length === 0) {
        return res.status(400).send("No files uploaded.");
        }

        if (!title || !content || !btnTitle || !buttonUrls) {
        return res.status(400).send("Missing required data.");
        }

        // Ensure the aboutData arrays are of the same length
        const numberOfItems = title.length;
        if (content.length !== numberOfItems || btnTitle.length !== numberOfItems || buttonUrls.length !== numberOfItems) {
        return res.status(400).send("Mismatch in the length of data arrays.");
        }

        // Upload each image to S3 and then map the URL to the corresponding aboutData
        try {
        const uploadPromises = files.map((file, index) => {
            const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `about/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            };

            return s3Client.upload(params).promise().then((data) => {
                // Construct the URL with the correct region
                const region = process.env.AWS_REGION;  // Ensure you have this in your .env file
                const s3Url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
                // Return the data for each image uploaded
                return {
                    imageUrl: s3Url,
                    title: title[index],
                    content: content[index],
                    button: {
                    title: btnTitle[index],
                    url: buttonUrls[index],
                    },
                };
                });
        });

        // Wait for all uploads to complete
        const uploadedData = await Promise.all(uploadPromises);

        // Now, store the image URLs and other data in the database
        const newMetaData = uploadedData.map((item) => ({
            title: item.title,
            content: item.content,
            imageUrl: item.imageUrl,
            button: {
            title: item.button.title,
            url: item.button.url,
            },
            createdat: date,
        }));

        // Find the first document (only one exists) and either update or create it
        await DataModel.findOneAndUpdate(
            {}, // No condition as there's only one document
            { 
                $push: { "about.metaData": { $each: newMetaData } }, // Append newMetaData to the existing array
                $setOnInsert: { createdat: date } // Add createdAt if it's being created
            },
            { new: true, upsert: true } // Create it if not found
        );        

        res.status(200).json({
            status : 200,
            type : 'about',
            result: {metaData : newMetaData, createdat : date},
            message: "Data and images uploaded successfully!",
        });
        } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading files to S3 or saving data to DB");
        }
    });

    /// Route to handle the deletion of a metadata item
    route.delete("/:id", async (req, res) => {
        const { id } = req.params; // The _id passed in the URL

        const adminid = req.headers.authorization;
    
        if (!adminid) {
            return res.status(403).json({ message: "Unauthorized, admin ID missing" });
        }
    
        try {
            // Verify JWT token
            const decoded = jwt.verify(adminid, key);
            if (!decoded) {
                return res.status(403).json({ message: "Unauthorized, invalid token" });
            }
    
            // Find the document that contains the metaData array with the provided _id
            const dataDocument = await DataModel.findOne({ "about.metaData._id": id });
    
            if (!dataDocument) {
                return res.status(404).json({ message: "Item not found" });
            }
    
            // Find the metadata item inside the metaData array
            const metadataItem = dataDocument.about.metaData.find(item => item._id.toString() === id);
    
            if (!metadataItem) {
                return res.status(404).json({ message: "Metadata item not found" });
            }
    
            // Get the imageUrl from the metadataItem to delete the image from S3
            const imageUrl = metadataItem.imageUrl;

            if(imageUrl) {
                await deleteImageFromS3(imageUrl)
            }
    
            // if (imageUrl) {
            //     // Extract the key from the imageUrl by removing the protocol (https://) and bucket name
            //     const key = imageUrl  // Everything after amazonaws.com/
    
            //     if (!key) {
            //         console.error("Failed to extract key from imageUrl:", imageUrl);
            //         return res.status(500).json({ message: "Failed to extract image key from URL" });
            //     }
    
            //     console.log("Extracted key:", key);
    
            //     // Define the S3 delete parameters (region is already configured in the AWS SDK client)
            //     const s3Params = {
            //         Bucket: process.env.AWS_BUCKET_NAME,  // Your S3 bucket name
            //         Key: key,  // The extracted key from the image URL
            //     };
    
            //     // Delete the image from S3
            //     await s3Client.deleteObject(s3Params).promise();
            //     console.log("Image deleted successfully from S3.");
            // }
    
            // Remove the metadata item from the metaData array
            dataDocument.about.metaData = dataDocument.about.metaData.filter(item => item._id.toString() !== id);
    
            // Save the updated document
            await dataDocument.save();
    
            // Send a success response
            return res.status(200).json({
                status: 200,
                type: 'aboutDeleteOne',
                message: "Item deleted successfully, and image removed from S3",
            });
        } catch (error) {
            console.error("Error deleting item:", error.message);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // PUT route to update metaData in about
    route.put('/:id', uploadSingle, async (req, res) => {
        const { id } = req.params;  // Unique ID of the item to update
        const { title, content, btnTitle, buttonUrl } = req.body;  // Extract other fields from the request body
        const newImage = req.file;  // The image uploaded by the user (if any)

        try {
            // Decode the admin ID from the token (if required)
            const adminId = jwt.decode(req.headers.authorization, key);  // Replace 'your-secret-key' with your JWT secret key
            
            // Fetch the document containing about data
            const dataDocument = await DataModel.findOne({ 'about.metaData._id': id });

            if (!dataDocument) {
                return res.status(404).json({ message: "Item not found" });
            }

            // Find the index of the item to update
            const metadataItemIndex = dataDocument.about.metaData.findIndex(item => item._id.toString() === id);
            
            if (metadataItemIndex === -1) {
                return res.status(404).json({ message: "Metadata item not found" });
            }

            // Get the current metadata item
            const currentItem = dataDocument.about.metaData[metadataItemIndex];

            // Prepare the updated item data
            const updatedItem = {
                title,
                content,
                button: {
                    title: btnTitle,
                    url: buttonUrl,
                }
            };

            // If a new image is uploaded, delete the old one and upload the new image
            if (newImage) {
                // Delete the existing image from S3 if it exists
                if (currentItem.imageUrl) {
                    const imageKey = currentItem.imageUrl.split("amazonaws.com/")[1]; // Extract S3 key from URL
                    if (imageKey) {
                        await deleteImageFromS3(imageKey); // Delete the old image from S3
                    }
                }

                // Upload the new image to S3
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = path.extname(newImage.originalname);
                const newImageKey = `about/${uniqueSuffix}${fileExtension}`;

                const uploadParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: newImageKey,
                    Body: newImage.buffer,
                    ContentType: newImage.mimetype,
                    ACL: 'public-read',  // Make it publicly readable
                };

                // Upload image to S3
                const uploadResult = await s3Client.upload(uploadParams).promise();

                // Update the imageUrl in the updated item
                updatedItem.imageUrl = uploadResult.Location;
            } else {
                // If no new image is provided, keep the old imageUrl
                updatedItem.imageUrl = currentItem.imageUrl;
            }

            // Update the metadata in the database
            dataDocument.about.metaData[metadataItemIndex] = {
                ...dataDocument.about.metaData[metadataItemIndex],
                ...updatedItem,
            };

            await dataDocument.save();  // Save the updated document

            // Respond with success message
            res.status(200).json({
                status : 200,
                type : 'aboutUpdate',
                message: "Item updated successfully",
                result: {updatedItem, id},
            });
        } catch (error) {
            console.error("Error updating item:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Route to handle deletion of all the about data and images from S3
    route.delete("/", async (req, res) => {
        const adminid = req.headers.authorization;

        if (!adminid) {
            return res.status(403).json({ message: "Unauthorized, admin ID missing" });
        }

        try {
            // Verify JWT token
            const decoded = jwt.verify(adminid, key);
            if (!decoded) {
                return res.status(403).json({ message: "Unauthorized, invalid token" });
            }

            // Fetch the data document that contains the about section
            const dataDocument = await DataModel.findOne({});
            if (!dataDocument) {
                return res.status(404).json({ message: "Data not found" });
            }

            // Check if the about section has metaData and if there are images to delete
            const aboutMetaData = dataDocument.about.metaData;
            if (aboutMetaData && aboutMetaData.length > 0) {
                // Delete images from S3
                for (let item of aboutMetaData) {
                    if (item.imageUrl) {
                        const imageKey = item.imageUrl.split("amazonaws.com/")[1]; // Extract the key from the S3 URL
                        if (imageKey) {
                            await deleteImageFromS3(imageKey); // Delete the image from S3
                        }
                    }
                }

                // Clear the about.metaData array in the database
                dataDocument.about.metaData = [];

                // Delete the createdAt field from the about section
                if (dataDocument.about.createdAt) {
                    dataDocument.about.createdAt = '';
                }

                // Save the document with the cleared about section
                await dataDocument.save();
            }

            // Respond with success
            res.status(200).json({
                status: 200,
                type : 'aboutDeleteMany',
                message: "All about data and images deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting all about data:", error.message);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    });



  return route;
};

const route = require('express').Router();
const jwt = require('jsonwebtoken');
const adminModel = require('../../model/AdminSchema');
const key = require('../../config/token_Keys');
const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
require('dotenv').config();

// Initialize S3 client
const s3Client = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Multer setup to handle file uploads to memory
const storageForFeaturedImage = multer.memoryStorage();
const upload = multer({ storage: storageForFeaturedImage }).single('featuredImage');

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

// Blog post route
route.post('/', upload, async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date, description, status, category, tags, seoTitle, index, seoDescription, permalink } = req.body;

        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        if (isThisAdmin) {
            try {
                let uniquePermalink = permalink;

                // Check for existing permalink and append suffix if necessary
                let counter = 2;
                while (await adminModel.findOne({ "blog.permalink": uniquePermalink })) {
                    uniquePermalink = `${permalink}-${counter}`;
                    counter++;
                }

                let s3ImageUrl = '';
                let imageName = '';

                if (req.file) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const extension = path.extname(req.file.originalname);
                    imageName = `profile/${uniqueSuffix}${extension}`;

                    // Upload image directly to S3
                    await s3Client.upload({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: imageName,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype,
                        ACL: 'public-read',
                    }).promise();

                    // Construct the URL of the uploaded image
                    s3ImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
                }

                // Create a new blog object with the image URL
                const newBlog = {
                    title,
                    content,
                    status,
                    tags: JSON.parse(tags),
                    category: JSON.parse(category),
                    createdat: date,
                    description,
                    seoDescription,
                    seoTitle,
                    index,
                    permalink: uniquePermalink,
                    featuredImage: {
                        name: req.file?.originalname || null,
                        path: s3ImageUrl, // Save the S3 URL in the database
                    }
                };

                // Push the new blog into the admin's blog array and retrieve only the new entry
                const updateResult = await adminModel.findOneAndUpdate(
                    { _id: ID?.id },
                    { $push: { blog: newBlog } },
                    { new: true, projection: { "blog": { $slice: -1 } } }
                );

                const latestBlog = updateResult.blog[0]; // Only the newly added blog

                res.send({
                    status: 200,
                    type: 'blog',
                    message: 'Blog Posted Successfully',
                    blog: latestBlog
                });
            } catch (error) {
                console.error('Error uploading to S3:', error);
                res.status(500).send({ status: 500, message: 'Error uploading to S3' });
            }
        } else {
            res.status(403).send({ status: 403, message: 'Unauthorized' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

route.post('/edit', upload, async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date, id, description, status, category, tags, seoTitle, index, seoDescription, permalink } = req.body;
        // console.log(index, seoDescription, seoTitle)

        // Parse `category` and `tags` fields from JSON.stringify format
        let parsedCategory = [];
        let parsedTags = [];
        try {
            parsedCategory = JSON.parse(category);
            parsedTags = JSON.parse(tags);
        } catch (parseError) {
            console.error('Error parsing category or tags:', parseError);
            return res.status(400).send({ status: 400, message: 'Invalid format for category or tags' });
        }

        try {
            const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
            
            if (!isThisAdmin) {
                return res.status(403).send({ status: 403, message: 'Unauthorized' });
            }

            // Find the specific blog post using the ID from the body
            const blogPostIndex = isThisAdmin.blog.findIndex(blog => blog._id.toString() === id);
            if (blogPostIndex === -1) {
                return res.status(404).send({ status: 404, message: 'Blog post not found' });
            }

            const blogPost = isThisAdmin.blog[blogPostIndex];
            
            const updatedBlogData = {
                ...blogPost._doc,
                title,
                content,
                description,
                category: parsedCategory,
                status,
                tags: parsedTags,
                createdat: date,
                seoDescription,
                seoTitle,
                index,
                permalink
            };

            if (req.file) {
                const oldImagePath = blogPost.featuredImage?.path;
                if (oldImagePath) {
                    await deleteImageFromS3(oldImagePath);
                }

                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = path.extname(req.file.originalname);
                const newFilename = `profile/${uniqueSuffix}${extension}`;

                await s3Client.upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: newFilename,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                    ACL: 'public-read',
                }).promise();

                const s3ImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFilename}`;

                updatedBlogData.featuredImage = {
                    name: req.file.originalname,
                    path: s3ImageUrl
                };
            }

            isThisAdmin.blog[blogPostIndex] = updatedBlogData;

            await isThisAdmin.save();

            res.send({
                status: 200,
                type: 'blog',
                message: 'Blog updated successfully',
                blog: updatedBlogData
            });
        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

// Delete Blog Route
route.delete('/delete/:blogId', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);

        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        if (isThisAdmin) {
            try {
                const blog = await adminModel.findOne({ 'blog._id': req.params.blogId });

                if (blog) {
                    const blogIndex = blog.blog.findIndex(b => b._id.toString() === req.params.blogId);
                    const featuredImage = blog.blog[blogIndex].featuredImage;

                    if (featuredImage && featuredImage.path) {
                        await deleteImageFromS3(featuredImage.path);
                    }

                    blog.blog.splice(blogIndex, 1);
                    await blog.save();

                    res.send({
                        status: 200,
                        message: 'Blog Deleted Successfully',
                        type : 'blogDelete'
                    });
                } else {
                    res.status(404).send({ status: 404, message: 'Blog not found' });
                }
            } catch (error) {
                console.error('Error deleting blog:', error);
                res.status(500).send({ status: 500, message: 'Error deleting blog' });
            }
        } else {
            res.status(403).send({ status: 403, message: 'Unauthorized' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

route.post('/category', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { category } = req.body;
        
        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        
        if (!isThisAdmin) {
            return res.status(403).send({ status: 403, message: 'Unauthorized' });
        }

        // Check if the category already exists (case-insensitive)
        const categoryExists = isThisAdmin.blogCategory?.some(
            (cat) => cat.toLowerCase() === category.toLowerCase()
        );

        if (categoryExists) {
            return res.send({
                status: 409,
                message: 'Category already exists',
                type: 'addBlogCategory'
            });
        }

        // Add the new category if it doesn't exist
        await adminModel.updateOne({ _id: ID?.id }, { $push: { blogCategory: category } });
        
        res.send({
            status: 200,
            message: 'Blog Category added successfully',
            type: 'addBlogCategory'
        });
    } else {
        res.status(401).send({ status: 401, message: 'Authorization header missing' });
    }
});

route.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    try {
        // Find the admin document
        const admin = await adminModel.findOne();

        if (!admin || !admin.blog) {
            return res.status(404).json({ status: 404, message: 'No blogs found' });
        }

        // Filter and paginate blogs within the blog array
        const publishedBlogs = admin.blog;
        const totalBlogs = publishedBlogs.length;

        // Paginate the filtered blogs
        const paginatedBlogs = publishedBlogs.slice(skip, skip + limit);

        res.status(200).json({
            status: 200,
            data: paginatedBlogs,
            totalBlogs,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
});

route.delete('/:name', async (req, res) => {
    if (req.headers.authorization) {
        try {
            // Decode the JWT from the authorization header
            const ID = jwt.decode(req.headers.authorization, key);
            const { name } = req.params;
            // console.log(name)

            // Check if the user is an admin
            const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
            
            if (!isThisAdmin) {
                return res.status(403).send({ status: 403, message: 'Unauthorized' });
            }

            // Check if the category exists (case-insensitive)
            const categoryIndex = isThisAdmin.blogCategory?.findIndex(
                (cat) => cat.toLowerCase() === name.toLowerCase()
            );

            if (categoryIndex === -1) {
                return res.status(404).send({
                    status: 404,
                    message: 'Category not found',
                    type: 'deleteBlogCategory'
                });
            }

            // Pull the category from the array
            await adminModel.updateOne(
                { _id: ID?.id },
                { $pull: { blogCategory: isThisAdmin.blogCategory[categoryIndex] } }
            );

            return res.send({
                status: 200,
                message: 'Blog Category deleted successfully',
                type: 'deleteBlogCategory'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: 'Internal server error',
                error: error.message,
            });
        }
    } else {
        return res.status(401).send({ status: 401, message: 'Authorization header missing' });
    }
});




module.exports = route;
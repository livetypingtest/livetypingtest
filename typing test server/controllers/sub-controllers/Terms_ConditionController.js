
module.exports = (adminModel, DataModel, key) => {
    const route = require('express').Router();
    const jwt = require('jsonwebtoken');

    // GET route to retrieve the termsCondition data
route.get('/', async (req, res) => {
    try {
        const data = await DataModel.find({}); // Fetch only the termsCondition field
        // console.log(data[0]?.termsCondition)
        if (data?.length !== 0) {
            res.status(200).json({
                status : 200,
                message: "termsCondition retrieved successfully.",
                type: "termsCondition",
                result: data[0],
            });
        } else {
            res.status(404).json({
                message: "termsCondition not found.",
                type: "termsCondition",
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving termsCondition", error });
    }
});

// POST route for creating or updating termsCondition data
route.post('/', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date } = req.body;
        const isAdmin = await adminModel.findOne({ _id: ID?.id });

        if (isAdmin) {
            try {
                // Update termsCondition if it exists, or insert it if it doesn't
                const updateResult = await DataModel.updateOne(
                    {},  // filter for matching document; leave empty if updating the first document
                    { 
                        $set: { "termsCondition": { title, content, createdat : date } } 
                    },
                    { upsert: true }  // creates the document if it doesn't exist
                );
                res.status(200).json({
                    status : 200,
                    message: "termsCondition updated or created successfully.",
                    type: "termsCondition",
                    result: { title, content, createdat : date }
                });
            } catch (error) {
                res.status(500).json({ message: "Error updating termsCondition", error });
            }
        } else {
            res.status(403).send("Unauthorized");
        }
    } else {
        res.status(400).send("Authorization header missing.");
    }
});

// DELETE route to remove the termsCondition data
route.delete('/', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const isAdmin = await adminModel.findOne({ _id: ID?.id });

        if (isAdmin) {
            try {
                // Remove only the termsCondition field from the document
                const deleteResult = await DataModel.updateOne(
                    {},  // filter for matching document; leave empty if targeting the first document
                    { $unset: { termsCondition: {title : '', content : '', createdat : Date.now()} } }
                );

                if (deleteResult.modifiedCount > 0) {
                    res.status(200).json({
                        status : 200,
                        message: "termsCondition deleted successfully.",
                        type: "termsCondition",
                    });
                } else {
                    res.status(404).json({
                        message: "termsCondition not found or already deleted.",
                        type: "termsCondition",
                    });
                }
            } catch (error) {
                res.status(500).json({ message: "Error deleting termsCondition", error });
            }
        } else {
            res.status(403).send("Unauthorized");
        }
    } else {
        res.status(400).send("Authorization header missing.");
    }
});


    return route;
};

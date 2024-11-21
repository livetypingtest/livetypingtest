module.exports = (adminModel, DataModel, key) => {
    const route = require('express').Router();
    const jwt = require('jsonwebtoken');

    // GET route to retrieve the privacyPolicy data
    route.get('/', async (req, res) => {
        try {
            const data = await DataModel.findOne({}, { privacyPolicy: 1, _id: 0 }); // Fetch only the privacyPolicy field
            if (data && data.privacyPolicy) {
                res.status(200).json({
                    status : 200,
                    message: "privacyPolicy retrieved successfully.",
                    type: "privacyPolicy",
                    result: data.privacyPolicy,
                });
            } else {
                res.status(404).json({
                    message: "privacyPolicy not found.",
                    type: "privacyPolicy",
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving privacyPolicy", error });
        }
    });

    // POST route for creating or updating privacyPolicy data
    route.post('/', async (req, res) => {
        if (req.headers.authorization) {
            const ID = jwt.decode(req.headers.authorization, key);
            const { title, content, date } = req.body;
            const isAdmin = await adminModel.findOne({ _id: ID?.id });

            if (isAdmin) {
                try {
                    // Update privacyPolicy if it exists, or insert it if it doesn't
                    const updateResult = await DataModel.updateOne(
                        {},  // filter for matching document; leave empty if updating the first document
                        { 
                            $set: { "privacyPolicy": { title, content, createdat : date } } 
                        },
                        { upsert: true }  // creates the document if it doesn't exist
                    );

                    res.status(200).json({
                        status : 200,
                        message: "privacyPolicy updated or created successfully.",
                        type: "privacyPolicy",
                        result: { title, content, createdat : date }
                    });
                } catch (error) {
                    res.status(500).json({ message: "Error updating privacyPolicy", error });
                }
            } else {
                res.status(403).send("Unauthorized");
            }
        } else {
            res.status(400).send("Authorization header missing.");
        }
    });

    // DELETE route to remove the privacyPolicy data
    route.delete('/', async (req, res) => {
        if (req.headers.authorization) {
            const ID = jwt.decode(req.headers.authorization, key);
            const isAdmin = await adminModel.findOne({ _id: ID?.id });

            if (isAdmin) {
                try {
                    // Remove only the privacyPolicy field from the document
                    const deleteResult = await DataModel.updateOne(
                        {},  // filter for matching document; leave empty if targeting the first document
                        { $unset: { privacyPolicy: "" } }
                    );

                    if (deleteResult.modifiedCount > 0) {
                        res.status(200).json({
                            status : 200,
                            message: "privacyPolicy deleted successfully.",
                            type: "privacyPolicy",
                        });
                    } else {
                        res.status(404).json({
                            message: "privacyPolicy not found or already deleted.",
                            type: "privacyPolicy",
                        });
                    }
                } catch (error) {
                    res.status(500).json({ message: "Error deleting privacyPolicy", error });
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

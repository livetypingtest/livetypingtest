module.exports = (adminModel, DataModel, key) => {
    const express = require('express');
    const route = express.Router();
    const userModel = require('../../model/UserSchema');

    // Route to update the notice
    route.post('/', async (req, res) => {
        try {
            const notice = req.body; // Ensure the `notice` is sent in the correct structure

            // Update the notice in the database
            await DataModel.updateOne({}, { $set: { notice } });
            return res.send({ status: 200, type: 'notice', message: 'Notice Updated Successfully' });
        } catch (error) {
            console.error('Error updating notice:', error);
            return res.status(500).send({ status: 500, type: 'error', message: 'Internal Server Error' });
        }
    });

    // Route to update the notice
    route.put('/:state', async (req, res) => {
        try {
            const { state } = req.params; // Extract the `state` field from the request body

            // Update the `state` field of the `notice` object in the database
            await DataModel.updateOne({}, { $set: { 'notice.state': state } });

            return res.send({ status: 200, type: 'notice-status', message: 'Notice Updated Successfully' });
        } catch (error) {
            console.error('Error updating notice:', error);
            return res.status(500).send({ status: 500, type: 'error', message: 'Internal Server Error' });
        }
    });


    // Route to get the notice
    route.get('/', async (req, res) => {
        try {
            // Fetch the notice from the database
            const data = await DataModel.findOne({}, { notice: 1 }); // Fetch only the `notice` field
            const notice = data?.notice;

            console.log(notice)

            return res.send({
                status: 200,
                type: 'notice',
                message: 'Notice fetched successfully',
                result: notice || 'No notice available',
            });
        } catch (error) {
            console.error('Error fetching notice:', error);
            return res.status(500).send({ status: 500, type: 'error', message: 'Internal Server Error' });
        }
    });

    return route;
};

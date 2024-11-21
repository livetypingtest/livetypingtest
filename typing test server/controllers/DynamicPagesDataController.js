const routes = require('express').Router();
const adminModel = require('../model/AdminSchema');
const DataModel = require('../model/DynamicPagesDataSchema');
const key = require('../config/token_Keys');

// Import and pass dependencies to each controller
routes.use('/about', require('../controllers/sub-controllers/AboutController')(adminModel, DataModel, key));
routes.use('/term-condition', require('../controllers/sub-controllers/Terms_ConditionController')(adminModel, DataModel, key));
routes.use('/privacy-policy', require('../controllers/sub-controllers/Privacy_PolicyController')(adminModel, DataModel, key));
routes.use('/contact', require('../controllers/sub-controllers/ContactController')(adminModel, DataModel, key));

module.exports = routes;

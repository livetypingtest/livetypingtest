const routes = require('express').Router();

routes.use('/', require('../controllers/DynamicPagesDataController'));
routes.use('/admin', require('../controllers/AdminController'));
routes.use('/user', require('../controllers/UserController'));

module.exports = routes;
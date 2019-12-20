const Router = require('express').Router();
const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');
const postRoute = require('./routes/postRoute');

Router.use('/auth', userRoute);
Router.use('/post', postRoute);
Router.use('/upload', uploadRoute);

module.exports = Router;
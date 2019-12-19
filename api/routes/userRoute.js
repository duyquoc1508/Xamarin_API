const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController')
const multer = require('multer');

var storage = multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    callback(null, './public/avatars');
  },
  filename: function (req, file, callback) {
    callback(null, 'avt-' + Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage });

/**
 * get user profile
 * @link http://localhost:3000/auth/profile
 */
Router.get('/profile', userController.loginRequired, userController.getUserProfile)

/**
 * register new user
 * @link http://localhost:3000/auth/register
 */
Router.post('/register', userController.register);

/**
 * login
 * @link http://localhost:3000/auth/login
 * @returns tokens
 */
Router.post('/login', userController.login);

/**
 * update user profile
 * @link http://localhost:3000/auth/update
 */
Router.put('/update', upload.single('image'), userController.loginRequired, userController.update);


module.exports = Router;




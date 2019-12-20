const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');

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
Router.put('/update', userController.loginRequired, userController.update);


module.exports = Router;




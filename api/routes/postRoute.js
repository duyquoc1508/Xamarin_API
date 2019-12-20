const express = require('express');
const Router = express.Router();
const userHandlers = require('../controllers/userController');
const postController = require('../controllers/postController');

/**
 * get all posts of all user
 * @link http://localhost:3000/post
 */
Router.get('/', userHandlers.loginRequired, postController.getAllPosts)

/**
 * get all posts of mine
 * @link http://localhost:3000/post/timeline
 */
Router.get('/timeline', userHandlers.loginRequired, postController.getAllPostOfUser);

/**
 * create new post
 * @link http://localhost:3000/post
 */
Router.post('/', userHandlers.loginRequired, postController.createPost);

/**
 * like for post
 * @link http://localhost:3000/post/{postId}
 * @param {String} postId
 */
Router.put('/:postId', userHandlers.loginRequired, postController.likePost);

/**
 * delete post
 * @link http://localhost:3000/post/{postId}
 * @param {String} postId
 */
Router.delete('/:postId', userHandlers.loginRequired, postController.deletePost);

module.exports = Router
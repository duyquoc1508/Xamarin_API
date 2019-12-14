const express = require('express');
const Router = express.Router();
const userHandlers = require('../controllers/userController');
const postController = require('../controllers/postController')
const multer = require('multer');

var storage = multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
    callback(null, 'post-' + Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage });

/**
 * get all posts of user
 * @link https://localhost:300/{userId}
 * @param {String} userId
 */
Router.get('/:userId', postController.getAllPostOfUser)

/**
 * get all posts of all user
 * @link http://localhost:3000/post
 */
Router.get('/', postController.getAllPosts)

/**
 * create new post
 * @link http://localhost:3000/post
 */
Router.post('/', userHandlers.loginRequired, upload.single('image'), postController.createPost);

/**
 * like for post
 * @link http://localhost:3000/post/{postId}
 * @param {String} postId
 */
Router.put('/:postId', userHandlers.loginRequired, postController.likePost);

/**
 * delete post
 * @link http://localhost:3000/{postId}
 * @param {String} postId
 */
Router.delete('/:postId', userHandlers.loginRequired, postController.deletePost);




module.exports = Router
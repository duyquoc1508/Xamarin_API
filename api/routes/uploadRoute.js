const express = require('express');
const multer = require('multer');
const userHandlers = require('../controllers/userController');
const uploadController = require('../controllers/uploadController');
const Router = express.Router();

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

/**
 * upload image
 * @link http://localhost:3000/upload
 */
Router.post('/', userHandlers.loginRequired, upload.single('image'), uploadController.uploadFile);

/**
 * delete image
 * @link http://localhost:3000/upload
 */
Router.delete('/', userHandlers.loginRequired, uploadController.deleteFile);

module.exports = Router;
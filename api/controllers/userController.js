require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const download = require('image-downloader')
const path = require('path');
const uuidv1 = require('uuid').v1;


const validateEmail = email => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

module.exports = {
  register: async (req, res) => {
    try {
      if (!req.body.password) {
        return res.status(400).send({ message: 'Password is required!' });
      }
      if (!validateEmail(req.body.email)) {
        return res.status(400).send({ message: 'Email is invalid!' })
      }
      const user = new User(req.body);
      user.hash_password = bcrypt.hashSync(req.body.password, 10);
      const newUser = await user.save();
      newUser.hash_password = undefined;
      res.status(200).json(newUser);
    }
    catch (error) {
      if (error.code === 11000) {
        //input validation failure: 400 Bad Request
        return res.status(400).send({ message: 'This email is already taken!' })
      }
      res.status(500).json({ message: error.message });
    }
  },

  loginWithFacebook: async (req, res) => {
    try {
      if (!req.body.password) {
        return res.status(400).send({ message: 'Password is required!' });
      }
      //download image from fb to server
      let img_name = `${uuidv1().replace(/-/g, '_')}.jpg`
      let image_path = path.join(__dirname, `../../public/upload/${img_name}`);
      let listUser = await User.find({});
      let arrayEmailRegisted = listUser.map(item => item.email);
      let index = arrayEmailRegisted.indexOf((req.body.id + '@gmail.com'));
      //if email exists in database
      if (index != -1) {
        if (!listUser[index].comparePassword(req.body.password)) {
          return res.status(400).send({ message: 'This email is already taken!' })
        }
        return res.status(200).json({
          token: jwt.sign({
            email: listUser[index].email,
            username: listUser[index].username,
            _id: listUser[index]._id
          }, process.env.SECRET)
        });
      } else {
        download.image({
          url: req.body.imagePath,
          dest: image_path
        })
          .then(({ filename, image }) => {
            const user = req.body;
            //create email from id of user facebook
            user.email = req.body.id + "@gmail.com";
            user.avatar = img_name;
            user.created = undefined;
            user.hash_password = bcrypt.hashSync(req.body.password, 10);
            User.create(user, (error, data) => {
              if (error) {
                res.status(500).json({ message: error.message });
              } else {
                //return token
                res.status(200).json({
                  token: jwt.sign({
                    email: data.email,
                    username: data.username,
                    _id: data._id
                  }, process.env.SECRET)
                });
              }
            })
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          })
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send({ message: 'User not found!' });
      }
      if (!user.comparePassword(req.body.password)) {
        return res.status(401).send({ message: 'Authentication failed. Wrong password!' });
      }
      else {
        res.status(200).json({
          token: jwt.sign({
            email: user.email,
            username: user.username,
            _id: user._id
          }, process.env.SECRET)
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  update: async (req, res) => {
    let newUser = req.body;
    newUser.created = undefined;
    if (req.body.password) {
      newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    }
    try {
      if (req.body.email) {
        if (!validation(req.body.email)) {
          return res.status(400).send({ message: 'Email invalid.' })
        } else {
          newUser.email = req.body.email;
        }
      }
      await User.findByIdAndUpdate({ _id: req.user._id }, newUser);
      res.status(200).send({ message: 'Update user successfully!' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).send({ message: 'This email is already taken!' })
      }
      res.status(500).json({ message: error });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-hash_password");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  loginRequired: async (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
  },
}
require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
      res.status(500).json({ message: error });
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
            fullName: user.fullName,
            _id: user._id
          }, process.env.SECRET)
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  update: async (req, res) => {
    let newUser = {
      username: req.body.username
    };
    if (req.body.password) {
      newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.file) {
      //if exists file => update file
      newUser.avatar = req.file.filename;
    }
    try {
      if (req.body.email && validateEmail(req.body.email)) {
        newUser.email = req.body.email;
      } else {
        return res.status(400).send({ message: 'Email invalid.' });
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
      res.status(200).json({ user });
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
require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  register: async (req, res) => {
    try {
      if (!req.body.password) {
        throw new Error('Password is required!')
      }
      const user = new User(req.body);
      user.hash_password = bcrypt.hashSync(req.body.password, 10);
      const newUser = await user.save();
      newUser.hash_password = undefined;
      return res.status(200).json(newUser);
    }
    catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(401).json({ message: 'Authentication failed. User not found.' });
      }
      if (!user.comparePassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      }
      else {
        res.status(200).json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, process.env.SECRET) });
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
    const validateEmail = email => {
      const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return re.test(email);
    };
    try {
      if (req.body.email) {
        if (validateEmail(req.body.email)) newUser.email = req.body.email;
        else throw new Error("Please provide a valid email address!");
      }
      const user = await User.findByIdAndUpdate({ _id: req.user._id }, newUser);
      if (!user) {
        res.status(404).json({ message: 'User not found!' })
      }
      res.status(200).json({ message: "Update user successfully!" });
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
  }
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const validateEmail = email => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
};

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required!']
  },
  email: {
    type: String,
    unique: [true, 'Email address is already!'],
    lowercase: true,
    trim: true,
    required: [true, 'Email is required!'],
    validators: [validateEmail, "Email is invalid!"]
  },
  hash_password: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: "avt_default.png"
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  relationship: {
    type: String,
  },
  phone: {
    type: String,
  }
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
}

module.exports = mongoose.model('User', UserSchema);
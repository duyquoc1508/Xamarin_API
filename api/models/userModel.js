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
    required: [true, 'Full name is required']
  },
  // name: {
  //   type: String,
  //   default: null
  // },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'Email is required'],
    validators: [validateEmail, "Email is invalid"]
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
  }
});



UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
}

// UserSchema.pre('save', function (next) {
//   this.name = this.username;
//   return next();
// })

module.exports = mongoose.model('User', UserSchema);
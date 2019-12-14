const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  status: {
    type: String,
    // required: true
  },
  image: {
    type: String,
    // required: true
  },
  time_created: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: String
  },
  amount_like: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Post', PostSchema)
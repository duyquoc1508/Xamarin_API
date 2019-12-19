const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  image: {
    type: String,
  },
  time_created: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // type: String,
  },
  like: [{
    type: String
  }]
});

module.exports = mongoose.model('Post', PostSchema);
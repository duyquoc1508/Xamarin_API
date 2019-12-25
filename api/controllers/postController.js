const Post = require('../models/postModel')
const fs = require('fs')

module.exports = {
  createPost: async (req, res) => {
    const post = {
      status: req.body.status,
      image: req.body.image
    }
    post.user_id = req.user._id;
    try {
      const newPost = await Post.create(post);
      return res.status(201).json(newPost);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) { res.status(404).send({ message: 'Post not found!' }) }
      if (req.user._id !== post.user_id) {
        return res.status(403).send({ message: 'Access denied!' })
      }
      if (post.image !== "avt_default.png") {
        fs.unlinkSync(`./public/upload/${post.image}`);
      }
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).send({ message: 'Delete sucessfully!' })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  },

  likePost: async (req, res) => {
    try {
      var message = 'Unlike';
      const post = await Post.findById(req.params.postId);
      if (!post) { return res.status(404).json({ message: 'Post not found' }); }
      //if id_user exists in post.like => unlike
      if (post.like.includes(req.user._id)) {
        await Post.findOneAndUpdate({
          _id: req.params.postId
        },
          { $pull: { like: req.user._id } }
        );
      } else {
        await Post.findByIdAndUpdate({
          _id: req.params.postId,
        },
          { $push: { like: req.user._id } }
        );
        message = 'Like';
      }
      return res.status(200).send({ message: `${message} Successfully!` })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // timeline (private page)
  getAllPostOfUser: async (req, res) => {
    try {
      const posts = await Post.find({ user_id: req.user._id }).sort({ _id: -1 });
      const newPosts = posts.map(item => item.toObject());
      let listPosts = [];
      newPosts.forEach(item => {
        let liked = false;
        if (item.like.includes(req.user._id)) {
          liked = true;
        }
        item["amount_like"] = item.like.length;
        item["liked"] = liked;
        listPosts.push(item);
      });
      res.status(200).json(listPosts);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  //post show home page
  //return newest to oldest
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find({}).populate("user_id")
        .populate({
          path: "user_id",
          select: "avatar username"
        })
        .sort({ _id: -1 });
      // convert to object because Mongoose Models inherit from Documents, which have a toObject() method
      const newPosts = posts.map(item => item.toObject());
      let listPosts = [];
      newPosts.forEach(item => {
        let liked = false;
        if (item.like.includes(req.user._id)) {
          liked = true;
        }
        item["amount_like"] = item.like.length;
        item["liked"] = liked;
        listPosts.push(item);
      });
      res.status(200).json(listPosts);
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
const Post = require('../models/postModel')
const fs = require('fs')

module.exports = {
  createPost: async (req, res) => {
    const post = {
      status: req.body.status,
      user_id: req.user._id
    }
    if (req.file) {
      //if exists file => update file
      post.image = req.file.filename;
    }
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
      if (!post) { res.status(404).send({ message: 'Post not found' }) }
      if (req.user._id !== post.user_id) {
        return res.status(403).send({ message: 'Access denied' })
      }
      if (post.image) {
        fs.unlinkSync(`./public/images/${post.image}`);
      }
      await Post.findByIdAndDelete(req.params.postId);
      return res.status(200).send({ message: 'Delete sucessfully!' })
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.postId,
        { $inc: { amount_like: +1 } }
      );
      if (!post) { return res.status(404).json({ message: 'Post not found' }); }
      res.status(200).json({ message: 'Like post successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // private page
  getAllPostOfUser: async (req, res) => {
    try {
      const posts = await Post.find({ user_id: req.params.userId }).sort({ _id: -1 });
      if (!posts)
        return res.status(404).json({ message: 'No posts found!' })
      res.status(200).json({ posts })
    } catch (error) {
      res.status(500).message({ message: error.message })
    }
  },

  //post show home page
  //return newest to oldest
  getAllPosts: async (req, res) => {
    try {
      let posts = await Post.find({}).sort({ _id: -1 });
      res.status(200).json({ posts });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
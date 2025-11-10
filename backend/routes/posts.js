const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

// GET /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("authorId", "username avatar");
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /api/posts
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    let imageUrl = null;
    if (req.file && process.env.CLOUDINARY_CLOUD_NAME) {
      const streamifier = require("streamifier");
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "mini-social" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      const result = await uploadPromise;
      imageUrl = result.secure_url;
    }

    if (!req.body.text && !imageUrl)
      return res.status(400).json({ message: "Post must contain text or image" });

    const post = new Post({ authorId: user._id, authorName: user.username, text: req.body.text, image: imageUrl });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /api/posts/:id/like
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();

    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /api/posts/:id/comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    if (!post || !user) return res.status(404).json({ message: "Not found" });

    const comment = { userId: user._id, username: user.username, text };
    post.comments.push(comment);
    await post.save();

    res.json({ comment, commentsCount: post.comments.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;

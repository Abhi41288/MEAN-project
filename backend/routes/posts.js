const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLocaleLowerCase()
      .split(" ")
      .join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log("ext:  ", ext);
    cb(null, name + "_" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });

    post
      .save()
      .then(createdPost => {
        res.status(201).json({
          message: "posted successfully",
          post: {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "creating post failed"
        });
      });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .find()
    .then(document => {
      fetchedPosts = document;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "posts fetching failed"
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "could not fetch post for given Id"
      });
    });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(updated => {
        if (updated.nModified > 0) {
          res.status(200).json({
            message: "updated successfully"
          });
        } else {
          res.status(401).json({
            message: "not authorized"
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "could not update post"
        });
      });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "deletion successful" });
      } else {
        res.status(401).json({
          message: "not authorized"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "could not delete post"
      });
    });
});

module.exports = router;

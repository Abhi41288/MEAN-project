const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Method", "GET,POST,PATCH,DELETE,OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json();
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "12345",
      title: "post-1",
      content: "this is coming form backend node"
    },
    {
      id: "54321",
      title: "post-2",
      content: "this is coming form backend node"
    },
    {
      id: "98765",
      title: "post-2",
      content: "this is coming form backend node"
    }
  ];
  res.status(200).json({
    message: "posts sent successfully",
    posts: posts
  });
});

module.exports = app;

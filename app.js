const express = require("express");
const app = express();
const port = 3002;
const bodyParser = require("body-parser");

const Blog = require("./models/Blog");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.bodyParser());

const mongoose = require("mongoose");
const { create } = require("./models/Blog");
const connection = mongoose.connect(
  "mongodb://127.0.0.1:27017/blog-net-ninja",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Display message in the console if the connection is successful.
mongoose.connection.once("open", () => {
  console.log("connected!");
});

const user = {
  firstName: "Tim",
  lastName: "Cook",
};

const posts = [
  { title: "Title 1", body: "Body 1" },
  { title: "Title 2", body: "Body 2" },
  { title: "Title 3", body: "Body 3" },
  { title: "Title 4", body: "Body 4" },
];

//index page route
app.get("/", (req, res) => {
  res.render("index", {
    user: user,
  });
});

//mongo express routes
//get all route
app.get("/blog", async (req, res) => {
  try {
    const myAwait = await Blog.find();
    res.render("blog", { blogs: myAwait });

    // console.log(myAwait);
  } catch (e) {
    console.log(e);
  }
});

app.get("/create", (req, res) => {
  console.log("here");
  res.render("create");
});

//post
app.post("/create2", (req, res) => {
  const blog = new Blog(req.body);
  // console.log(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
//get single blog route

app.get("/blog/:id", async (req, res) => {
  try {
    const myAwait = await Blog.findById(req.params.id);
    res.render("details", { blog: myAwait });
  } catch (e) {
    console.log(e);
  }
});

// delete blog
// app.delete("/blog/:id", async (req, res) => {
app.post("/blog-delete/:id", async (req, res) => {
  try {
    const myAwait = await Blog.findByIdAndDelete(req.params.id);
    res.json({ redirectToUrl: "/blog" });
  } catch (e) {
    console.log(e);
  }
});

//articles page/route
app.get("/articles", (req, res) => {
  res.render("articles", { articles: posts });
});

//
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

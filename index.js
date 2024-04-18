import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
const port = 3000;
var counter = 0
const post_index = []; // Declare as constant

// Configure EJS as the view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Define the Post class outside of the route handler
class Post {
  constructor(title, body) {
    counter ++

    this.id = counter
    this.title = title;
    this.body = body;
  }
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/posts", (req, res) => {
  let successMessage = "";
  let successMessageColor = "";

  if (req.query.success === "true") {
    successMessage = "Post successfully added";
    successMessageColor = "alert-success";
  } else if (req.query.deleteSuccess === "true") {
    successMessage = "Post successfully deleted";
    successMessageColor = "alert-danger";
  } else if (req.query.updateSuccess === "true") {
    successMessage = "Post successfully updated";
    successMessageColor = "alert-success";
  }

  res.render("posts", { post_index, successMessage, successMessageColor });
});

app.get("/new", (req, res) => {
  const post = {};
  res.render("new", {post});
});

app.get("/show", (req, res) => {
  const post_id = req.query.id;
  const post = post_index.find(post => post.id === parseInt(post_id))
  if (post) {
    res.render("show", {post});
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/edit", (req, res) => {
  const postId = req.query.id;
  const post = post_index.find(post => post.id === parseInt(postId));
  
  if (post) {
    res.render("edit", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/submit", (req, res) => {
  const { title, body } = req.body; // Destructure the request body

  if (!title || !body) {
    return res.status(400).send("Title and body are required");
  }

  try {
    const newPost = new Post(title, body);
    post_index.push(newPost);
    res.redirect("/posts?success=true");
  } catch (error) {
    console.error("Error creating new post:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", (req, res) => {
  const postId = req.body.postId;
  const index = post_index.findIndex(post => post.id === parseInt(postId));

  if (index !== -1) {
    post_index.splice(index, 1);
    res.redirect("/posts?deleteSuccess=true");
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:id", (req, res) => {
  const postId = req.params.id; // Get the post ID from the URL parameters
  const { title, body } = req.body; // Get the updated title and body from the request body

  // Find the post in your data store (e.g., array, database)
  const post = post_index.find(post => post.id === parseInt(postId));

  if (!post) {
    // If the post is not found, send a 404 response
    return res.status(404).send("Post not found");
  }

  // Update the post with the new title and body
  post.title = title;
  post.body = body;

  // Send a success response
  res.status(200).redirect("/posts?updateSuccess=true");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

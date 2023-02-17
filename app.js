const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")
require('dotenv').config()

const postsArray = []
try {
  mongoose.connect(process.env.MONGO_URL).then(print => console.log("Connected MongoDB !"))
} catch (error) {
  console.log(error);
}
//*MONGOOSE LAYOUT
const postSchema = mongoose.Schema({
  title: String,
  content: String,
})
const Post = mongoose.model("Post", postSchema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); /Server Name/

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); /// Body parser urlencoded
app.use(express.static("public")); /// Express server is use 'public' folder ! 


app.get("/", (req, res) => {  //* Root Page Routing
  Post.find((err,posts) => {
    if (!err) {
      res.render(`${__dirname}/views/home`, { contentName: homeStartingContent, posts: posts })

    }
  })
  


})

app.get("/about", (req, res) => { //* About Page Routing
  res.render(`${__dirname}/views/about`, { contentName: aboutContent })
})

app.get("/contact", (req, res) => { //* Contact Page Routing 
  res.render(`${__dirname}/views/contact`, { contentName: contactContent })
})
app.get("/compose", (req, res) => { //* Compose Page Routing
  res.render(`${__dirname}/views/compose`)
})

app.get("/posts/:postId", (req, res) => { //* Post Page Routing(Dynamic)
  const requestedPostId = req.params.postId
  Post.findOne({_id: requestedPostId}, (err, post) => {

    res.render("post", {
 
      titleName: post.title,
 
      content: post.content
 
    });
 
  });

 
})


app.post("/compose", (req, res) => { //* Post request from publish btn. 
  const title = req.body.postTitle
  const content = req.body.postMessage
  if (title !== "" && content !== "") {
    const post = new Post({
      title: title,
      content: content
    });
    post.save((err) => {
      if(!err){
        res.redirect("/")
      }
    })
    

  } else {
    console.log("Empty title or content !");
    res.redirect("/compose")
  }

})


app.listen(3000, function () {
  console.log("Server started on port 3000.....!!!!");
});

var express = require('express');
var router = express.Router();
const upload = require("../config/multerConfig")
const postController = require("../controllers/postController")
const Posts = require('../model/Posts');

router.post("/newPost", upload.single('image'), postController.uploadImage)
  
router.get("/newPost", function (req, res) {
    res.render("newPost");
  });
  

  router.get('/posts', (req, res) => {
  Posts.find()
    .then((posts) => {
      res.send({ data: posts });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    });
});

module.exports = router;


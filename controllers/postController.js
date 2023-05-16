const cloudinaryConfig = require("../config/cloudinaryConfig");
const Posts = require("../model/Posts");


  const uploadImage = (req, res) => {
    const imageName = req.file.originalname
    const imageUrl=req.file.path
    //upload file to cloudinary
    cloudinaryConfig.uploads(imageUrl)
    .then((result) => {
      //Save image to DB
      const newImage= new Posts({
        name:imageName,
        url:result.url,
        address: req.body.address,
        title: req.body.title,
        city: req.body.city,
        price: req.body.price,
        phone: req.body.phone,
      });
        newImage.save();
        return res.send({data:newImage})
      })
      .catch(()=> {return res.send({message:"Problem in creating image"})})
  }

module.exports = { uploadImage }
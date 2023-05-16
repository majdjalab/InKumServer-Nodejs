const cloudinaryConfig = require("../config/cloudinaryConfig");

    const uploadImage = (req, res) => {
      const imageName = req.file.originalname
      const imageUrl=req.file.path
      //upload file to cloudinary
      cloudinaryConfig.uploads(imageUrl)
    }

    
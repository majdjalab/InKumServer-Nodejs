const multer = require('multer')
const path = require("path");

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname 
      );
    },
  });
  
const imageFilter = function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/mp4"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  };
  

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports=upload
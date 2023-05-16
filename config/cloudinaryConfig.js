const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: 'dvgym5nfu',
    api_key: '171994938688585',
    api_secret: '-FaOn9pb5EzEZSbl2x7JFC8gSDg'
});
exports.uploads = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: "auto" }
    );
  });
};
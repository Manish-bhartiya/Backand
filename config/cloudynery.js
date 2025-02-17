const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Initialize dotenv to read environment variables
dotenv.config();

cloudinary.config({
  api_key: "488375597911461",
  cloud_name: "dhfjy459o",
  api_secret: "A0QzZpmCiglwwvVDijymxv5VGEs",
});

module.exports = cloudinary;

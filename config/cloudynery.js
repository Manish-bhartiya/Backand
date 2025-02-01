const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Initialize dotenv to read environment variables
dotenv.config();

cloudinary.config({
  api_key: process.env.API_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  api_key: process.env.API_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploader = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist');
    }
    const mimeType = filePath.split('.').pop().toLowerCase();
    let resourceType = 'auto';

    const result = await cloudinary.uploader.upload(filePath,{
      resource_type: resourceType,
    });
    console.log('Upload successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = cloudinaryUploader;
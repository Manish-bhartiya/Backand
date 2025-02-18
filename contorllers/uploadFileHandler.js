const cloudinaryUploader = require('../utils/imageUploder');

const handleUpload = async (req, res) => {
  console.log(req.file);
  try {
    const uploadResponse = await cloudinaryUploader(req.file.path);
    if (uploadResponse.success) {
      return res.status(200).json({ url: uploadResponse.result.secure_url });
    } else {
      return res.status(500).json({ message: `Cloudinary upload error: ${uploadResponse.error}` });
    }
  } catch (error) {
    console.error('Error during file upload:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = handleUpload;
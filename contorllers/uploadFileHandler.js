const cloudinaryUploader = require('../utils/imageUploder');

const handleUpload = async (req, res) => {
  console.log(req.file);
  try {
    // Check for file validation errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: `File validation error: ${req.fileValidationError}` });
    }

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file to Cloudinary
    const uploadResponse = await cloudinaryUploader(req.file.path);

    // Check if upload was successful
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

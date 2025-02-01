const express = require('express');
const upload = require('../utils/multer'); // Multer middleware
const handleUpload = require('../contorllers/uploadFileHandler'); // Controller for handling the uploaded file

const cloudinaryRouter = express.Router();

// Route for uploading audio or image files
cloudinaryRouter.post('/upload', (req, res, next) => {
  // Check incoming request before Multer processes it
//   console.log('Incoming upload request:', req.body);

  next(); // Proceed to Multer middleware
}, upload, (req, res, next) => {
  // Log what Multer has processed
//   console.log('Multer processed file:', req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }

  next(); // Proceed to the handler if file is valid
}, handleUpload);

module.exports = cloudinaryRouter;

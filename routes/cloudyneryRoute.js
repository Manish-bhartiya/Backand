const express = require('express');
const upload = require('../utils/multer');
const handleUpload = require('../contorllers/uploadFileHandler');

const cloudinaryRouter = express.Router();

cloudinaryRouter.post('/upload', (req, res, next) => {
  console.log('Incoming upload request:', req.body);
  next();
}, upload, (req, res, next) => {
  console.log('Multer processed file:', req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }
  next();
}, handleUpload);

module.exports = cloudinaryRouter;
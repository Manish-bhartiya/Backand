const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const UPLOADS_DIR = './uploads/';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only audio and image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Invalid file type. Only images and audio files are allowed.';
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter }).single('file'); // 'file' is the field name

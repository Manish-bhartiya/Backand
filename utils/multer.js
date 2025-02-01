const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = './uploads/';

// Ensure the uploads directory exists
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

// File filter to allow only images and audio files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Invalid file type. Only images and audio files are allowed.';
    cb(null, false);
  }
};

// Middleware to handle single file upload (Field name: 'file')
const uploadSingle = multer({ storage, fileFilter }).single('file');

// Middleware to handle multiple file uploads (Field names: 'image' and 'audio')
const uploadMultiple = multer({ storage, fileFilter }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]);

module.exports = { uploadSingle, uploadMultiple };

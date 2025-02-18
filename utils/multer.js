const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 50000000 }
});

module.exports = upload.single('file');
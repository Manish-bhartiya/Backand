const express = require('express');
const albumtrouter = express.Router();
const albumesController = require('../contorllers/albumesController');
const upload = require('../utils/multer'); // Multer middleware for file uploads


albumtrouter.post('/createAlbum',upload,albumesController.createAlbum);
albumtrouter.get('/allAlbums', albumesController.getAllAlbums);
albumtrouter.post('/addSongsToalbum',albumesController.addSongsToAlbum);
albumtrouter.get('/:AlbumName', albumesController.getAlbumByName);




module.exports = albumtrouter;

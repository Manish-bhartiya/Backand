const express = require('express');
const albumtrouter = express.Router();
const albumesController = require('../contorllers/albumesController');

albumtrouter.post('/createAlbum', albumesController.createAlbum);
albumtrouter.get('/allAlbums', albumesController.getAllAlbums);
albumtrouter.post('/addSongsToalbum',albumesController.addSongsToAlbum);
albumtrouter.get('/:AlbumName', albumesController.getAlbumByName);




module.exports = albumtrouter;

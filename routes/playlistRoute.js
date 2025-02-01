const express = require('express');
const playlistrouter = express.Router();
const playlistController = require('../contorllers/playlistcontorller');

playlistrouter.post('/createPlaylist', playlistController.createPlaylist);
playlistrouter.get('/allPlaylist', playlistController.getAllPlaylists);
playlistrouter.post('/addToPlaylist  ', playlistController.addSongsToPlaylist);
playlistrouter.get('/get-by-name', playlistController.getPlaylistByName);
playlistrouter.get('/:playlistName', playlistController.getSongsByPlaylistName);

module.exports = playlistrouter;
    
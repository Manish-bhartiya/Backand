const express = require('express');
const searchRoute = express.Router();
const Songs = require('../models/songs');
const Playlist = require('../models/playlist');

searchRoute.get('/searchsongs', async (req, res) => {
  const { term } = req.query;
  console.log(term);
  try {
    const songQuery = { name: { $regex: term, $options: 'i' } };
    const playlistQuery = { name: { $regex: term, $options: 'i' } };

    const playlists = await Playlist.find(playlistQuery).populate('songs'); 
    const songs = await Songs.find(songQuery);
    res.json({ songs, playlists });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

module.exports = searchRoute;
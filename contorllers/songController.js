const Songs = require('../models/songs'); // Song model
const Playlist = require('../models/playlist'); // Playlist model
const cloudinaryUploader = require('../utils/imageUploder');

const createSong = async (req, res) => {
  try {
    const { name, image, artist } = req.body;
    const file = req.file;

    // Validate input
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!image) missingFields.push('image');
    if (!artist) missingFields.push('artist');
    if (!file) missingFields.push('file');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'The following fields are required:',
        missingFields,
      });
    }

    // Upload file to Cloudinary
    const { success, result, error } = await cloudinaryUploader(file.path);
    if (!success) {
      return res.status(500).json({ message: `Cloudinary upload error: ${error}` });
    }

    // Check if the artist exists in Playlist
    let existingArtist = await Playlist.findOne({ name: artist });
    if (!existingArtist) {
      existingArtist = new Playlist({
        name: artist,
        image, // Use provided image for artist
      });
      await existingArtist.save();
    }

    // Create the song
    const song = new Songs({
      name,
      image,
      artist: existingArtist.name, // Link to the artist's name
      url: result.secure_url, // Cloudinary file URL
    });

    await song.save();

    // Add the song to the artist's playlist
    existingArtist.songs.push(song._id);
    await existingArtist.save();

    res.status(201).json({ message: 'Song created successfully', song });
  } catch (error) {
    console.error('Error creating song:', error.message);
    res.status(500).json({ message: 'Error creating song', error: error.message });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const songs = await Songs.find();
    res.status(200).json({ songs, message: 'Fetched all songs successfully' });
  } catch (error) {
    console.error('Error fetching songs:', error.message);
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
};

const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Songs.findById(id);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.status(200).json({ song });
  } catch (error) {
    console.error('Error fetching song:', error.message);
    res.status(500).json({ message: 'Error fetching song', error: error.message });
  }
};

module.exports = {
  createSong,
  getAllSongs,
  getSongById,
};

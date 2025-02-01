const Playlist = require("../models/playlist");
const Songs = require("../models/songs");

// Function to create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { name, image, songs } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const songDocs = await Songs.insertMany(songs || []);
    const songIds = songDocs.map((song) => song._id);

    const data = { name, image, songs: songIds };
    console.log("Creating playlist with data: ", data);
    const result = await Playlist.create(data);
    res.status(201).json({ message: "Playlist created successfully", result });
  } catch (err) {
    console.error("Error creating playlist:", err); // Log the error
    res
      .status(500)
      .json({ message: "Error creating playlist", error: err.message });
  }
};

// Function to get all playlists
  const getAllPlaylists = async (req, res) => {
    try {
      const playlists = await Playlist.find().populate("songs");
      res
        .status(200)
        .json({ playlists, message: "Fetched all playlists successfully" });
    } catch (error) {
      console.error("Error fetching playlists:", error); // Log the error
      res
        .status(500)
        .json({ message: "Error fetching playlists", error: error.message });
    }
  };

// Function to add songs to an existing playlist bsy name
const addSongsToPlaylist = async (req, res) => {
  try {
    const { playlistName, songs } = req.body;

    console.log("Received playlist name:", playlistName);
    console.log("Received songs to add:", songs);

    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return res
        .status(400)
        .json({ message: "Songs array is required and cannot be empty" });
    }

    const playlist = await Playlist.findOne({ name: playlistName });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const songDocs = await Songs.insertMany(songs);
    const songIds = songDocs.map((song) => song._id);

    playlist.songs.push(...songIds);
    const updatedPlaylist = await playlist.save();

    console.log("Updated playlist:", updatedPlaylist);

    res
      .status(200)
      .json({ message: "Songs added successfully", playlist: updatedPlaylist });
  } catch (error) {
    console.error("Error adding songs to playlist:", error); // Log the error
    res
      .status(500)
      .json({
        message: "Error adding songs to playlist",
        error: error.message,
      });
  }
};


const getPlaylistByName = async (req, res) => {
  try {
    const { playlistName } = req.body;
    console.log(playlistName); 

   
    const playlist = await Playlist.findOne({ name: playlistName }).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ playlist });
  } catch (error) {
    console.error("Error fetching playlist:", error); 
    res.status(500).json({ message: "Error fetching playlist", error: error.message });
  }
};


const getSongsByPlaylistName = async (req, res) => {
  try {
    const { playlistName } = req.params;

    const playlist = await Playlist.findOne({ name: playlistName })
      .populate("songs")
      .exec();

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Assuming the artists field is an array of artist names
    const songs = await Songs.find({
      artist: { $regex: playlistName, $options: "i" },
    });
    if (songs.length === 0) {
      return res
        .status(404)
        .json({ message: "No songs found for the specified artist" });
    }

    console.log("Playlist:", playlist);
    console.log("Songs matching artists:", songs);

    res.status(200).json({ playlist, songs });
  } catch (error) {
    console.error("Error fetching songs by playlist name:", error);
    res
      .status(500)
      .json({
        message: "Error fetching songs by playlist name",
        error: error.message,
      });
  }
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  addSongsToPlaylist,
  getPlaylistByName,
  getSongsByPlaylistName,
};

const Albums = require('../models/albums');
const Songs = require("../models/songs");
const cloudinaryUploader = require('../utils/imageUploder');

// Function to create a new playlist
const createAlbum = async (req, res) => {
  try {
    const { name, image } = req.body;
    let songsData = req.body.songs;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Convert `songs` from JSON string (if necessary)
    if (typeof songsData === "string") {
      try {
        songsData = JSON.parse(songsData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid songs JSON", error: error.message });
      }
    }

    // Check if an album with the same name exists
    let existingAlbum = await Albums.findOne({ name });

    // Upload each song's file to Cloudinary
    for (let i = 0; i < songsData.length; i++) {
      const file = req.files?.find((file) => file.fieldname === `songs[${i}][file]`);
      
      if (!file) {
        return res.status(400).json({ message: `Missing file for song: ${songsData[i].name}` });
      }

      // Upload song file to Cloudinary
      const { success, result, error } = await cloudinaryUploader(file.path);
      if (!success) {
        return res.status(500).json({ message: `Cloudinary upload error: ${error}` });
      }

      // Store the Cloudinary URL in the song object
      songsData[i].url = result.secure_url;
    }

    // Save songs in the database
    const songDocs = await Songs.insertMany(songsData);
    const songIds = songDocs.map((song) => song._id);

    if (existingAlbum) {
      // Add songs to existing album
      existingAlbum.songs.push(...songIds);
      await existingAlbum.save();
      return res.status(200).json({ message: "Songs added to existing album", album: existingAlbum });
    }

    // Create a new album
    const newAlbum = await Albums.create({
      name,
      image,
      songs: songIds,
    });

    res.status(201).json({ message: "Album created successfully", album: newAlbum });
  } catch (error) {
    console.error("Error creating album:", error.message);
    res.status(500).json({ message: "Error creating album", error: error.message });
  }
};



const getAllAlbums = async (req, res) => {
    try {
      const albums = await Albums.find().populate("songs");
      res
        .status(200)
        .json({ albums, message: "Fetched all playlists successfully" });
    } catch (error) {
      console.error("Error fetching playlists:", error); // Log the error
      res
        .status(500)
        .json({ message: "Error fetching playlists", error: error.message });
    }
  };

  
  const addSongsToAlbum = async (req, res) => {
    try {
      const { name, songs } = req.body;
  
      console.log("Received album name:", name);
      console.log("Received songs to add:", songs);
  
      // Check if the songs array is valid
      if (!songs || !Array.isArray(songs) || songs.length === 0) {
        return res.status(400).json({ message: "Songs array is required and cannot be empty" });
      }
  
      // Find the album by name
      const album = await Albums.findOne({ name: name });
  
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
  
      // Insert the songs into the Songs collection
      const songDocs = await Songs.insertMany(songs); // Songs should be an array of valid song objects
      const songIds = songDocs.map((song) => song._id); // Extract song IDs
  
      // Add the song IDs to the album's song array
      album.songs.push(...songIds);
  
      // Save the updated album
      const updatedAlbum = await album.save();
  
      console.log("Updated Album:", updatedAlbum);
  
      res.status(200).json({ message: "Songs added successfully", album: updatedAlbum });
    } catch (error) {
      console.error("Error adding songs to Album:", error);
      res.status(500).json({
        message: "Error adding songs to Album",
        error: error.message,
      });
    }
  };

  const getSongsByAlbumName = async (req, res) => {
    try {
      const { playlistName } = req.params;
  
      const Album = await Albums.findOne({ name: playlistName })
        .populate("songs")
        .exec();
  
      if (!Album) {
        return res.status(404).json({ message: "Album not found" });
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
  
      console.log("Album:", Album);
      console.log("Songs matching artists:", songs);
  
      res.status(200).json({ Album, songs });
    } catch (error) {
      console.error("Error fetching songs by Album name:", error);
      res
        .status(500)
        .json({
          message: "Error fetching songs by Album name",
          error: error.message,
        });
    }
  };


  const getAlbumByName = async (req, res) => {
    try {
      const { AlbumName } = req.params; // Assuming the name comes as a string from the body
      
      if (!AlbumName) {
        return res.status(400).json({ message: "Album name is required" });
      }
  
      const album = await Albums.findOne({ name: AlbumName }).populate("songs");
      console.log(album);
  
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
  
      res.status(200).json({
        album: {
          _id: album._id,
          name: album.name,
          image: album.image, 
          songs: album.songs, 
        }
      });
    } catch (error) {
      console.error("Error fetching album:", error);
      res.status(500).json({ message: "Error fetching album", error: error.message });
    }
  };
module.exports = {
   createAlbum,
   getAllAlbums,
   addSongsToAlbum,
   getAlbumByName
  };
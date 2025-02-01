  const users = require('../models/user');
  const bcryptjs = require('bcryptjs');
  const cloudinaryUploader = require('../utils/imageUploder');
  const upload = require('../utils/multer');



  exports.Signup = async (req, res) => {
    // console.log(req.body); // Debugging: Log the incoming request body
    // console.log(req.file); // Debugging: Log the uploaded file

    try {
      // Sanitize request body keys
      const sanitizeKeys = (obj) => {
        const sanitized = {};
        for (const key in obj) {
          sanitized[key.trim()] = obj[key];
        }
        return sanitized;
      };

      const sanitizedBody = sanitizeKeys(req.body);

      const { name, gmail, password } = sanitizedBody;
      const file = req.file;

      // Validate input fields
      if (!name || !gmail || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required." });
      }

      // Check if file is uploaded
      if (!file) {
        return res
          .status(400)
          .json({ message: "Profile image is required." });
      }

      // Upload file to Cloudinary
      const { success, result, error } = await cloudinaryUploader(file.path);
      if (!success) {
        return res.status(500).json({
          message: `Cloudinary upload error: ${error}`,
        });
      }
      const imageUrl = result.secure_url; // Uploaded image URL
      console.log(imageUrl);

      // Check if the user already exists
      const existingUser = await users.findOne({ gmail });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists." });
      }

      // Hash the password
      const hashPassword = await bcryptjs.hash(password, 10);

      // Create a new user object
      const newUser = {
        name,
        gmail,
        password: hashPassword,
        image: imageUrl,
      };


      // Save user to the database
      const createdUser = await users.create(newUser);
      console.log(createdUser.image);

      return res.status(201).json({
        message: "User added successfully.",
        result: createdUser.toObject(),
      });
    } catch (error) {
      console.error("Signup error:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error." });
    }
  };





  // Login Controller
  exports.Login = async (req, res) => {
    try {
      const { gmail, password } = req.body;

      // Find user by email
      const user = await users.findOne({ gmail });
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      // Compare passwords
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          gmail: user.gmail,
          image: user.image
        }
      });
    } catch (error) {
      console.error("Error: " + error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delete User Controller
  exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.body; // Assuming you're passing userId in request body
      const user = await users.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User data has been deleted successfully" });
    } catch (error) {
      console.error("Error: " + error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Add Song to Favorites Controller
  exports.addSongInFavorites = async (req, res) => {
    const { songId, userId } = req.body;

    try {
      const user = await users.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if song is already in favorites
      if (!user.favoriteSongs.includes(songId)) {
        user.favoriteSongs.push(songId);
        await user.save();
        return res.status(200).json({ message: "Song added to favorites", favoriteSongs: user.favoriteSongs });
      } else {
        return res.status(200).json({ message: "Song is already in favorites", favoriteSongs: user.favoriteSongs });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Remove Song from Favorites Controller
  exports.removeSongFromFavorites = async (req, res) => {
    console.log(req.body);
    const { songId, userId } = req.body;

    // Validate input
    if (!songId || !userId) {
      return res.status(400).json({ error: `Missing ${!songId ? "songId" : "userId"}` });
    }

    // Find user
    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Ensure favoriteSongs is initialized
      if (!Array.isArray(user.favoriteSongs)) {
        user.favoriteSongs = [];
      }

      // Remove song from favorites
      const initialCount = user.favoriteSongs.length;
      user.favoriteSongs = user.favoriteSongs.filter((id) => id.toString() !== songId.toString());

      if (user.favoriteSongs.length === initialCount) {
        return res.status(404).json({ error: "Song not found in user's favorites" });
      }

      await user.save();

      return res.status(200).json({
        message: "Song removed from favorites successfully",
        favoriteSongs: user.favoriteSongs,
      });
    } catch (error) {
      console.error("Error removing song from favorites:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };




  // Get Favorite Songs Controller
  exports.getFavoriteSongs = async (req, res) => {
    const { userId } = req.query;

    try {
      const user = await users.findById(userId).populate("favoriteSongs");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ favoriteSongs: user.favoriteSongs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

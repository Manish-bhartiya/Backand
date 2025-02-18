const express = require("express");
const { Signup, Login, deleteUser, addSongInFavorites, removeSongFromFavorites, getFavoriteSongs } = require("../contorllers/userscontroller");
const userRoute = express.Router();
const upload = require("../utils/multer");


// User routes
userRoute.post("/signup",upload, Signup);
userRoute.post("/login", Login);
userRoute.delete("/user", deleteUser);

userRoute.post("/addFavorite", addSongInFavorites);
userRoute.delete("/removeFavorite", removeSongFromFavorites);
userRoute.get("/getFavorites", getFavoriteSongs);

module.exports = userRoute;

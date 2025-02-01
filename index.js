const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinaryRouter = require('./routes/cloudyneryRoute');
const db = require('./connection/dbconnection');
const playlistrouter = require('./routes/playlistRoute');
const songrouter = require('./routes/songRoute');
const albumtrouter = require('./routes/albumsRoute');
const userRoute = require('./routes/userRoute');
const searchRoute = require('./routes/serch');

dotenv.config();

const app = express();

// Configure CORS to allow requests from any origin

app.use(cors({
    origin:"*",
    credentials:true
})); // Apply CORS
app.use(bodyParser.json());

// Initialize database connection
db();

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello There" });
});

app.use("/api/playlists", playlistrouter);
app.use("/api/songs", songrouter);
app.use("/api/albums", albumtrouter);
app.use("/api/users", userRoute);
app.use("/api/search", searchRoute);
app.use("/api/cloudinary", cloudinaryRouter);


// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`Server Up and Running on http://localhost:${PORT}`);
});

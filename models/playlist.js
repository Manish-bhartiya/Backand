const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {              
        type: String,
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Songs'
    }]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

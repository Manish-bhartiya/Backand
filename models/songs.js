const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const Songs = mongoose.model('Songs', songSchema);

module.exports = Songs;

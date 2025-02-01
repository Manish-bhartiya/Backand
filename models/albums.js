const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    image:{
        type: String,
        required : true
    },
    songs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Songs'
    }]
}); 

const Album = mongoose.model('Album',albumSchema);

module.exports = Album;
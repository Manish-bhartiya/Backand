const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    gmail:{
        type:String
    },
    password:{
        type:String
    },
    image:{
        type:String
    },
    favoriteSongs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Songs'
    }]
})
module.exports = mongoose.model('user',userSchema);
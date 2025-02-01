const mongoose = require('mongoose');

const db_link = process.env.DB_LINK;
const db = () => {
    mongoose.connect(db_link, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.error("Database connection error:", err);
    });
};

module.exports = db;

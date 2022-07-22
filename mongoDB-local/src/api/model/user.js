const mongoose = require("mongoose")

const User = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
})

module.exports = mongoose.model("User-Registry",User,"User-Registry");

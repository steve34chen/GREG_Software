const mongoose = require("mongoose")

const System = new mongoose.Schema({
    user_id: String,
    water_level: Number
})

module.exports = mongoose.model("System-Registry",System,"System-Registry");

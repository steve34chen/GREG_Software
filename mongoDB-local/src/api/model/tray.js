const mongoose = require("mongoose")


const Tray = new mongoose.Schema({
    plant_name: String,
    plant_type: String,
    status: Number,
    last_time_watered: Date,
    system_id: String,
    moisture_level: Number,
    position: Number,
    interval:Number,
    registered: Boolean,
    moisture_history: Array,
    moisture_history_time: [Date],
})

module.exports = mongoose.model("Tray-Registry",Tray,"Tray-Registry");
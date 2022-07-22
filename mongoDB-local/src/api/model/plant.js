const mongoose = require("mongoose");

const Plant = new mongoose.Schema({
    plantname: String,
    sensorID: String,
    systemID: String,
    position: String,
    species: String,
    plant_image:String,
    last_water_time: Date,
    moisture: {type:Number, default: 0},
    soil_type: String,
    scale_factor:{type:Number, default: 1},
    moisture_history: Array,
    moisture_history_time: [Date],
});

module.exports = mongoose.model("Plant-Registry",Plant,"Plant-Registry");

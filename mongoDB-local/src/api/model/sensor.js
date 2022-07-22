const mongoose = require("mongoose")

const Sensor = new mongoose.Schema({
    plant_id: String
})

module.exports = mongoose.model("sensor_device",Sensor);

const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const path = require("path");
const fs = require("fs")
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config({ path: '../.env'})

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.json());
mongoose.connect(
    process.env.DB_CONNECTION_STRING_TEST,
    {useNewUrlParser: true,  useUnifiedTopology: true},
    (req, res) =>{
        console.log("The MNDL Backend server is setup");
    });// connect to the mongodb altas

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
        cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
    },
    app
)

sslServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const userRoutes = require("./api/routes/user");
const trayRoutes = require("./api/routes/tray");
const systemRoutes = require("./api/routes/system");

// const plantRoutes = require("./api/routes/plants");

app.use("/user", userRoutes);
app.use("/system", systemRoutes);
app.use("/tray", trayRoutes);




const express = require("express");
const router = express.Router();

const {GenerateQRcode,RegisterSystem,test} = require("../controllers/systemController");

router.get("/generateQRcode", GenerateQRcode);
router.post("/register", RegisterSystem);
router.post("/missingElement", test);

module.exports = router;
const express = require("express");
const router = express.Router();

const { UserLogin,RegisteredSystem,SignUpUser} = require("../controllers/userController");

router.post("/login", UserLogin);
router.post("/signUp", SignUpUser);
router.get("/System", RegisteredSystem);

module.exports = router;
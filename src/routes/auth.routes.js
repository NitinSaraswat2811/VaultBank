const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");

// --- ADD THESE LOGS ---
console.log("Type of authController:", typeof authController);
console.log("Value of authController:", authController);
console.log("Type of userRegisterController:", typeof authController.userRegisterController);
// ----------------------

router.post("/register", authController.userRegisterController);

router.post('/login',authController.userLoginController);

module.exports = router;
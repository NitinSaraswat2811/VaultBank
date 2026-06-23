const express = require("express");

const authController = require("../controllers/account.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * - POST /api/accounts/
 * - create a new account
 * - Protected Route
 */
router.post("/",authMiddleware.authMiddleware)

module.exports = router;
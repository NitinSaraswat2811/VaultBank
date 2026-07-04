const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller")
const router = express.Router();

/**
 * - POST /api/accounts/
 * - create a new account
 * - Protected Route
 */
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController);

/**
 * -GET/api/accounts/
 * - get all accounts of the logged in user
 * - Protected route
 */
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController);

/**
 * -GET/api/accounts/balance/:accountId
 * get the balance of user account
 */

router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController);

module.exports = router;
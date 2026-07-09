const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors')

const app = express();

// src/app.js (Sabse upar)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Preflight request handle karne ke liye
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(cookieParser());

/**
 * Routes required
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.route");
/**
 * Routes are used here
 */
app.use("/api/auth",authRouter); 
app.use("/api/accounts",accountRouter);
app.use("/api/transactions",transactionRoutes);
module.exports = app ;  
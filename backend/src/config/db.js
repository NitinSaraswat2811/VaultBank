// src/config/db.js
const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
       console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URL,{
            //serverSelectionTimeoutMS: 20000, // Increase timeout to 20s
            //socketTimeoutMS: 45000,
        });
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectToDB;
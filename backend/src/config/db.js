
const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        console.log("Connecting to database...");

        await mongoose.connect(process.env.MONGO_URL);

        console.log("Database connected successfully!");

    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

module.exports = connectToDB;

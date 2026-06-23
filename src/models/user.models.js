const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true, // Removes accidental spaces (e.g., " user@mail.com" -> "user@mail.com")
        unique: true, // Ensures no two users can register with the same email
        lowercase: true, // Standardizes email format to lowercase
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false // Excludes password from default database queries for security
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

// Middleware: Encrypt password before saving to the database
// So pre is responsible for performing it before saving it to databases
//Similarily post is also used to perform actions after saving that into data bases
userSchema.pre("save", async function() {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    // No need to call next() here, Mongoose handles the Promise automatically
});

// Instance Method: Compare plain text password with the hashed password in DB
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
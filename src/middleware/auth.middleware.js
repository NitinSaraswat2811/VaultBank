const tokenBlacklistModel = require('../models/blackList.model');
const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');

async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access,token is missing"
        })
    }
    
    const isBlacklisted = await tokenBlacklistModel.findOne({ token })

    if(isBlacklisted){
    return res.status(401).json({
        message:"Unauthorized access, token is invalid"
    })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);  //return actual token object that was given to user 

        const user = await userModel.findById(decoded.userId);
        req.user = user;
        return next();
    }catch(err){
        return res.status(401).json({
            message:"Unauthorized access,token is invalid"
        })
    }
}

async function authSystemUserMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access, token is missing" });
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({ token })

    if(isBlacklisted){
    return res.status(401).json({
        message:"Unauthorized access, token is invalid"
    })
    }

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = decoded.userId; 

    if (!userId) {
        return res.status(401).json({ message: "Token payload mein userId nahi mila" });
    }

    const user = await userModel.findById(userId).select("+systemUser");

    if (!user) {
        return res.status(401).json({ message: "User database mein nahi mila" });
    }

    // Checking for systemUser
    if (!user.systemUser) {
        return res.status(403).json({ message: "Forbidden access, not a system user" });
    }

    req.user = user;
    return next();
} catch (err) {
    console.error("JWT Error details:", err.message);
    return res.status(401).json({ message: "Unauthorized: " + err.message });
}
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}
const tokenBlacklistModel = require("../models/blackList.model");
const userModel = require("../models/user.models")
const jwt = require('jsonwebtoken')

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req,res){
    const { email, password, name} = req.body ;

    const isUserRegistered = await userModel.findOne({email:email});

    if(isUserRegistered){
        return res.status(422).json({
            message: "User already exists with email",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email,
        password,
        name,
        systemUser:true
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"5d"});  //{Payload,Secret_Key,Expiration time}
    res.cookie("token",token);

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}
 

async function userLoginController(req,res){
    let{email,password,name} = req.body;

    let user = await userModel.findOne({email:email}).select("+password"); //it will not pass by default due to select:false, so we will have to select it manually

    if(!user){
        return res.status(401).json({
            message:"Email or password is incorrect",
        })
    }
    const isVerifiedUser = await user.comparePassword(password);

    if(!isVerifiedUser){
        return res.status(401).json({
            message:"Email or password is incorrect",
        })
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"5d"});
    res.cookie("token",token);

    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
       token
    })
}

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(200).json({
            message:"User logged out successfully"
        })
    }
    res.cookie("token","");

    await tokenBlacklistModel.create({
        token:token
    })

    res.status(200).json({
        message:"User logged out successfully"
    })
}
module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};

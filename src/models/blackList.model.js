const mongoose = require('mongoose');

const tokenBlackListSchema = new mongoose.Schema({
    tokem:{
        type:String,
        required:[true,"Token is required to blacklist"],
        unique:[true,"Token is already blacklisted"]
    }
},
{
    timestamps:true
})

tokenBlackListSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3
})

const tokenBlacklistModel = mongoose.model("tokenBlackList",tokenBlackListSchema);
module.exports = tokenBlacklistModel;  
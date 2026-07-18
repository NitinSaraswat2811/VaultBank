const accountModel = require("../models/account.model");

async function createAccountController(req,res){
    const user = req.user;

    const { mobile, DateOfBirth } = req.body;

     if(!user){
        console.log("User is not valid ",user);
     }
    const account = await accountModel.create({
        user: user._id,
        mobileNumber:mobile,
        DateOfBirth:DateOfBirth,
    })

    res.status(201).json({
        account
    })
}

async function getAccountBalanceController(req,res){
    try{
    const accountId = req.params.accountId;
     
    const account = await accountModel.findOne({
        _id:accountId,      // multiple queries inside mongoose schema act as  "AND" condition means when both the condition will be true then only it will return something 
        user:req.user._id
    });

    if(!account){
       return res.status(400).json({message:"Not a valid account or Unauthorized access"});
    }
    
    let balance = await account  .getBalance();

    res.status(200).json({
        accountId:account._id,
        balance:balance,
        message:`Your account balance is ${balance}`
    });
}catch(err){
return res.status(500).json({ message: "Server Error", error: err.message });
}
}
async function getUserAccountsController(req,res){
    try {
        // 1. Get the userId from the logged-in user (provided by auth middleware)
        const userId = req.user.id; 

        // 2. Use 'await' to pause until data is fetched
        // 3. Query using the 'userId' field (ensure this field exists in your schema)
        const accounts = await accountModel.find({ user: userId });

        // 4. Return the result
        res.status(200).json({
            status: "success",
            accounts: accounts
        });
    } catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({ message: "Server error while fetching accounts" });
    }
}
module.exports = {
    createAccountController,
    getAccountBalanceController,
    getUserAccountsController,
}
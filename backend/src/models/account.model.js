const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model')

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required : [true,"Account must be associated with a user"],
        index: true
    },
  
    accountNumber:{
     type:String,
     required:true,
     unique:true,
     index:true,
    },
   mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"]
},
    DateOfBirth:{
        type:Date,
        required:[true,"date of birth is required"],
    },
    status:{
        type:String,
        enum:{
            values: ["ACTIVE","FROZEN","CLOSED"],
            messages:"Status can be either ACTIVE,FROZEN or CLOSED",
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
    },
},
{timestamps:true})

// using pre hook to crate account number before saving into databases
// either we can use an async function or can use the next() to proceed the flow

accountSchema.pre('validate', async function() {
    if (!this.accountNumber) {
        // Logic: 10 digit ka random ya incrementing number
        // Simple tarika: Timestamp ka last part + random digits
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(1000 + Math.random() * 9000);
        this.accountNumber = "100" + timestamp + random; 
    }
});

accountSchema.index({user:1,status:1});

accountSchema.methods.getBalance = async function(){
  const balanceData = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "DEBIT"] },
              then: "$amount",
              else: 0
            }
          }
        },
        totalCredit: { // <-- Yahan comma lagaya
          $sum: {
            $cond: {
              if: { $eq: ["$type", "CREDIT"] },
              then: "$amount",
              else: 0
            }
          }
        }
      }
    }, // <-- Yahan comma lagaya
    {
      $project: { // <-- Colon lagaya
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] }
      }
    }
  ]);

  if (balanceData.length === 0) {
    return 0;
  }
  return balanceData[0].balance;
};

const accountModel = mongoose.model("account",accountSchema);

module.exports = accountModel;
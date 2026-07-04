const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const { default: mongoose } = require('mongoose');
const userModel = require('../models/user.models');

/**
 *  create a new transaction
 * 10 steps transfer flow:-
 * 
 * 1. Validate request
 * 2. validate idempotency Key
 * 3. check account status
 * 4. Derive sender balance from ledger
 * 5. create transaction (Pending)
 * 6. create debit ledger entry
 * 7. create credit ledger entry
 * 8. mark transaction completed
 * 9. commit mongodb session
 * 10. send email notification 
 */



async function createTransaction(req,res){

    /**
     * validate request
     */

    const { fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })
    const toUserAccount = await accountModel.findOne({
        _id:toAccount,
    })
    if(!fromUserAccount||!toUserAccount){
     return res.status(400).json({
        message: "Invalid fromAccount or toAccount",
     })
    }

/**
 * validate idempotency key
 */

 const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
 })

 if(isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status === 'COMPLETED'){
       return res.status(200).json({
            message: "Transaction already processed",
            transactin: isTransactionAlreadyExists
        })
    }
        if(isTransactionAlreadyExists.status === 'PENDING'){
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }
        if(isTransactionAlreadyExists.status === 'FAILED'){
            return res.status(500).json({
                message: "Transaction failed please retry",
            })
        }
         if(isTransactionAlreadyExists.status === 'REVERSED'){
            return res.status(500).json({
                message: "Transaction was reversed please retry",
            })
        }
 }

 /**
  *  check account status
  */
   if(fromUserAccount.status!=="ACTIVE" || toUserAccount.status!=="ACTIVE"){
    return res.status(400).json({
        message:"Both fromAccount and toAccount must be ACTIVE to process transaction "
    })
   }

/**
 * Derive sender balance from ledger
 */

 const balance = await fromUserAccount.getBalance()

if(balance<amount){
   return res.status(400).json({
        message:`Insufficient balance, Current balance is ${balance}. Requested amount is ${amount}`
    })
}

/**
 * create transaction (Pending)
 */
let transaction ;
try{
const session = await mongoose.startSession()
session.startTransaction()

 transaction = (await transactionModel.create([{
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
}], {session}))[0]

const debitLedgerEntry = await ledgerModel.create([{
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
}],{session})

await(()=>{
    return new Promise((resolve)=>setTimeout(resolve,15 *1000));
})();

const creditLedgerEntry = await ledgerModel.create([{
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT",
}],{session})

await transactionModel.findOneAndUpdate(
    {_id: transaction._id},
    {status:"COMPLETED"},
    {session}
)

await session.commitTransaction()
session.endSession()
}catch(err){
    console.log("transaction failed due to : ",err.message)
    res.status(400).json({ message:"Transaction pending due to some issue try after some time"})
}
return res.status(201).json({
    message:"Transaction completed successfully",
    transaction:transaction
})
}

async function createInitialFundsTransaction(req, res) {
    let session;
    try {
        const { toAccount, amount, idempotencyKey } = req.body;
        const adminUser = req.user; // Middleware se lo

        if (!toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ message: "toAccount, amount, and idempotencyKey are required" });
        }

        // 1. Validate Account (Added await)
        const toUserAccount = await accountModel.findById(toAccount);
        if (!toUserAccount) {
            return res.status(400).json({ message: "Invalid toAccount" });
        }

        // 2. Validate System Account (Using req.user)
        const fromUserAccount = await accountModel.findOne({user: adminUser._id });
        if (!fromUserAccount) {
            return res.status(400).json({ message: "System user account not found" });
        }

        // 3. Start Transaction
        session = await mongoose.startSession();
        session.startTransaction();
       
        console.log("Type of transactionModel:", typeof transactionModel);
    console.log("Is it a function?", typeof transactionModel === 'function')
    
        // 4. Create Transaction Document
        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });
        await transaction.save({ session });

        // 5. Create Ledger Entries
        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        // 6. Commit
        transaction.status = "COMPLETED";
        await transaction.save({ session });
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction: transaction
        });

    } catch (error) {
        // Agar kuch bhi fail hua, transaction rollback karo
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return res.status(500).json({ message: "Transaction Failed", error: error.message });
    }
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}

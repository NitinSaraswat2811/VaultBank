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
     try{
    const {fromAccountNumber,toAccountNumber, toAccountHolderName, amount, description,idempotencyKey} = req.body;
    
    console.log("fromAccount is ",fromAccountNumber);
    console.log("toAccount is ",toAccountNumber);
    console.log("idempotency key is ",idempotencyKey);
    console.log("Amount is ",amount);

    if(!fromAccountNumber || !toAccountNumber || !toAccountHolderName || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    const senderAccount = await accountModel.findOne({
        accountNumber: fromAccountNumber,
        user:req.user.id,
    })

    const recieverName = toAccountHolderName.toUpperCase().replace(/\s+/g, " ").trim();

    const receiverAccount = await accountModel.findOne({
        accountNumber: toAccountNumber,
    }).populate("user", "firstname lastname");

    if(!senderAccount){
        return res.status(404).json({message: "Sender account details not found or details mismatch"});
    }
    if (!receiverAccount) {
        return res.status(404).json({ message: "Receiver account not found or details mismatch" });
    }
     if (!receiverAccount.user) {
    return res.status(404).json({ message: "Receiver's linked user profile not found" });
    }

    const ActualreceiverName =
    `${receiverAccount.user.firstname}${receiverAccount.user.lastname}`
        .toUpperCase()
        .replace(/\s+/g, " ") 
        .trim();

        console.log("actual reciever name is ",ActualreceiverName);
        console.log("reciever name is ",recieverName);

     if(ActualreceiverName!==recieverName){
        return res.status(404).json({message: "Account holder name is wrong"});
     }

    // 3. Prevent Self-Transfer (Ek hi account mein transfer nahi ho sakta)
    if (senderAccount._id.toString() === receiverAccount._id.toString()) {
        return res.status(400).json({ message: "Cannot transfer money to the same account" });
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
            transaction: isTransactionAlreadyExists
        })
    }
        if(isTransactionAlreadyExists.status === 'PENDING'){
            return res.status(200).json({
                message: "Transaction is still processing",
                transaction: isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status === 'FAILED'){
            return res.status(500).json({
                message: "Transaction failed please retry",
                transaction: isTransactionAlreadyExists
            })
        }
         if(isTransactionAlreadyExists.status === 'REVERSED'){
            return res.status(500).json({
                message: "Transaction was reversed please retry",
                transaction: isTransactionAlreadyExists
            })
        }
 }

 /**
  *  check account status
  */
   if(senderAccount.status!=="ACTIVE" || receiverAccount.status!=="ACTIVE"){
    return res.status(400).json({
        message:"Both fromAccount and toAccount must be ACTIVE to process transaction "
    })
   }

/**
 * Derive sender balance from ledger
 */

 const balance = await senderAccount.getBalance()

if(balance<amount){
   return res.status(400).json({
        message:`Insufficient balance, Current balance is ${balance}. Requested amount is ${amount}`
    })
}

/**
 * create transaction (Pending)
 */
const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const tx = await executeTransfer(senderAccount, receiverAccount, amount, idempotencyKey, description, session);
        await session.commitTransaction();
        res.status(201).json({ message: "Success", transaction: tx });
    } catch (err) {
        await session.abortTransaction();
        console.log(err.message);
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
}catch(err){
  console.log("error is", err.message);
  return res.status(500).json({message:err.message});
}
}

async function createInitialFundsTransaction(req, res) {
    const { toAccountNumber, toAccountHolderName, amount, idempotencyKey, description } = req.body;
    const adminUser = req.user;

    // 1. Basic Request Validation
    if (!toAccountNumber || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Account details, amount, and idempotencyKey are required" });
    }

    let session;
    try {
        // 2. Validate Receiver Account
        const receiverAccount = await accountModel.findOne({
            accountNumber: toAccountNumber,
        });

        if (!receiverAccount) {
            return res.status(404).json({ message: "Invalid receiver's account details" });
        }

        // 3. Validate System/Sender Account
        const senderAccount = await accountModel.findOne({ user: adminUser._id });
        if (!senderAccount) {
            return res.status(400).json({ message: "System user account not found" });
        }

        // 4. Start Transaction Session
        session = await mongoose.startSession();
        session.startTransaction();

        // 5. Execute Transfer using the helper function
        const tx = await executeTransfer(
            senderAccount, 
            receiverAccount, 
            amount, 
            idempotencyKey, 
            description, 
            session
        );

        // 6. Commit Transaction
        await session.commitTransaction();
        
        return res.status(201).json({ 
            message: "Initial funds added successfully", 
            transaction: tx 
        });

    } catch (error) {
        // 7. Rollback on failure
        if (session) {
            await session.abortTransaction();
        }
        console.error("Initial Funds Transaction Error:", error.message);
        return res.status(500).json({ message: "Transaction Failed", error: error.message });
    } finally {
        // 8. End Session
        if (session) {
            session.endSession();
        }
    }
}

async function addInitialFunds(receiverAccount, amount, session) {
     console.log("ENV VALUE:", process.env.SYSTEM_ACCOUNT_NUMBER);
    console.log("ENV TYPE:", typeof process.env.SYSTEM_ACCOUNT_NUMBER);
    
    const systemAccount = await accountModel.findOne({
        accountNumber: process.env.SYSTEM_ACCOUNT_NUMBER
    }).session(session);

    if (!systemAccount) {
        throw new Error("System account not found");
    }

    const idempotencyKey = `INITIAL_FUNDS_${receiverAccount._id}`;

    return executeTransfer(
        systemAccount,
        receiverAccount,
        amount,
        idempotencyKey,
        "Initial account funding",
        session
    );
}

async function executeTransfer(sender, receiver, amount, idempotencyKey, description, session) {
    // 1. Create Transaction
    const transaction = (await transactionModel.create([{
        fromAccount: sender._id,
        toAccount: receiver._id,
        amount,
        idempotencyKey,
        status: "PENDING",
        description: description || "Transfer" // Parameter se lo
    }], { session }))[0];

    // 2. Ledger Entries
    await ledgerModel.create([{
        account: sender._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session });

    await ledgerModel.create([{
        account: receiver._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    // 3. Update Status
    const updatedTx = await transactionModel.findByIdAndUpdate(
        transaction._id,
        { status: "COMPLETED" },
        { session, new: true }
    );
    
    return updatedTx;
}

 async function getTransactionHistory(req,res){
    try{
     const {accountId} = req.params;

      const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found or unauthorized access"
            });
        }
         const history = await ledgerModel
            .find({ account: accountId })
            .populate("transaction")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            history
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Failed to fetch transaction history",
            error: err.message
        });
    }
 }
module.exports = {
    createTransaction,
    createInitialFundsTransaction,
    addInitialFunds,
    getTransactionHistory
}

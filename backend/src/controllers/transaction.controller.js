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

    const { fromAccount, toAccountNumber, toAccountHolderName, amount, idempotencyKey, description} = req.body;

    if(!fromAccount || !toAccountNumber || !toAccountHolderName || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    const senderAccount = await accountModel.findOne({
        _id: fromAccount,
        user:req.user.id,
    })
    const receiverAccount = await accountModel.findOne({
        accountNumber: toAccountNumber,
        accountHolderName: toAccountHolderName.toUpperCase().trim()
    })

    if (!receiverAccount) {
        return res.status(404).json({ message: "Receiver account not found or details mismatch" });
    }

    // 3. Prevent Self-Transfer (Ek hi account mein transfer nahi ho sakta)
    if (senderAccount._id.toString() === receiverAccount._id.toString()) {
        return res.status(400).json({ message: "Cannot transfer money to the same account" });
    }
    if(!senderAccount||!receiverAccount){
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
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
}

async function createInitialFundsTransaction(req, res) {
    const { toAccountNumber, toAccountHolderName, amount, idempotencyKey, description } = req.body;
    const adminUser = req.user;

    // 1. Basic Request Validation
    if (!toAccountNumber || !toAccountHolderName || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Account details, amount, and idempotencyKey are required" });
    }

    let session;
    try {
        // 2. Validate Receiver Account
        const receiverAccount = await accountModel.findOne({
            accountNumber: toAccountNumber,
            accountHolderName: toAccountHolderName.toUpperCase().trim()
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

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}

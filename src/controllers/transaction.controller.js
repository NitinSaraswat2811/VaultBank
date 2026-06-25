const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');

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
        res.status(400).json({
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
}
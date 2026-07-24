import { createContext, useState, useEffect } from "react";

export const AccountContext = createContext(); 

export const AccountProvider = ({children}) =>{
    const [balance,setbalance] = useState(null);
    const [Accounts,setAccounts] = useState([]);
    const [loading,setloading] = useState(true);
    const [transaction,settransaction] = useState(null);
    const [transactions,setTransactions] = useState([]); // it is to store transaction history 

    return (
     // ye value field single value expect karta h so hame agar multiple values deni h to unhe wrap karke dena padega ek single object k andar

      <AccountContext.Provider value = {{balance,Accounts,setAccounts,loading,transactions,transaction,settransaction,setTransactions}}> 
      {children} 
    </AccountContext.Provider>

    )
}
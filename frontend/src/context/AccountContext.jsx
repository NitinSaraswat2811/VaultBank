import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getAllUserAccounts } from "../services/authServices";

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [balance, setbalance] = useState(null);
  const [Accounts, setAccounts] = useState([]);
  const [Accountloading, setAccountloading] = useState(true);
  const [transaction, settransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      // AuthContext abhi localStorage se user restore kar raha hai
      if (authLoading) return;

      // User login nahi hai
      if (!user) {
        setAccounts([]);
        setAccountloading(false);
        return;
      }

      try {
        const response = await getAllUserAccounts();

        setAccounts(response.data.accounts || []);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        setAccounts([]);
      } finally {
        setAccountloading(false);
      }
    };

    fetchAccounts();
  }, [user, authLoading]);

  return (
    <AccountContext.Provider
      value={{
        balance,
        Accounts,
        setAccounts,
        Accountloading,
        transactions,
        transaction,
        settransaction,
        setTransactions,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
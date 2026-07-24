import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  HelpCircle,
  Wallet,
  Plus,
  Eye,
  EyeOff,
  ChevronRight,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { AccountContext } from "../../context/AccountContext";
import { getbalance, getTransactionHistory } from "../../services/authServices";

const currency = (n) =>
  Number(n || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

const maskAccountNumber = (num) => {
  if (!num) return "";
  const str = String(num);
  return str.length > 4 ? `\u2022\u2022\u2022\u2022 ${str.slice(-4)}` : str;
};

const formatActivityTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  if (sameDay(date, today)) return `Today, ${time}`;
  if (sameDay(date, yesterday)) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { Accounts, setTransactions } = useContext(AccountContext);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const primary = Accounts?.[0];

  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");

  // Balance is derived from the ledger, not stored on the account — fetch it
  // for the primary account, same route used on the Transfer page.
  useEffect(() => {
    if (!primary?._id) return;
    setBalanceLoading(true);
    getbalance(primary._id)
      .then((res) => setBalance(res.data.balance))
      .catch((err) => {
        console.error("Failed to fetch balance", err);
        setBalance(null);
      })
      .finally(() => setBalanceLoading(false));
  }, [primary?._id]);

  // First (and so far only) page in the app to call the transaction history
  // route. Pulls the primary account's history and keeps it both locally
  // (for the "Recent Activity" preview) and in context (so the full History
  // page has it too, without re-fetching).
  useEffect(() => {
    if (!primary?._id) return;
    setActivityLoading(true);
    setActivityError("");
    getTransactionHistory(primary._id)
      .then((res) => {
        const txns = res.data.history || [];

        console.log("this is backend response", res.data.history);

        setRecentActivity(txns);
        setTransactions?.(txns);
      })
      .catch((err) => {
        console.error("Failed to fetch transaction history", err);
        setActivityError("Couldn't load recent activity.");
      })
      .finally(() => setActivityLoading(false));
  }, [primary?._id]);

  if (!Accounts || Accounts.length === 0) {
    return (
      <div className="flex h-screen bg-[#050505] text-white relative font-sans overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_transparent_65%)] opacity-30 pointer-events-none" />
        <div className="relative z-10 text-center">
          <p className="text-lg font-medium mb-2">No account found</p>
          <p className="text-gray-500 text-sm mb-6">Open an account to start using VaultBank.</p>
          <Link
            to="/CreateAccount/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-xl font-semibold"
          >
            <Plus size={18} /> Open an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white relative font-sans overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_transparent_65%)] opacity-30 pointer-events-none" />

      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-10 z-20 overflow-y-auto">
        <div className="w-full max-w-5xl">
          {/* Greeting */}
          <div className="mb-10 mt-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight pb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Welcome Back, {user?.firstname || "User"} 👋
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Your financial dashboard is ready.</p>
          </div>

          {/* Balance + Add Money */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Wallet size={20} className="text-blue-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">Available Balance</span>
                <button
                  onClick={() => setBalanceVisible((v) => !v)}
                  className="text-gray-500 hover:text-gray-300 transition"
                  aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <p className="text-4xl md:text-5xl font-bold tracking-tight [font-variant-numeric:tabular-nums]">
                {balanceLoading ? (
                  <span className="text-gray-600 text-3xl">Loading{"\u2026"}</span>
                ) : balanceVisible ? (
                  currency(balance)
                ) : (
                  "\u2022\u2022\u2022\u2022\u2022\u2022"
                )}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Primary account {"\u00b7"} {maskAccountNumber(primary.accountNumber)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/add-money"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-6 py-3.5 rounded-xl font-semibold"
              >
                <Plus size={18} /> Add Money
              </Link>
              <Link
                to="/transfer"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition px-6 py-3.5 rounded-xl font-semibold"
              >
                <ArrowLeftRight size={18} /> Transfer
              </Link>
            </div>
          </div>

          {/* Your Account */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Your Account</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Landmark size={20} className="text-blue-400" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                    {primary.status || "Active"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Primary Account</p>
                <p className="text-xs text-gray-600 mb-3">{maskAccountNumber(primary.accountNumber)}</p>
                <p className="text-2xl font-bold [font-variant-numeric:tabular-nums]">
                  {balanceLoading ? (
                    <span className="text-gray-600 text-lg">Loading{"\u2026"}</span>
                  ) : balanceVisible ? (
                    currency(balance)
                  ) : (
                    "\u2022\u2022\u2022\u2022\u2022\u2022"
                  )}
                </p>
              </div>

              <Link
                to="/CreateAccount/"
                className="bg-white/[0.02] p-6 rounded-3xl border border-dashed border-white/15 hover:border-blue-500/40 hover:bg-white/5 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                  <Plus size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-sm text-gray-300 font-medium">Open new account</p>
                <p className="text-xs text-gray-600 mt-1">Add a Savings or Business account</p>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <Link
              to="/transfer"
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <ArrowLeftRight size={28} className="text-blue-400" />
                <ChevronRight size={18} className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Transfer Money</h2>
              <p className="text-sm text-gray-500">Send to any account, instantly.</p>
            </Link>

            <Link
              to="/help"
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <HelpCircle size={28} className="text-green-400" />
                <ChevronRight size={18} className="text-gray-600 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Help & Support</h2>
              <p className="text-sm text-gray-500">We're here around the clock.</p>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 mb-10">
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-200">Recent Activity</h2>
              <Link to="/history" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition">
                View all <ChevronRight size={15} />
              </Link>
            </div>

            {activityLoading ? (
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-10">
                <Loader2 size={16} className="animate-spin" /> Loading activity\u2026
              </div>
            ) : activityError ? (
              <p className="text-sm text-red-400 text-center py-10">{activityError}</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-10">No transactions yet.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentActivity.slice(0, 5).map((tx) => {
                  const isSent = tx.type === "DEBIT";
                  return (
                    <div key={tx._id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                            isSent ? "bg-white/5 border-white/10" : "bg-emerald-500/10 border-emerald-500/20"
                          }`}
                        >
                          {isSent ? (
                            <ArrowUpRight size={17} className="text-red-400" />
                          ) : (
                            <ArrowDownLeft size={17} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{tx.description || (isSent ? "Sent" : "Received")}</p>
                          <p className="text-xs text-gray-500 truncate">{formatActivityTime(tx.createdAt)}</p>
                        </div>
                      </div>
                      <p className={`font-semibold text-sm shrink-0 ml-3 [font-variant-numeric:tabular-nums] ${isSent ? "text-red-400" : "text-emerald-400"}`}>
                        {isSent ? "\u2212" : "+"}
                        {currency(tx.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

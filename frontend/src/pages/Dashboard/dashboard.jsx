import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  History,
  HelpCircle,
  Wallet,
  Plus,
  Eye,
  EyeOff,
  ChevronRight,
  Landmark,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";

// Mock data — swap these for real API data whenever it's wired in
const ACCOUNTS = [
  { id: "acc_1", label: "Primary Checking", mask: "•••• 4821", balance: 24500.0, icon: Wallet, accent: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "acc_2", label: "Savings Vault", mask: "•••• 7734", balance: 9120.5, icon: PiggyBank, accent: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "acc_3", label: "Business", mask: "•••• 2290", balance: 3810.25, icon: Landmark, accent: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "credit", label: "Payroll Deposit", sub: "Acme Corp", amount: 4200.0, time: "Today, 9:12 AM" },
  { id: 2, type: "debit", label: "Transfer to Savings", sub: "Self transfer", amount: -500.0, time: "Yesterday, 6:40 PM" },
  { id: 3, type: "debit", label: "Amazon", sub: "Shopping", amount: -89.99, time: "Yesterday, 2:05 PM" },
  { id: 4, type: "credit", label: "Refund", sub: "Zara", amount: 45.0, time: "Mon, 11:20 AM" },
];

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const totalBalance = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);
  const primary = ACCOUNTS[0];

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
                <span className="text-sm text-gray-400 font-medium">Total Balance</span>
                <button
                  onClick={() => setBalanceVisible((v) => !v)}
                  className="text-gray-500 hover:text-gray-300 transition"
                  aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <p className="text-4xl md:text-5xl font-bold tracking-tight">
                {balanceVisible ? currency(totalBalance) : "••••••"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Across {ACCOUNTS.length} accounts · {primary.label} {primary.mask}
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

          {/* Your Accounts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-200">Your Accounts</h2>
              <Link
                to="/accounts"
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
              >
                View all accounts <ChevronRight size={15} />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {ACCOUNTS.map((acc) => {
                const AccIcon = acc.icon;
                return (
                  <Link
                    key={acc.id}
                    to={`/accounts/${acc.id}`}
                    className="min-w-[220px] bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all shrink-0"
                  >
                    <div className={`w-11 h-11 rounded-2xl ${acc.bg} ${acc.border} border flex items-center justify-center mb-4`}>
                      <AccIcon size={20} className={acc.accent} />
                    </div>
                    <p className="text-sm text-gray-400">{acc.label}</p>
                    <p className="text-xs text-gray-600 mb-2">{acc.mask}</p>
                    <p className="text-xl font-bold">
                      {balanceVisible ? currency(acc.balance) : "••••••"}
                    </p>
                  </Link>
                );
              })}

              <Link
                to="/accounts/new"
                className="min-w-[220px] bg-white/[0.02] p-6 rounded-3xl border border-dashed border-white/15 hover:border-white/30 hover:bg-white/5 transition-all shrink-0 flex flex-col items-center justify-center text-center"
              >
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Plus size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Open new account</p>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <Link
              to="/transfer"
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <ArrowLeftRight size={28} className="text-blue-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Transfer Money</h2>
              <p className="text-sm text-gray-500">Send to any account, instantly.</p>
            </Link>

            <Link
              to="/history"
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <History size={28} className="text-purple-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">History</h2>
              <p className="text-sm text-gray-500">Review every transaction.</p>
            </Link>

            <Link
              to="/help"
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all"
            >
              <HelpCircle size={28} className="text-green-400 mb-4" />
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
            <div className="divide-y divide-white/5">
              {RECENT_ACTIVITY.map((tx) => {
                const isCredit = tx.type === "credit";
                return (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          isCredit ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/10"
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft size={17} className="text-emerald-400" />
                        ) : (
                          <ArrowUpRight size={17} className="text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.label}</p>
                        <p className="text-xs text-gray-500">
                          {tx.sub} · {tx.time}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold text-sm ${isCredit ? "text-emerald-400" : "text-gray-200"}`}>
                      {isCredit ? "+" : "−"}
                      {currency(Math.abs(tx.amount))}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

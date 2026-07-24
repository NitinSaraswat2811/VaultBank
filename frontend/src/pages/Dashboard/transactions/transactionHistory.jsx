import React, { useContext, useMemo, useState } from "react";
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Clock,
  XCircle,
  Undo2,
  AlertCircle,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { AccountContext } from "../../../context/AccountContext";

const currency = (n) =>
  Number(n || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

const maskAccountNumber = (num) => {
  if (!num) return "Unknown account";
  const str = String(num);
  return str.length > 4 ? `\u2022\u2022\u2022\u2022 ${str.slice(-4)}` : str;
};

// fromAccount/toAccount may arrive as a raw ObjectId string or as a populated
// { _id, accountNumber } object depending on whether your route does
// .populate("fromAccount toAccount"). This handles both without crashing.

const getAccountNumber = (field) => (field && typeof field === "object" ? field.accountNumber : null);

const STATUS_CONFIG = {
  COMPLETED: { label: "Completed", icon: Check, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  PENDING: { label: "Pending", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/15" },
  FAILED: { label: "Failed", icon: XCircle, color: "text-red-400", bg: "bg-red-500/15" },
  REVERSED: { label: "Reversed", icon: Undo2, color: "text-violet-400", bg: "bg-violet-500/15" },
};
const FALLBACK_STATUS = { label: "Unknown", icon: AlertCircle, color: "text-gray-400", bg: "bg-white/10" };

const DIRECTION_TABS = [
  { key: "all", label: "All" },
  { key: "sent", label: "Sent" },
  { key: "received", label: "Received" },
];

const STATUS_OPTIONS = [
  { key: "all", label: "All statuses" },
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING", label: "Pending" },
  { key: "FAILED", label: "Failed" },
  { key: "REVERSED", label: "Reversed" },
];

function dateGroupLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

const TransactionHistory = () => {
  const { transactions, Accounts } = useContext(AccountContext);
  
   console.log("This is my transaction array",transactions);

  const [directionFilter, setDirectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const ownAccountIds = useMemo(() => new Set((Accounts || []).map((a) => String(a._id))), [Accounts]);

  const enriched = useMemo(() => {
    return (transactions || [])
      .map((tx) => {
        const isSent = tx.type==="DEBIT";
        const counterpartyField = isSent ? tx.toAccount : tx.fromAccount;
        const counterpartyNumber = getAccountNumber(counterpartyField);

        return {
          ...tx,
          direction: isSent ? "sent" : "received",
          counterpartyLabel: counterpartyNumber ? maskAccountNumber(counterpartyNumber) : "VaultBank account",
          dateValue: tx.createdAt || tx.updatedAt || null,
        };
      })
      .sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue));
  }, [transactions, ownAccountIds]);

  const filtered = useMemo(() => {
    return enriched.filter((tx) => {
      if (directionFilter !== "all" && tx.direction !== directionFilter) return false;
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      return true;
    });
  }, [enriched, directionFilter, statusFilter]);

  const grouped = useMemo(() => {
    const groups = [];
    let lastLabel = null;
    for (const tx of filtered) {
      const label = tx.dateValue ? dateGroupLabel(tx.dateValue) : "Undated";
      if (label !== lastLabel) {
        groups.push({ label, items: [] });
        lastLabel = label;
      }
      groups[groups.length - 1].items.push(tx);
    }
    return groups;
  }, [filtered]);

  const statusOption = STATUS_OPTIONS.find((o) => o.key === statusFilter);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-50 pointer-events-none" />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600/20 p-3.5 rounded-2xl">
            <History className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Transaction History</h1>
            <p className="text-gray-400 text-sm mt-1">Every transfer, deposit, and refund on your accounts.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-full sm:w-auto">
            {DIRECTION_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDirectionFilter(tab.key)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  directionFilter === tab.key ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:ml-auto">
            <button
              type="button"
              onClick={() => setStatusMenuOpen((o) => !o)}
              className="w-full sm:w-auto flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white hover:border-white/20 transition-colors"
            >
              {statusOption?.label}
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${statusMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {statusMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setStatusMenuOpen(false)} />
                <div className="absolute right-0 z-30 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt.key);
                        setStatusMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        statusFilter === opt.key ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* List */}
        {!transactions || transactions.length === 0 ? (
          <EmptyState title="No transactions yet" subtitle="Your transfers and deposits will show up here." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matching transactions" subtitle="Try a different filter." />
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <div key={group.label}>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-3 px-1">{group.label}</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/10 overflow-hidden">
                  {group.items.map((tx) => {
                    const cfg = STATUS_CONFIG[tx.status] || FALLBACK_STATUS;
                    const StatusIcon = cfg.icon;
                    const isSent = tx.direction === "sent";

                    return (
                      <div key={tx._id} className="flex items-center gap-4 px-5 py-4">
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

                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {isSent ? "Sent to" : "Received from"} {tx.counterpartyLabel}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {tx.description || "No description"} {tx.dateValue ? `\u00b7 ${formatTime(tx.dateValue)}` : ""}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-semibold text-sm [font-variant-numeric:tabular-nums] ${isSent ? "text-red-400" : "text-emerald-400"}`}>
                            {isSent ? "\u2212" : "+"}
                            {currency(tx.amount)}
                          </p>
                          <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={11} />
                            {cfg.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const EmptyState = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-2xl py-16 px-6">
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <Inbox className="w-6 h-6 text-gray-500" />
    </div>
    <p className="font-medium">{title}</p>
    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
  </div>
);

export default TransactionHistory;

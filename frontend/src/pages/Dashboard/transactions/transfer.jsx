import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import {
  Landmark,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  XCircle,
  Undo2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { transferMoney } from "../../../services/authServices";
import { AccountContext } from "../../../context/AccountContext";
import { getbalance } from "../../../services/authServices";

const currency = (n) =>
  Number(n || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

// Every real outcome your backend can return gets its own icon, color, and
// copy — a failed or pending transfer should never look like a success.
const STATUS_CONFIG = {
  COMPLETED: {
    icon: Check,
    iconColor: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    title: "Transfer complete",
    message: (amt, name) => `${currency(amt)} sent to ${name}.`,
  },
  PENDING: {
    icon: Clock,
    iconColor: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    title: "Transfer pending",
    message: () =>
      "Your transfer is still being processed. This can take a few minutes \u2014 check Transaction History for the latest status.",
  },
  FAILED: {
    icon: XCircle,
    iconColor: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    title: "Transfer failed",
    message: () => "Nothing was deducted from your account. You can safely try again.",
  },
  REVERSED: {
    icon: Undo2,
    iconColor: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    title: "Transfer reversed",
    message: (amt) => `${currency(amt)} was returned to your account.`,
  },
};

const FALLBACK_STATUS = {
  icon: AlertCircle,
  iconColor: "text-gray-400",
  bg: "bg-white/10",
  border: "border-white/20",
  title: (status) => `Transfer ${status?.toLowerCase() || "status unknown"}`,
  message: () => "Check Transaction History for the latest details.",
};

const Transfer = () => {
  const { Accounts, settransaction } = useContext(AccountContext);

  const [step, setStep] = useState("details"); // details -> confirm -> result
  const [formData, setformData] = useState({
    accountHolderName: "",
    SenderAccountNumber: "",
    RecieverAccountNumber: "",
    amount: "",
    description: "",
  });
  const [balance,setBalance] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // last completed transaction
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const idempotencyKey = useRef(null);

  const fromAccount = useMemo(
    () => Accounts?.find((a) => a.accountNumber === formData.SenderAccountNumber),
    [Accounts, formData.SenderAccountNumber]
  );

  useEffect(() => {
    if (!fromAccount?._id) {
        setBalance(null);
        return;
    }

    const fetchBalance = async () => {
        try {
            const response = await getbalance(fromAccount._id);
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Failed to fetch balance", error);
            setBalance(null);
        }
    };

    fetchBalance();
}, [fromAccount]);

  const amountNumber = Number(formData.amount) || 0;
  const hasKnownBalance = typeof balance === "number";
  const insufficientFunds = hasKnownBalance ? amountNumber > balance : false;

  const canContinue =
    formData.accountHolderName.trim().length > 1 &&
    formData.RecieverAccountNumber.trim().length >= 4 &&
    formData.SenderAccountNumber &&
    amountNumber > 0 &&
    !insufficientFunds;

  const set = (field) => (e) => setformData((prev) => ({ ...prev, [field]: e.target.value }));

  const goToConfirm = () => {
    if (!canContinue) return;
    setError("");
    setStep("confirm");
  };

  const handleTransfer = async () => {
    if (loading) return; // double-click prevent

    if (!idempotencyKey.current) {
      idempotencyKey.current = crypto.randomUUID();
    }
    const key = idempotencyKey.current;

    setloading(true);
    setError("");

    try {
      const { data } = await transferMoney({ ...formData, idempotencyKey: key });
      const transaction = data.transaction;
      settransaction(transaction);

      if (transaction.status === "COMPLETED") {
        // Current transaction finished — a new transaction can now get a new key.
        idempotencyKey.current = null;
      }

      setResult(transaction);
      setStep("result");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setloading(false);
    }
  };

  const resetAll = () => {
    setformData({
      accountHolderName: "",
      SenderAccountNumber: "",
      RecieverAccountNumber: "",
      amount: "",
      description: "",
    });
    setResult(null);
    setError("");
    setStep("details");
    setBalance(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 flex relative justify-center items-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-60 pointer-events-none" />
       
       <div className="fixed top-8 left-8">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">VaultBank</h1>
      </div>
      
      <div className="relative w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 z-10 shadow-2xl">
        {step === "details" && (
          <div className="animate-[fadeIn_0.25s_ease]">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-600/20 p-4 mb-4 rounded-2xl">
                <Landmark className="w-9 h-9 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Send money</h2>
              <p className="text-gray-400 mt-2 text-sm text-center">
                Secure, ledger-backed transfers between VaultBank accounts.
              </p>
            </div>

            {/* Amount hero */}
            <div className="mb-6 text-center">
              <label className="text-xs uppercase tracking-wide text-gray-500 mb-2 block">Amount</label>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-semibold text-gray-500">{"\u20b9"}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={set("amount")}
                  className="bg-transparent outline-none text-5xl font-bold tracking-tight text-white placeholder-gray-700 w-56 text-center [font-variant-numeric:tabular-nums]"
                />
              </div>
              {insufficientFunds && (
                <p className="mt-3 text-xs text-red-400">
                  Exceeds available balance of {currency(balance)}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {/* Custom themed dropdown — replaces native select/datalist so the
                  open menu never breaks out of the dark glassmorphism theme. */}
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                  Send from
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((o) => !o)}
                    className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/60 transition-colors"
                  >
                    <span className="truncate text-left">
                      {fromAccount
                        ? `${fromAccount.accountType || "Account"} \u2022 ${fromAccount.accountNumber}`
                        : "Choose an account"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 shrink-0 ml-2 transition-transform ${
                        accountMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {accountMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setAccountMenuOpen(false)} />
                      <div className="absolute z-30 mt-2 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                        {Accounts?.length ? (
                          Accounts.map((acc) => (
                            <button
                              type="button"
                              key={acc._id}
                              onClick={() => {
                                setformData((prev) => ({ ...prev, SenderAccountNumber: acc.accountNumber }));
                                setAccountMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-white/5 transition-colors ${
                                acc.accountNumber === formData.SenderAccountNumber ? "text-blue-400" : "text-white"
                              }`}
                            >
                              <span>
                                <span className="block">{acc.accountType || "Account"}</span>
                                <span className="block text-xs text-gray-500">{acc.accountNumber}</span>
                              </span>
                              {typeof balance === "number" && (
                                <span className="text-xs text-gray-400 shrink-0 ml-3">{currency(balance)}</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-500">No accounts found</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                  Receiver's account holder name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={formData.accountHolderName}
                  onChange={set("accountHolderName")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                  Receiver's account number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter account number"
                  value={formData.RecieverAccountNumber}
                  onChange={set("RecieverAccountNumber")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">
                  Description <span className="text-gray-600 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="What's this for?"
                  value={formData.description}
                  onChange={set("description")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={goToConfirm}
              disabled={!canContinue}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 disabled:bg-white/10 disabled:text-gray-600 hover:enabled:bg-blue-500 transition-colors py-3.5 rounded-xl font-semibold"
            >
              Review transfer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="animate-[fadeIn_0.25s_ease]">
            <button
              onClick={() => setStep("details")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={15} /> Back
            </button>

            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 text-center">You're sending</p>
            <p className="text-5xl font-bold text-center mb-6 [font-variant-numeric:tabular-nums]">
              {currency(amountNumber)}
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/10 mb-6">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-gray-400">From</span>
                <span className="text-sm font-medium">
                  {fromAccount?.accountType || "Account"} ({fromAccount?.accountNumber})
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-gray-400">To</span>
                <span className="text-sm font-medium">{formData.accountHolderName}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-gray-400">Account number</span>
                <span className="text-sm font-medium">{formData.RecieverAccountNumber}</span>
              </div>
              {formData.description && (
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-gray-400">Description</span>
                  <span className="text-sm font-medium">{formData.description}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 mb-6 px-1">
              <ShieldCheck size={15} className="shrink-0 mt-0.5 text-blue-400" />
              <span>
                Protected by an atomic, idempotent transaction. Retrying this exact request never double-charges your account.
              </span>
            </div>

            {error && <p className="text-sm text-red-400 mb-4 text-center">{error}</p>}

            <button
              onClick={handleTransfer}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:enabled:bg-blue-500 disabled:opacity-70 transition-colors py-3.5 rounded-xl font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing
                </>
              ) : (
                <>Confirm and send</>
              )}
            </button>
          </div>
        )}

        {step === "result" && result && (
          <div className="animate-[fadeIn_0.3s_ease] flex flex-col items-center text-center py-4">
            {(() => {
              const cfg = STATUS_CONFIG[result.status] || FALLBACK_STATUS;
              const Icon = cfg.icon;
              const title = typeof cfg.title === "function" ? cfg.title(result.status) : cfg.title;
              return (
                <>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 border ${cfg.bg} ${cfg.border}`}>
                    <Icon className={`w-8 h-8 ${cfg.iconColor}`} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{title}</h2>
                  <p className="text-gray-400 text-sm mb-6">{cfg.message(amountNumber, formData.accountHolderName)}</p>
                </>
              );
            })()}

            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Reference</span>
                <span className="font-medium">{result._id || result.transactionId}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2.5">
                <span className="text-gray-400">Status</span>
                <span className="font-medium">{result.status}</span>
              </div>
            </div>

            {result.status === "FAILED" && (
              <button
                onClick={() => {
                  setError("");
                  setStep("confirm");
                }}
                className="w-full mb-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors py-3.5 rounded-xl font-semibold"
              >
                Try again
              </button>
            )}

            <button
              onClick={resetAll}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors py-3.5 rounded-xl font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] { -moz-appearance: textfield; }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.25s_ease\\], .animate-\\[fadeIn_0\\.3s_ease\\] { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Transfer;

import React, { useContext, useState } from "react";
import {
  HelpCircle,
  UserPlus,
  Wallet,
  Send,
  History,
  ShieldCheck,
  ChevronDown,
  Search,
  Mail,
  MessageCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your account",
    body: "After signing up, open a VaultBank account from the onboarding screen. It's instantly Active and ready to use \u2014 no waiting period.",
  },
  {
    icon: Wallet,
    title: "Add money",
    body: "Use \u201cAdd Money\u201d on your dashboard to fund your account. Your balance updates immediately and is always calculated live from your ledger, so it's never out of date.",
  },
  {
    icon: Send,
    title: "Send a transfer",
    body: "Go to Transfer, enter the receiver's account number and the amount, then review the full summary before confirming. Nothing is sent until you tap \u201cConfirm and send.\u201d",
  },
  {
    icon: History,
    title: "Track every transaction",
    body: "Every transfer, deposit, and refund shows up in Transaction History \u2014 filterable by Sent, Received, or status, with the exact time of each entry.",
  },
  {
    icon: ShieldCheck,
    title: "Stay protected automatically",
    body: "Every transfer is atomic and idempotent: it either completes fully or not at all, and accidental double-submits never charge you twice. Frozen or Closed accounts are automatically blocked from sending money.",
  },
];

const FAQS = [
  {
    q: "Why does my transfer show as \u201cPending\u201d?",
    a: "Pending means VaultBank has received your request and it's still being processed. This usually resolves within a few minutes. You don't need to resubmit \u2014 retrying with the same request is always safe and will never charge you twice.",
  },
  {
    q: "What does it mean if my account is Frozen?",
    a: "A Frozen account is temporarily restricted, usually as a security precaution. You can still view your balance and history, but sending or receiving money is paused until the hold is reviewed. Contact support below to resolve it.",
  },
  {
    q: "Can I reopen a Closed account?",
    a: "No \u2014 a Closed account is permanent and can't be reactivated. If you need to keep using VaultBank, you can open a new account from the dashboard.",
  },
  {
    q: "What happens if a transfer fails?",
    a: "If a transfer fails, nothing is deducted from your account \u2014 the whole operation is rolled back automatically. You'll see a \u201cTry again\u201d option, and retrying is completely safe.",
  },
  {
    q: "Can I cancel a transfer after confirming it?",
    a: "Once you tap \u201cConfirm and send,\u201d the transfer is processed immediately and can't be cancelled. Always check the review screen carefully before confirming.",
  },
  {
    q: "How is my money kept safe?",
    a: "Every session is protected by signed authentication tokens, passwords are never stored in plain text, and every transfer runs inside an atomic database transaction \u2014 so your balance can never end up in a partially-updated or inconsistent state.",
  },
];

const Help = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    (item) =>
      !search.trim() ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      // Wire this up to your real support endpoint when it exists, e.g.
      // await submitSupportRequest({ ...form, userId: user?._id });
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSubmitted(true);
      setForm({ subject: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-50 pointer-events-none" />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-600/20 p-3.5 rounded-2xl">
            <HelpCircle className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Help & Support</h1>
            <p className="text-gray-400 text-sm mt-1">
              {user?.firstname ? `Hi ${user.firstname}, we're here to help.` : "Everything you need to get around VaultBank."}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10 mt-6">
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help topics\u2026"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>

        {/* How it works — step guide */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-200 mb-5">How VaultBank works</h2>
          <div className="relative">
            <div className="absolute left-[23px] top-2 bottom-2 w-px bg-white/10" aria-hidden="true" />
            <div className="space-y-2">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative flex gap-5 py-3">
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shrink-0">
                      <Icon size={19} className="text-blue-400" />
                    </div>
                    <div className="pt-1.5">
                      <p className="text-xs text-gray-600 font-medium mb-1">STEP {i + 1}</p>
                      <h3 className="font-semibold mb-1.5">{step.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-200 mb-5">Frequently asked questions</h2>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl py-10 text-center">
              <p className="text-sm text-gray-500">No topics match \u201c{search}\u201d.</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/10 overflow-hidden">
              {filteredFaqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium text-sm">{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 -mt-1">
                        <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Contact support */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-200 mb-5">Still need help?</h2>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="font-semibold mb-1.5">Message sent</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Our support team will get back to you shortly, usually within one business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-6">
                  <MessageCircle size={18} className="text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-400">
                    Can't find what you're looking for? Send us a message {"\u2014"} this works even if your account is
                    Frozen or Closed.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="What's this about?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 block">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us what's going on now"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !form.subject.trim() || !form.message.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 disabled:bg-white/10 disabled:text-gray-600 hover:enabled:bg-blue-500 transition-colors py-3.5 rounded-xl font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Sending
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 text-sm text-gray-500">
                  <Mail size={15} />
                  Or email us directly at{" "}
                  <a href="mailto:support@vaultbank.app" className="text-blue-400 hover:text-blue-300 transition-colors">
                   support@vaultbank.app
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Help;

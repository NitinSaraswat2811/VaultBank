import React from "react";
import { Link } from "react-router-dom";
import { LockKeyhole, Snowflake, UserX, ArrowRight, HelpCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const STATUS_CONTENT = {
  not_found: {
    eyebrow: "NO ACCOUNT FOUND",
    icon: UserX,
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    title: "We couldn't find an account",
    body: "There is no vault linked to this profile yet. Create one to start securing your funds — it takes about two minutes.",
    ctaLabel: "Create Account",
    ctaTo: "/CreateAccount",
    ctaColor: "bg-blue-600 hover:bg-blue-500",
  },
  closed: {
    eyebrow: "ACCOUNT CLOSED",
    icon: LockKeyhole,
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    title: "This account has been closed",
    body: "This vault is no longer active and cannot be reopened. Please open a new account to proceed.",
    ctaLabel: "Open a New Account",
    ctaTo: "/CreateAccount",
    ctaColor: "bg-red-600 hover:bg-red-500",
  },
  frozen: {
    eyebrow: "ACCOUNT FROZEN",
    icon: Snowflake,
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    title: "This vault is temporarily frozen",
    body: "Access has been paused for your security. Please reach out to our support team to unlock your account.",
    ctaLabel: "Contact Support",
    ctaTo: "/help",
    ctaColor: "bg-sky-600 hover:bg-sky-500",
  },
};

const OnboardingDashboard = ({ accountStatus = "not_found", children }) => {
  const {user} = useContext(AuthContext);
  if (accountStatus === "active") return <>{children}</>;

  const content = STATUS_CONTENT[accountStatus] ?? STATUS_CONTENT.not_found;
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden flex flex-col items-center justify-center p-6">
      {/* Background Glow — same as Dashboard */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_transparent_65%)] opacity-30 pointer-events-none" />

      {/* Card */}
      <div className="relative z-20 w-full max-w-sm bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 flex flex-col items-center text-center shadow-2xl">
        {/* Seal Icon */}
        <div className={`w-24 h-24 rounded-full ${content.bg} ${content.border} border flex items-center justify-center mb-6`}>
          <Icon size={40} className={content.accent} strokeWidth={1.5} />
        </div>

        {/* Eyebrow */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${content.border} ${content.bg} ${content.accent} text-[10px] font-bold tracking-[0.2em] mb-5`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${content.accent.replace("text", "bg")}`} />
          {content.eyebrow}
        </div>

        {/* Text — same gradient heading treatment as Dashboard's welcome message */}
        <h1 className="text-2xl font-semibold leading-tight mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          {content.title}
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">{content.body}</p>

        {/* Single status-correct action */}
        <Link
          to={content.ctaTo}
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${content.ctaColor}`}
        >
          {content.ctaLabel}
          {content.ctaLabel !== "Contact Support" ? (
            <ArrowRight size={16} />
          ) : (
            <HelpCircle size={16} />
          )}
        </Link>
      </div>

      <p className="relative z-20 mt-8 text-[11px] text-gray-600 tracking-wider">
        REF ID: VLT-{accountStatus.toUpperCase()}-{new Date().getFullYear()}
      </p>
    </div>
  );
};

export default OnboardingDashboard;

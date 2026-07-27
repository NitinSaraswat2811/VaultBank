import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Landmark,
  CalendarDays,
  Phone,
  IdCard,
  Check,
  XCircle,
  Loader2,
} from "lucide-react";

import { CreateBankAccount } from "../../services/authServices";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    DateOfBirth: "",
  });

  const [loading, setLoading] = useState(false);

  // null = form screen
  // object = result screen
  const [result, setResult] = useState(null);

  const handleAccountCreation = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await CreateBankAccount(formData);

      const newAccountNumber = response.data.account.accountNumber;

      setResult({
        success: true,
        accountNumber: newAccountNumber,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";

      setResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex items-center justify-center p-4 overflow-hidden font-sans">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-60 pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">
          VaultBank
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

        {/* ================= FORM SCREEN ================= */}
        {!result ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <Landmark className="text-blue-400 w-10 h-10 mb-4" />

              <h2 className="text-3xl font-bold text-center">
                Create your Bank Account
              </h2>

              <p className="text-gray-400 mt-2 text-center">
                Start your secure banking journey
              </p>
            </div>

            <form
              onSubmit={handleAccountCreation}
              className="space-y-4"
            >

              {/* Name Fields */}
              <div className="flex gap-4">

                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition"
                />

                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition"
                />

              </div>

              {/* Mobile Number */}
              <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">

                <Phone
                  size={18}
                  className="text-gray-400 mr-3"
                />

                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-white"
                />

              </div>

              {/* ID Selection Row */}
              <div className="flex gap-4">

                <select
                  name="idType"
                  className="w-1/3 h-12 px-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition text-gray-400"
                >
                  <option value="">Select ID</option>
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN Card</option>
                  <option value="voter">Voter ID</option>
                </select>

                <div className="flex items-center w-2/3 border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">

                  <IdCard
                    size={18}
                    className="text-gray-400 mr-3"
                  />

                  <input
                    type="text"
                    placeholder="Enter ID Number"
                    className="w-full bg-transparent outline-none text-white"
                  />

                </div>

              </div>

              {/* Date of Birth */}
              <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">

                <CalendarDays
                  size={18}
                  className="text-gray-400 mr-3"
                />

                <input
                  type="date"
                  required
                  value={formData.DateOfBirth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      DateOfBirth: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-gray-400"
                />

              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl mt-6 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}

              </button>

            </form>
          </>
        ) : (

          /* ================= RESULT SCREEN ================= */
          <div className="flex flex-col items-center text-center py-8 animate-[fadeIn_0.3s_ease]">

            {result.success ? (

              /* ================= SUCCESS ================= */
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-emerald-500/15 border border-emerald-500/30">

                  <Check
                    className="w-10 h-10 text-emerald-400"
                    strokeWidth={2.5}
                  />

                </div>

                <h2 className="text-2xl font-bold mb-2">
                  Account Created Successfully
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                  Your VaultBank account has been created successfully.
                </p>

                {/* Account Number */}
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-5 mb-8">

                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Your Account Number
                  </p>

                  <p className="text-2xl font-bold tracking-wider text-blue-400 break-all">
                    {result.accountNumber}
                  </p>

                  <p className="text-xs text-gray-500 mt-3">
                    Please save this account number. You will need it for receiving money and making transfers.
                  </p>

                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-3.5 rounded-xl font-semibold"
                >
                  Go to Dashboard
                </button>
              </>

            ) : (

              /* ================= FAILED ================= */
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-500/15 border border-red-500/30">

                  <XCircle
                    className="w-10 h-10 text-red-400"
                    strokeWidth={2.5}
                  />

                </div>

                <h2 className="text-2xl font-bold mb-2">
                  Account Creation Failed
                </h2>

                <p className="text-red-400 text-sm mb-8">
                  {result.message}
                </p>

                <button
                  onClick={() => setResult(null)}
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-3.5 rounded-xl font-semibold"
                >
                  Try Again
                </button>
              </>
            )}

          </div>
        )}

      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
};

export default CreateAccount;
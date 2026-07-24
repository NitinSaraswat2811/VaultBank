import React, { useState,useContext} from "react";
import { useNavigate, Link } from "react-router-dom";
import { Landmark, User, LockKeyhole, Eye, EyeOff } from "lucide-react";
import axios from "axios"; // Axios import karo
import { loginUser } from "../../services/authServices";
import { AuthContext } from "../../context/AuthContext";
import { getAllUserAccounts } from "../../services/authServices";
import { AccountContext } from "../../context/AccountContext";

const Login = () => {
  const navigate = useNavigate(); // navigate helps to change pages without reloading the browser like old <a> tag
  const { login } = useContext(AuthContext);
  const {setAccounts} = useContext(AccountContext);

  // State for form data
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const { data } = await loginUser(formData); 
        login(data.user, data.token); // Context update
        //pahle user save hoga then uske accounts k liye response jayega with token etc

        const accountsResponse = await getAllUserAccounts();
        const accounts = accountsResponse.data.accounts;

        setAccounts(accounts);
  //agar frontend me accounts array update krne k baad usse check karenge to late ho skta h aur empty array bhi true ho jata h is vajah se direct backend response se check kiya
        if(accounts){
        navigate("/dashboard");
        }else{
          navigate("/OnboardingDashboard");
        }
    } catch (error) {
        // Yahan error pta chalega
        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong";
        alert(errorMessage); // UI par error dikhao
    }
};
  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex items-center justify-center p-4 overflow-hidden font-sans">

      {/* Gemini-style background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-60 pointer-events-none"></div>

      {/* VaultBank Logo at Top-Left */}
      <div className="fixed top-8 left-8">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">VaultBank</h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 z-10 shadow-2xl">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-2xl mb-4">
            <Landmark className="text-blue-400 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Login to your secure account</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center border border-white/10 rounded-xl h-14 px-4 bg-white/5 focus-within:border-blue-500/50 transition">
            <User size={20} className="text-gray-400 mr-3" />
            <input
              type="email"
              autoComplete="email"
              value={formData.email} // Ye zaroori hai
              placeholder="Email ID"
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} // Functional state update is safer
              required
            />
          </div>

          <div className="flex items-center border border-white/10 rounded-xl h-14 px-4 bg-white/5 focus-within:border-blue-500/50 transition">
            <LockKeyhole size={20} className="text-gray-400 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white">
              <input type="checkbox" className="accent-blue-600" /> Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl mt-2 transition-all duration-300 shadow-lg shadow-blue-900/20"
          >
            Login
          </button>
        </form>

        {/* Sign Up */}
        <div className="flex justify-center items-center gap-2 mt-8 text-sm">
          <span className="text-gray-400">Don't have an account?</span>
          <Link to="/signup" className="text-blue-400 hover:text-white font-semibold transition">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
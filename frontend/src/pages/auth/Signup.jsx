import React, { useState } from "react";
import { Landmark, User, LockKeyhole, Mail, CalendarDays, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignUp = ({ setShowSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", firstname: "", lastname: "", DateOfBirth: null });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setloading(true);
    if (formData.password != confirmPassword) {
      return alert('Password does not match');
    }
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        DateOfBirth: formData.DateOfBirth
      });

      localStorage.setItem("token", response.data.token);

      navigate('/');
    }
    catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex items-center justify-center p-4 overflow-hidden font-sans">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-60 pointer-events-none"></div>

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">VaultBank</h1>
      </div>

      {/* SignUp Card */}
      <div className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 z-10 shadow-2xl">

        <div className="flex flex-col items-center mb-8">
          <Landmark className="text-blue-400 w-10 h-10 mb-4" />
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-gray-400 mt-2">Start your secure banking journey</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name Row */}
          <div className="flex gap-4">
            <input
              type="text"
              name="firstname"
              autoComplete="given-name"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
              placeholder="First Name" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition" />
            <input
              type="text"
              name="lastname"
              autoComplete="family-name"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              required
              type="text" placeholder="Last Name" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition" />
          </div>

          <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">
            <Mail size={18} className="text-gray-400 mr-3" />
            <input
              name="email"
              autoComplete="new-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              type="email" placeholder="Email Address" className="w-full bg-transparent outline-none text-white" />
          </div>

          <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">
            <LockKeyhole size={18} className="text-gray-400 mr-3" />
            <input

              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-transparent outline-none" />
            <button className="text-gray-400 hover:text-white" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>

          <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">
            <LockKeyhole size={18} className="text-gray-400 mr-3" />
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full bg-transparent outline-none" />
            <button className="text-gray-400 hover:text-white" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>

          <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">
            <CalendarDays size={18} className="text-gray-400 mr-3" />
            <input

              name="DateOfBirth"
              autoComplete="bday"
              value={formData.DateOfBirth}
              onChange={(e) => setFormData({ ...formData, DateOfBirth: e.target.value })}
              required
              type="date" className="w-full bg-transparent outline-none text-gray-400" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl mt-6 transition-all shadow-lg shadow-blue-900/20">
            Create Account
          </button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-8 text-sm">
          <span className="text-gray-400">Already have an account?</span>
          <Link to="/" className="text-blue-400 hover:text-white font-semibold transition">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
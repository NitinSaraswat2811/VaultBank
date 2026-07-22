import React, { useState,useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Landmark, CalendarDays, Phone, IdCard } from 'lucide-react';
import { CreateBankAccount } from '../../services/authServices';
import { AuthContext } from "../../context/AuthContext";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    mobile: "", 
    DateOfBirth: "",
  });

  const[loading,setloading] = useState(false);
 
  const handleAccountCreation = async (e) => {
    e.preventDefault();
    setloading(true);
    console.log("Form Submitted:", formData);
   try{
    const response = await CreateBankAccount(formData);

    console.log("Account created:", response.data);

    navigate("/dashboard");
   }
   catch(err){
    const errorMessage = err.response?.data?.message || "Something went wrong";
        console.log(err.response?.data?.message);
        alert(errorMessage);
   }finally{
    setloading(false);
   }
  };

  return (
    <div className='min-h-screen bg-[#050505] text-white relative flex items-center justify-center p-4 overflow-hidden font-sans'>
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_#050505_70%)] opacity-60 pointer-events-none"></div>
      
       <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">VaultBank</h1>
      </div>
      {/* Account Form Card */}
      <div className="relative z-10 w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <Landmark className="text-blue-400 w-10 h-10 mb-4" />
          <h2 className="text-3xl font-bold">Create your Bank Account</h2>
          <p className="text-gray-400 mt-2">Start your secure banking journey</p>
        </div>

        <form onSubmit={handleAccountCreation} className='space-y-4'>
          {/* Name Fields */}
          <div className="flex gap-4">
            <input type="text" name='firstName' required placeholder='First Name' 
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition" />
            <input type="text" name='lastName' required placeholder='Last Name' 
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition" />
          </div>

          {/* Mobile Number */}
          <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">
            <Phone size={18} className="text-gray-400 mr-3" />
            <input type="number" required placeholder='Mobile Number' value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full bg-transparent outline-none text-white" />
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
              <IdCard size={18} className="text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Enter ID Number" 
                className="w-full bg-transparent outline-none text-white" 
              />
            </div>
          </div>
          
          {/* DOB Field */}
          <div className="flex items-center border border-white/10 rounded-xl h-12 px-4 bg-white/5 focus-within:border-blue-500 transition">
            <CalendarDays size={18} className="text-gray-400 mr-3" />
            <input type="date" required value={formData.DateOfBirth}
              onChange={(e) => setFormData({ ...formData, DateOfBirth: e.target.value })}
              className="w-full bg-transparent outline-none text-gray-400" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl mt-6 transition-all shadow-lg shadow-blue-900/20">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;

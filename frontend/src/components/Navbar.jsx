import React, { useState,useContext } from "react";
import { NavLink } from "react-router-dom";
import { Home, ArrowLeftRight, History, HelpCircle, LogOut, Menu, Landmark } from "lucide-react";
import { loginUser } from "../services/authServices";
import { AuthContext } from "../context/AuthContext";

const NavItem = ({ to, icon, label, isOpen, active, isRed }) => (
  <NavLink 
    to={to} 
    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 
      ${active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'} 
      ${isRed ? 'text-red-400 hover:bg-red-950/30' : ''}`}
  >
    <div className="min-w-[24px]">{icon}</div>
    {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
  </NavLink>
);

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useContext(AuthContext);
  const isAccountCreated = user?.hasAccount;
  
  const handleDisabledClick = (e) => {
    // Agar account nahi hai, toh link navigation rok do aur alert dikhao
    if (!isAccountCreated) {
        e.preventDefault(); // Navigation ruk jayega
        alert("Please create your bank account first to access this feature!");
    }
};

  return (
    <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 z-30 transition-all duration-300 flex flex-col p-4 relative`}>
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_transparent_65%)] opacity-30 pointer-events-none"></div>

      {/* Logo/Toggle Section */}
      <div className="flex items-center gap-4 mb-10 h-12 px-2">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-white">
          <Menu size={24} />
        </button>
        {isSidebarOpen && <h1 className="text-xl font-bold text-blue-500 tracking-tight">VaultBank</h1>}
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        <NavItem to="/dashboard" icon={<Home size={22}/>} label="Dashboard" isOpen={isSidebarOpen} />
        <NavItem 
        to={isAccountCreated ? "/transfer" : "#"} 
                label="Transfer" 
                className={!isAccountCreated ? "opacity-50 cursor-not-allowed" : ""} 
                onClick={!isAccountCreated ? handleDisabledClick : undefined}
         icon={<ArrowLeftRight size={22}/>} label="Transfer" isOpen={isSidebarOpen} />

        <NavItem to={isAccountCreated ? "/history" : "#"} 
            label="History" 
            className={!isAccountCreated ? "opacity-50 cursor-not-allowed" : ""}
            onClick={!isAccountCreated ? handleDisabledClick : undefined} icon={<History size={22}/>} label="History" isOpen={isSidebarOpen} />
        <NavItem to="/help" icon={<HelpCircle size={22}/>} label="Help" isOpen={isSidebarOpen} />
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <NavItem to="/" icon={<LogOut size={22}/>} label="Logout" isOpen={isSidebarOpen} isRed />
      </div>
    </aside>
  );
};

export default Navbar;
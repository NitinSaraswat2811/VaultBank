import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home, ArrowLeftRight, History, User, LogOut, HelpCircle, Wallet, Menu, X
} from "lucide-react";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_transparent_65%)] opacity-30 pointer-events-none"></div>

      {/* Sidebar - Gemini Style */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black/40 backdrop-blur-xl border-r border-white/10 z-30 transition-all duration-300 flex flex-col p-4`}>
        
        {/* Logo/Toggle Section */}
        <div className="flex items-center gap-4 mb-10 h-12">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            <Menu size={24} />
          </button>
          {isSidebarOpen && <h1 className="text-xl font-bold text-blue-500">VaultBank</h1>}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4 flex-1">
          <NavItem to="/dashboard" icon={<Home size={22}/>} label="Dashboard" isOpen={isSidebarOpen} active />
          <NavItem to="/transfer" icon={<ArrowLeftRight size={22}/>} label="Transfer" isOpen={isSidebarOpen} />
          <NavItem to="/history" icon={<History size={22}/>} label="History" isOpen={isSidebarOpen} />
          <NavItem to="/help" icon={<HelpCircle size={22}/>} label="Help" isOpen={isSidebarOpen} />
        </nav>

        {/* Logout */}
        <NavItem to="/" icon={<LogOut size={22}/>} label="Logout" isOpen={isSidebarOpen} isRed />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-10 z-20">
        <div className="text-center mb-12 mt-10 min-h-[120px] flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight pb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Welcome Back, Sanjna 👋
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Your financial dashboard is ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10"><Wallet size={28} className="text-blue-400 mb-4"/><h2 className="text-xl font-semibold">Balance</h2><p className="text-3xl font-bold mt-2">$24,500.00</p></div>
          <Link to="/transfer" className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all">
            <ArrowLeftRight size={28} className="text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Transfer Money</h2>
          </Link>

          <Link to="/history" className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all">
            <History size={28} className="text-purple-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">History</h2>
          </Link>

          <Link to="/help" className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all">
            <HelpCircle size={28} className="text-green-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Help & Support</h2>
          </Link>
        </div>
      </main>
    </div>
  );
};

// Helper component for clean Sidebar Items
const NavItem = ({ to, icon, label, isOpen, active, isRed }) => (
  <Link to={to} className={`flex items-center gap-4 p-3 rounded-xl transition ${active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'} ${isRed ? 'text-red-400 hover:bg-red-500/10' : ''}`}>
    {icon}
    {isOpen && <span className="whitespace-nowrap font-medium">{label}</span>}
  </Link>
);

export default Dashboard;
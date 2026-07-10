import React, { useState } from "react";
import { Home, ArrowLeftRight, History, HelpCircle, Wallet, LogOut } from "lucide-react";
import Navbar from "../../components/Navbar"; 

const OnboardingDashboard = () => {
    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar Fix: Sidebar ko flex container ke andar rakha */}
            <Navbar />

            {/* Content Area */}
            <main className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
                <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
                    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                        
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Wallet className="w-10 h-10 text-blue-400" />
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="text-center mt-8">
                            <h1 className="text-4xl font-bold">Welcome to VaultBank 👋</h1>
                            <p className="text-gray-400 mt-4 text-lg leading-8">
                                Your profile has been created successfully.
                                <br />
                                To start banking, you'll need to open your first bank account.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-10">
                            <button className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-lg font-semibold shadow-lg shadow-blue-900/30">
                                Open Bank Account
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-10">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-gray-500 text-sm uppercase tracking-widest">Benefits</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="font-semibold mb-2">Instant Account</h3>
                                <p className="text-sm text-gray-400">Created instantly after verification.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="font-semibold mb-2">Secure Banking</h3>
                                <p className="text-sm text-gray-400">Bank-grade security for every transaction.</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="font-semibold mb-2">Money Transfers</h3>
                                <p className="text-sm text-gray-400">Fast transfers available once active.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OnboardingDashboard;
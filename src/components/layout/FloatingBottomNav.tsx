'use client';

import React, { useEffect, useState } from 'react';
import { Home, Calendar, Plus, User, FileText, Vote, ShieldCheck, Wrench, Building2, Landmark } from 'lucide-react';
import { demoStore } from '@/lib/demo-store';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/cooperative';

export default function FloatingBottomNav() {
  const { user, profile } = useAuth();
  const [role, setRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    queueMicrotask(() => {
      const currentRole = profile?.role || demoStore.getState().currentRole;
      setRole(currentRole);
    });
    const unsubscribe = demoStore.subscribe(() => {
      setRole(profile?.role || demoStore.getState().currentRole);
    });
    return unsubscribe;
  }, [profile]);

  if (!user) return null;

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#18181B] text-white rounded-full px-5 py-2 shadow-2xl border border-neutral-800 flex items-center gap-6 sm:gap-8 backdrop-blur-md"
    >
      {/* Tab 1: Home */}
      <button 
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
          activeTab === 'home' ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Tab 2: Contextual Role Tab */}
      {role === 'customer' && (
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'bookings' ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Trips</span>
        </button>
      )}

      {role === 'provider' && (
        <button 
          onClick={() => setActiveTab('governance')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'governance' ? 'text-purple-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Ballot</span>
        </button>
      )}

      {role === 'coop_admin' && (
        <button 
          onClick={() => setActiveTab('kyc')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'kyc' ? 'text-blue-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>KYC</span>
        </button>
      )}

      {role === 'ministry_admin' && (
        <button 
          onClick={() => setActiveTab('states')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            activeTab === 'states' ? 'text-purple-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Federation</span>
        </button>
      )}

      {/* Elevated Center CTA Button as analyzed in Design Doc */}
      <button 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="w-11 h-11 -mt-5 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 hover:bg-[#09442A] hover:scale-105 transition-all border-2 border-white/20"
        title="Quick Action"
      >
        {role === 'customer' && <Plus className="w-6 h-6" />}
        {role === 'provider' && <Wrench className="w-5 h-5" />}
        {role === 'coop_admin' && <Building2 className="w-5 h-5" />}
        {role === 'ministry_admin' && <ShieldCheck className="w-5 h-5" />}
      </button>

      {/* Tab 3: Member Profile */}
      <button 
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
          activeTab === 'profile' ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Profile</span>
      </button>

      {/* Tab 4: Cooperative Info */}
      <button 
        onClick={() => {
          alert("Sahkar Platform Cooperative (SIH26089) — Designed for Ministry of Cooperation 'Sahkar Se Samriddhi' Mission.");
        }}
        className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Sahkar</span>
      </button>
    </nav>
  );
}

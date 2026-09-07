'use client';

import React, { useEffect, useState } from 'react';
import { demoStore } from '@/lib/demo-store';
import { useAuth } from '@/context/AuthContext';
import { LanguageCode } from '@/types/cooperative';
import { ShieldCheck, UserCheck, Wrench, Building2, Landmark, Globe, Radio, LogOut, User } from 'lucide-react';

export default function DemoRoleSwitcher() {
  const { user, profile, logout } = useAuth();
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLang(demoStore.getState().language);
      setIsFirebaseLive(demoStore.isFirebaseLive());
    });
    const unsubscribe = demoStore.subscribe(() => {
      setLang(demoStore.getState().language);
      setIsFirebaseLive(demoStore.isFirebaseLive());
    });
    return unsubscribe;
  }, []);

  const handleLangChange = (newLang: LanguageCode) => {
    demoStore.setLanguage(newLang);
  };

  return (
    <aside aria-label="Demo role and language selector" className="bg-[#18181B] text-white border-b border-neutral-800 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Project Branding & SIH Tag */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0D5C3A] text-white font-bold px-2 py-0.5 rounded text-[11px] tracking-wide flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>SIH26089</span>
          </div>
          <span className="font-semibold text-neutral-200 hidden sm:inline">
            Sahkar Platform Cooperative
          </span>
          {isFirebaseLive ? (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-600/50 px-2 py-0.5 rounded-full">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              <span>Firestore Live Sync</span>
            </span>
          ) : (
            <span 
              className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Local Store</span>
            </span>
          )}
        </div>

        {/* Center: Authenticated User Status & Logout */}
        <div className="flex items-center gap-2 bg-neutral-900/90 py-1 px-3 rounded-xl border border-neutral-800">
          {user ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-neutral-300 text-[11px] font-medium truncate max-w-[140px] sm:max-w-[200px]">
                  {profile?.fullName || user.email}
                </span>
                
                {profile?.role === 'customer' && (
                  <span className="bg-[#0D5C3A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Customer</span>
                  </span>
                )}
                {profile?.role === 'provider' && (
                  <span className="bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    <span>Worker</span>
                  </span>
                )}
                {profile?.role === 'coop_admin' && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>Admin</span>
                  </span>
                )}
                {profile?.role === 'ministry_admin' && (
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Landmark className="w-3 h-3" />
                    <span>Ministry</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={logout}
                className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all text-[11px] font-medium border border-neutral-700"
                title="Sign out of Firebase Auth"
              >
                <LogOut className="w-3 h-3 text-red-400" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Not Authenticated (Sign in below)</span>
            </div>
          )}
        </div>

        {/* Right: Language Selector */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
            <button
              onClick={() => handleLangChange('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                lang === 'en' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLangChange('hi')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                lang === 'hi' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLangChange('mr')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                lang === 'mr' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}

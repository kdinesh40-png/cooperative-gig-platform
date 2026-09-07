'use client';

import React, { useEffect, useState } from 'react';
import { demoStore } from '@/lib/demo-store';
import { UserRole, LanguageCode } from '@/types/cooperative';
import { ShieldCheck, UserCheck, Wrench, Building2, Landmark, Globe, Radio } from 'lucide-react';

export default function DemoRoleSwitcher() {
  const [role, setRole] = useState<UserRole>('customer');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  useEffect(() => {
    setRole(demoStore.getState().currentRole);
    setLang(demoStore.getState().language);
    setIsFirebaseLive(demoStore.isFirebaseLive());
    const unsubscribe = demoStore.subscribe(() => {
      setRole(demoStore.getState().currentRole);
      setLang(demoStore.getState().language);
      setIsFirebaseLive(demoStore.isFirebaseLive());
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    demoStore.setRole(newRole);
  };

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
              title="Add Firebase credentials in .env.local to activate real-time multi-browser sync"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Local Store (Configure .env.local for Firestore)</span>
            </span>
          )}
        </div>

        {/* Center: Role Switcher Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
          <span className="text-neutral-400 text-[11px] px-2 font-medium hidden lg:inline">
            Demo Persona:
          </span>

          <button
            onClick={() => handleRoleChange('customer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              role === 'customer'
                ? 'bg-[#0D5C3A] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customer (Priya)</span>
          </button>

          <button
            onClick={() => handleRoleChange('provider')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              role === 'provider'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Worker (Ramesh)</span>
          </button>

          <button
            onClick={() => handleRoleChange('coop_admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              role === 'coop_admin'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Society Admin</span>
          </button>

          <button
            onClick={() => handleRoleChange('ministry_admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              role === 'ministry_admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Ministry / NCDC</span>
          </button>
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

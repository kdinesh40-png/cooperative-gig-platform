'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/cooperative';
import { ShieldCheck, LogIn, UserPlus, AlertCircle, Wrench, UserCheck, Lock, Mail, Phone, User as UserIcon, Loader2 } from 'lucide-react';

export default function AuthForm() {
  const { login, signup, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email || !password) {
      setFormError('Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!fullName) {
          setFormError('Please enter your full name.');
          setSubmitting(false);
          return;
        }
        await signup(email, password, role, fullName, phone);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    setMode('login');
    setEmail('customer@sahkar.coop');
    setPassword('sahkar123');
    setFullName('Priya Sharma');
    setRole('customer');
    setFormError(null);
  };

  const fillDemoWorker = () => {
    setMode('login');
    setEmail('worker@sahkar.coop');
    setPassword('sahkar123');
    setFullName('Ramesh Kumar');
    setRole('provider');
    setFormError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200 space-y-6">
        
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#0D5C3A] text-white px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Sahkar Platform Cooperative</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Join Platform Cooperative'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            {mode === 'login' 
              ? 'Sign in to access your Sahkar member account' 
              : 'Register as a Customer or Worker Owner ("Sevak Hi Malik")'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setFormError(null); clearError(); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' 
                ? 'bg-white text-neutral-900 shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setFormError(null); clearError(); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' 
                ? 'bg-white text-neutral-900 shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Quick Demo Credentials Assistant */}
        <div className="bg-emerald-950/5 border border-emerald-800/20 rounded-2xl p-3.5 text-xs space-y-2">
          <div className="font-bold text-[#0D5C3A] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick Test Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="px-2.5 py-1.5 bg-white border border-emerald-300 rounded-xl text-[11px] font-semibold text-[#0D5C3A] hover:bg-emerald-50 transition-all text-left flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Customer (Priya)</span>
            </button>

            <button
              type="button"
              onClick={fillDemoWorker}
              className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-[11px] font-semibold text-amber-800 hover:bg-amber-50 transition-all text-left flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Worker (Ramesh)</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(formError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Registration Role Selection */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    role === 'customer'
                      ? 'border-[#0D5C3A] bg-emerald-50 text-[#0D5C3A] ring-1 ring-[#0D5C3A]'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-[#0D5C3A]" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    role === 'provider'
                      ? 'border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-600'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <span>Worker / Technician</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Name field for registration */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder={role === 'provider' ? 'e.g. Ramesh Kumar' : 'e.g. Priya Sharma'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#0D5C3A] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone field for registration */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#0D5C3A] focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#0D5C3A] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#0D5C3A] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0D5C3A] text-white font-bold rounded-2xl text-xs sm:text-sm hover:bg-[#09442A] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Firebase...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Sahkar</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
          Worker-Owned Platform Cooperative • Ministry of Cooperation
        </div>
      </div>
    </div>
  );
}

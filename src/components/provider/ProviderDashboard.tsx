'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Power, 
  Wallet, 
  ArrowDownToLine, 
  Vote, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  KeyRound,
  FileBadge,
  Radio,
  RefreshCw
} from 'lucide-react';
import { demoStore } from '@/lib/demo-store';
import { useAuth } from '@/context/AuthContext';
import { BookingStatus } from '@/types/cooperative';
import { formatINR } from '@/lib/fee-calculator';
import { translations } from '@/lib/i18n';

export default function ProviderDashboard() {
  const { profile } = useAuth();
  const [state, setState] = useState(demoStore.getState());
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [selectedVoteOption, setSelectedVoteOption] = useState<string>('');
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const initialSync = demoStore.getSyncStatus();
  const [listenerStatus, setListenerStatus] = useState<'connecting' | 'connected' | 'error'>(initialSync.status);
  const [listenerError, setListenerError] = useState<string | null>(initialSync.error);

  useEffect(() => {
    // Subscribe to centralized demoStore which coordinates real-time Firestore sync
    const storeUnsubscribe = demoStore.subscribe(() => {
      setState(demoStore.getState());
      const syncInfo = demoStore.getSyncStatus();
      setListenerStatus(syncInfo.status);
      setListenerError(syncInfo.error);
    });

    return () => {
      storeUnsubscribe();
    };
  }, []);

  const t = translations[state.language] || translations.en;
  const defaultProvider = state.providers.find(p => p.id === 'prov-ramesh') || state.providers[0];
  const provider = defaultProvider;
  const providerName = profile?.fullName || defaultProvider.fullName;
  const providerInitials = providerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'RK';

  // Select active job (assigned to this provider or unassigned open booking)
  const activeJob = state.bookings.find(
    b => (b.providerId === defaultProvider.id || b.providerId === profile?.uid || !b.providerId || b.customerId) && 
         b.status !== 'completed' && 
         b.status !== 'cancelled'
  ) || state.bookings[0];
  const activeProposal = state.proposals[0];

  const handleToggleAvailability = () => {
    demoStore.toggleProviderAvailability(defaultProvider.id);
  };

  const handleStatusTransition = (newStatus: BookingStatus) => {
    if (!activeJob) return;
    demoStore.updateBookingStatus(activeJob.id, newStatus);
  };

  const handleVerifyOtpAndStart = () => {
    if (!activeJob) return;
    if (enteredOtp.trim() === activeJob.otpServiceStart) {
      setOtpError('');
      demoStore.updateBookingStatus(activeJob.id, 'in_progress');
    } else {
      setOtpError(`Invalid code. Expected code is ${activeJob.otpServiceStart}`);
    }
  };

  const handleCompleteJob = () => {
    if (!activeJob) return;
    demoStore.updateBookingStatus(activeJob.id, 'completed');
  };

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const handleCastVote = () => {
    if (!selectedVoteOption || !activeProposal) return;
    demoStore.castVote(activeProposal.id, selectedVoteOption);
    setVoteSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-7 pb-28">
      
      {/* 1. Header & Member Owner Identity */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            {providerInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                {providerName}
              </h1>
              <span className="bg-emerald-50 text-[#0D5C3A] text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sevak Hi Malik</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Cooperative Member ID: <strong>{provider.memberIdNumber}</strong> • {provider.trade}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
              <span className="bg-emerald-50 text-[#0D5C3A] px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                ✓ Police Verified Badge
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold border border-blue-200">
                ✓ e-Shram UAN: {provider.eshramUan}
              </span>
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold border border-purple-200">
                ✓ PM-SYM Pension Enrolled
              </span>
            </div>
          </div>
        </div>

        {/* Large Availability Switch & Real-time Live Dispatch Status */}
        <div className="flex flex-wrap items-center gap-3">
          {listenerStatus === 'connected' ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-2xl shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              <span>Live Dispatch Sync</span>
            </span>
          ) : listenerStatus === 'connecting' ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xl shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Connecting Dispatch...</span>
            </span>
          ) : (
            <span 
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-800 bg-red-50 border border-red-300 px-3 py-1.5 rounded-2xl shadow-sm"
              title={listenerError || 'Firestore listener offline'}
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Dispatch Offline</span>
            </span>
          )}

          <button
            onClick={handleToggleAvailability}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
              provider.isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{provider.isAvailable ? 'Online & Available' : 'Offline'}</span>
          </button>
        </div>
      </header>

      {listenerError && (
        <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Firestore dispatch listener encountered an error: {listenerError}</span>
          </div>
        </div>
      )}

      {/* 2. Real-Time Earnings Ledger Card (Cooperative Economics) */}
      <section className="bg-gradient-to-br from-[#18181B] via-neutral-900 to-[#18181B] text-white rounded-3xl p-6 shadow-xl border border-neutral-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-lg font-bold tracking-tight">
              {t.earningsLedger} (Audited 93% Net Direct)
            </h2>
          </div>
          
          <button
            onClick={handleWithdraw}
            className="bg-[#0D5C3A] hover:bg-[#09442A] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>{t.instantWithdraw} ({provider.upiId})</span>
          </button>
        </div>

        {withdrawSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Withdrawal of {formatINR(provider.totalEarningsNet)} initiated via instant NPCI/UPI transfer!</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-neutral-400 block">{t.grossEarned}</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              {formatINR(provider.totalEarningsGross)}
            </span>
            <span className="text-[10px] text-neutral-400">178 Completed Jobs</span>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-neutral-400 block">{t.coopUpkeep}</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
              {formatINR(provider.totalEarningsGross * 0.05)}
            </span>
            <span className="text-[10px] text-neutral-400">Tech & Ops Only</span>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-neutral-400 block">{t.welfareFund}</span>
            <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1 block">
              {formatINR(provider.totalEarningsGross * 0.02)}
            </span>
            <span className="text-[10px] text-neutral-400">Accident & Health Pool</span>
          </div>

          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30">
            <span className="text-[11px] text-emerald-300 block font-semibold">{t.netPayout}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
              {formatINR(provider.totalEarningsNet)}
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold">+₹12,400 vs Urban Company</span>
          </div>
        </div>
      </section>

      {/* 3. Active Job Dispatch & Execution Flow */}
      {activeJob ? (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider inline-block">
                Active Job Dispatch • SLA 45 Mins
              </span>
              <h3 className="text-lg font-bold text-neutral-900 mt-1">
                {activeJob.serviceName}
              </h3>
              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{activeJob.customerAddress}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Your Direct Payout (93%):</span>
              <span className="text-2xl font-black text-[#0D5C3A]">
                {formatINR(activeJob.providerPayoutAmount)}
              </span>
            </div>
          </div>

          {/* Job State Controller Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleStatusTransition('arrived')}
              disabled={activeJob.status === 'arrived' || activeJob.status === 'in_progress'}
              className={`p-3 rounded-2xl font-bold text-xs border transition-all ${
                activeJob.status === 'arrived' || activeJob.status === 'in_progress'
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-[#0D5C3A] border-emerald-300'
              }`}
            >
              1. Mark Arrived at Customer
            </button>

            {/* OTP Verification Step */}
            <div className="sm:col-span-2 flex flex-col gap-2">
              {activeJob.status === 'in_progress' ? (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-[#0D5C3A] font-bold text-xs rounded-2xl border border-emerald-200 flex-1 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>OTP Verified • Work In Progress</span>
                  </div>
                  <button
                    onClick={handleCompleteJob}
                    className="p-3 bg-[#0D5C3A] hover:bg-[#09442A] text-white font-bold text-xs rounded-2xl shadow-md transition-all"
                  >
                    Mark Job Completed
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 4-digit Customer Start OTP"
                      className="w-full text-xs pl-9 pr-3 py-3 bg-neutral-50 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-[#0D5C3A] outline-none font-bold"
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtpAndStart}
                    className="bg-[#18181B] hover:bg-black text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-sm transition-all whitespace-nowrap"
                  >
                    Verify & Start Work
                  </button>
                </div>
              )}
              {otpError && (
                <span className="text-[11px] text-red-600 font-semibold">{otpError}</span>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 text-center py-10 space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-neutral-800 text-base">All Assigned Jobs Completed!</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            You are currently online. New incoming booking requests within your 12 km radius will alert automatically.
          </p>
        </section>
      )}

      {/* 4. "Member Voice" Democratic Governance & Voting Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {t.memberVoice} (Bylaw Voting)
            </h2>
            <p className="text-xs text-neutral-500">
              Multi-State Cooperative Societies Act Principle: One Member = One Vote
            </p>
          </div>
        </div>

        {activeProposal && (
          <div className="space-y-3">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-xs font-bold text-neutral-800">{activeProposal.title}</span>
              <p className="text-xs text-neutral-600 leading-relaxed">{activeProposal.description}</p>
            </div>

            {/* Voting Radio Options */}
            <div className="space-y-2">
              {activeProposal.options.map((opt) => (
                <label 
                  key={opt.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                    selectedVoteOption === opt.id
                      ? 'bg-purple-50/70 border-purple-400 font-bold text-purple-950'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="radio"
                      name="proposalVote"
                      value={opt.id}
                      checked={selectedVoteOption === opt.id}
                      onChange={() => setSelectedVoteOption(opt.id)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-neutral-400 font-semibold text-[11px]">
                    {opt.voteCount} votes ({Math.round((opt.voteCount / (activeProposal.totalVotes || 1)) * 100)}%)
                  </span>
                </label>
              ))}
            </div>

            {voteSubmitted || activeProposal.userVotedOptionId ? (
              <div className="bg-emerald-50 border border-emerald-300 text-[#0D5C3A] p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t.votedThankYou} • Your democratic voice has been recorded in the cooperative ledger.</span>
              </div>
            ) : (
              <button
                onClick={handleCastVote}
                disabled={!selectedVoteOption}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Vote className="w-4 h-4" />
                <span>{t.voteNow}</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* 5. Welfare, Skilling & e-Shram Credentials Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <FileBadge className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-neutral-900">
            Cooperative Member Welfare & Social Security Links
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-semibold text-neutral-800 block">National e-Shram UAN</span>
            <span className="text-neutral-600 font-mono">{provider.eshramUan}</span>
            <p className="text-[10px] text-emerald-700 font-semibold mt-1">✓ Active Accidental Cover (₹2,00,000)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-semibold text-neutral-800 block">ITI Skill Certification</span>
            <span className="text-neutral-600">{provider.trainingInstitute}</span>
            <p className="text-[10px] text-blue-700 font-semibold mt-1">✓ Grade-A Master Electrician</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-semibold text-neutral-800 block">Cooperative Society Bank Ledger</span>
            <span className="text-neutral-600">{provider.bankAccount}</span>
            <p className="text-[10px] text-neutral-500 mt-1">IFSC: {provider.bankIfsc}</p>
          </div>
        </div>
      </section>

    </div>
  );
}

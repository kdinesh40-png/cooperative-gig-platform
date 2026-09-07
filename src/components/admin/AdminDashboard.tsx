'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  FileCheck, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { demoStore } from '@/lib/demo-store';
import { formatINR } from '@/lib/fee-calculator';
import { translations } from '@/lib/i18n';

export default function AdminDashboard() {
  const [state, setState] = useState(demoStore.getState());
  const [feeSlider, setFeeSlider] = useState(state.cooperativeFeePercent);
  const [feeSaveSuccess, setFeeSaveSuccess] = useState(false);
  const [kycSuccessMsg, setKycSuccessMsg] = useState('');
  const [grievanceSuccessMsg, setGrievanceSuccessMsg] = useState('');

  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setState(demoStore.getState());
      setFeeSlider(demoStore.getState().cooperativeFeePercent);
    });
    return unsubscribe;
  }, []);

  const t = translations[state.language] || translations.en;

  // Find pending provider for KYC demo (Ashok Mehra)
  const pendingProvider = state.providers.find(p => p.verificationStatus === 'pending') || state.providers[2];
  const activeGrievance = state.grievances.find(g => g.status !== 'resolved') || state.grievances[0];

  const handleApproveKyc = (givePoliceBadge: boolean) => {
    if (!pendingProvider) return;
    demoStore.approveProviderKyc(pendingProvider.id, givePoliceBadge);
    setKycSuccessMsg(`Approved ${pendingProvider.fullName} with ${givePoliceBadge ? 'Police Verification Badge' : 'Standard Badge'}.`);
    setTimeout(() => setKycSuccessMsg(''), 4000);
  };

  const handleUpdateFeeSlab = () => {
    demoStore.updateFeeSlab(feeSlider);
    setFeeSaveSuccess(true);
    setTimeout(() => setFeeSaveSuccess(false), 3000);
  };

  const handleResolveGrievance = () => {
    if (!activeGrievance) return;
    demoStore.resolveGrievance(activeGrievance.id);
    setGrievanceSuccessMsg(`Grievance ${activeGrievance.ticketReference} resolved within 48h statutory SLA.`);
    setTimeout(() => setGrievanceSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-7 pb-28">
      
      {/* 1. Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                {t.adminDashboard}
              </h1>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                District Registrar Portal
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Sahkar Urban Services Multi-State Co-op Society Ltd. (MSCS/CR/2026/8941)
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert("Statutory Ministry Audit Log Exported as PDF/CSV")}
          className="bg-neutral-900 hover:bg-black text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Statutory Audit Report</span>
        </button>
      </header>

      {/* 2. Operations Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">{t.totalGMV}</span>
          <div className="text-2xl font-black text-neutral-900">₹1,48,600</div>
          <span className="text-[11px] text-emerald-700 font-semibold">+18.4% month-over-month</span>
        </div>

        <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#0D5C3A]">{t.workerRetentionRate}</span>
          <div className="text-2xl font-black text-[#0D5C3A]">93.8%</div>
          <span className="text-[11px] text-emerald-700 font-semibold">vs 72% Aggregator benchmark</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">{t.activeProviders}</span>
          <div className="text-2xl font-black text-neutral-900">84 Members</div>
          <span className="text-[11px] text-blue-700 font-semibold">42% Women SHG Collectives</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">Active SLA Grievances</span>
          <div className="text-2xl font-black text-amber-600">
            {state.grievances.filter(g => g.status !== 'resolved').length} Open
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% 48h SLA Adherence</span>
        </div>
      </section>

      {/* 3. Member Onboarding & KYC Verification Queue */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-neutral-900">
              {t.verifyKYC} (Onboarding Review)
            </h2>
          </div>
          <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
            1 Application Awaiting Review
          </span>
        </div>

        {kycSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-[#0D5C3A] p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{kycSuccessMsg}</span>
          </div>
        )}

        {pendingProvider && pendingProvider.verificationStatus === 'pending' ? (
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">
                  {pendingProvider.fullName} — {pendingProvider.trade}
                </h3>
                <p className="text-xs text-neutral-500">
                  Phone: {pendingProvider.phone} • Experience: {pendingProvider.experienceYears} Years
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                Status: Pending Verification
              </span>
            </div>

            {/* Document Inspection Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-semibold text-neutral-700 block">Identity Document</span>
                <span className="text-neutral-900 font-mono">Aadhaar: {pendingProvider.idProofNumber}</span>
                <p className="text-[10px] text-emerald-700 font-semibold">✓ DigiLocker Verified</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-semibold text-neutral-700 block">Trade Qualification</span>
                <span className="text-neutral-900">{pendingProvider.trainingInstitute}</span>
                <p className="text-[10px] text-blue-700 font-semibold">✓ Apprenticeship Certified</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-1">
                <span className="font-semibold text-neutral-700 block">Social Security / e-Shram</span>
                <span className="text-neutral-900 font-mono">{pendingProvider.eshramUan}</span>
                <p className="text-[10px] text-purple-700 font-semibold">✓ Linked to PMSYM</p>
              </div>
            </div>

            {/* Verification Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleApproveKyc(true)}
                className="bg-[#0D5C3A] hover:bg-[#09442A] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve & Grant Police Verification Badge</span>
              </button>

              <button
                onClick={() => handleApproveKyc(false)}
                className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Approve (Standard Member)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-neutral-500 bg-neutral-50 rounded-2xl">
            ✓ All member onboarding documents have been reviewed and verified.
          </div>
        )}
      </section>

      {/* 4. Dynamic Fee Slab & Service Catalog Pricing Editor */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <Sliders className="w-5 h-5 text-[#0D5C3A]" />
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Cooperative Fee Slab Governance & Pricing Policy
            </h2>
            <p className="text-xs text-neutral-500">
              Under Cooperative Bylaws, changes are capped between 5.0% and 10.0% to prevent worker exploitation.
            </p>
          </div>
        </div>

        {feeSaveSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-[#0D5C3A] p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cooperative Service Fee updated to {feeSlider}%. All live booking calculations synchronized.</span>
          </div>
        )}

        <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-neutral-800 block">
                Cooperative Technology & Maintenance Fee:
              </span>
              <span className="text-xs text-neutral-500">
                Covers server infrastructure, SMS OTPs, and local helpdesk
              </span>
            </div>
            <div className="text-2xl font-black text-[#0D5C3A]">
              {feeSlider.toFixed(1)}%
            </div>
          </div>

          <input 
            type="range"
            min="3.0"
            max="10.0"
            step="0.5"
            value={feeSlider}
            onChange={(e) => setFeeSlider(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-[#0D5C3A]"
          />

          <div className="flex justify-between text-[11px] text-neutral-500">
            <span>Minimum: 3.0%</span>
            <span>Current: {feeSlider}%</span>
            <span>Statutory Cap: 10.0%</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-neutral-700">
              Worker Retention at this slab: <strong>{(100 - feeSlider - state.welfareFundPercent).toFixed(1)}%</strong>
            </span>
            <button
              onClick={handleUpdateFeeSlab}
              className="bg-[#0D5C3A] hover:bg-[#09442A] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Update Cooperative Bylaw Slab
            </button>
          </div>
        </div>
      </section>

      {/* 5. Grievance Redressal Center (48h Statutory SLA) */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-neutral-900">
              {t.disputeQueue}
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Mandatory Consumer Protection SLA
          </span>
        </div>

        {grievanceSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-[#0D5C3A] p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{grievanceSuccessMsg}</span>
          </div>
        )}

        {activeGrievance && activeGrievance.status !== 'resolved' ? (
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Ticket #{activeGrievance.ticketReference} — {activeGrievance.customerName} vs. {activeGrievance.providerName}
                </span>
                <p className="text-xs text-neutral-600 mt-1">&quot;{activeGrievance.description}&quot;</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{activeGrievance.resolutionDeadline}</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleResolveGrievance}
                className="bg-[#0D5C3A] hover:bg-[#09442A] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Resolve & Release Escrow Settlement
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-neutral-500 bg-neutral-50 rounded-2xl">
            ✓ Zero pending grievances. All disputes settled within the 48-hour SLA.
          </div>
        )}
      </section>

    </div>
  );
}

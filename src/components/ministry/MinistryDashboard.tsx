'use client';

import React, { useState, useEffect } from 'react';
import { Landmark } from 'lucide-react';
import { formatINR } from '@/lib/fee-calculator';
import { demoStore } from '@/lib/demo-store';

export default function MinistryDashboard() {
  const [state, setState] = useState(demoStore.getState());

  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setState(demoStore.getState());
    });
    return unsubscribe;
  }, []);

  const retentionPct = (100 - state.cooperativeFeePercent - state.welfareFundPercent).toFixed(1) + '%';
  const approvedProviders = state.providers.filter(p => p.verificationStatus === 'approved').length;

  const statePilots = [
    { state: 'Delhi NCT', society: 'Sahkar Urban Services Multi-State Co-op', members: approvedProviders || 84, gmv: 148600, retentionRate: retentionPct, shgPct: '42%' },
    { state: 'Maharashtra', society: 'Maharashtra Shramik Seva Sahakari Sanstha', members: 162, gmv: 312000, retentionRate: '94.2%', shgPct: '48%' },
    { state: 'Karnataka', society: 'Karnataka Rajya Karmika Sahakara Mahamandala', members: 110, gmv: 219500, retentionRate: '93.5%', shgPct: '39%' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-7 pb-28">
      
      {/* 1. Header */}
      <header className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                Ministry of Cooperation & NCDC Oversight
              </h1>
              <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                &quot;Sahkar Se Samriddhi&quot;
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              National Platform Cooperative Registry • Multi-State Cooperative Societies Act, 2002
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-2xl text-xs font-semibold text-purple-900">
          Replicating the <strong>Sahakar Taxi (Bharat Taxi)</strong> Model for Household Gig Work
        </div>
      </header>

      {/* 2. National Macro Impact Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">Total Worker Value Retained</span>
          <div className="text-2xl font-black text-[#0D5C3A]">₹6,36,000+</div>
          <span className="text-[11px] text-emerald-700 font-semibold">+₹1,45,000 vs. Aggregator Deductions</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">Active Member Cooperatives</span>
          <div className="text-2xl font-black text-neutral-900">3 States</div>
          <span className="text-[11px] text-blue-700 font-semibold">Delhi, Maharashtra, Karnataka</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">Women SHG Inclusion</span>
          <div className="text-2xl font-black text-neutral-900">44.6%</div>
          <span className="text-[11px] text-purple-700 font-semibold">158 Self-Help Group Members</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500">Social Security Coverage</span>
          <div className="text-2xl font-black text-neutral-900">98.2%</div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% e-Shram & PM-SYM Linked</span>
        </div>
      </section>

      {/* 3. Multi-State Society Federation Table */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">
            State-Wise Cooperative Societies Federation
          </h2>
          <p className="text-xs text-neutral-500">
            Autonomous state-level primary societies sharing the open-source Sahkar digital backbone
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="p-3.5">State / Union Territory</th>
                <th className="p-3.5">Registered Cooperative Society</th>
                <th className="p-3.5">Active Members</th>
                <th className="p-3.5">Gross Volume</th>
                <th className="p-3.5">Retention %</th>
                <th className="p-3.5">Women SHG %</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {statePilots.map((pilot, idx) => (
                <tr key={idx} className="hover:bg-neutral-50">
                  <td className="p-3.5 font-bold text-neutral-900">{pilot.state}</td>
                  <td className="p-3.5">{pilot.society}</td>
                  <td className="p-3.5 font-semibold">{pilot.members}</td>
                  <td className="p-3.5 font-bold text-neutral-900">{formatINR(pilot.gmv)}</td>
                  <td className="p-3.5 text-[#0D5C3A] font-extrabold">{pilot.retentionRate}</td>
                  <td className="p-3.5 text-purple-700 font-semibold">{pilot.shgPct}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-[#0D5C3A] border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Policy Comparison: Sahkar Model vs Corporate Aggregator Giants */}
      <section className="bg-neutral-900 text-white rounded-3xl p-6 shadow-xl border border-neutral-800 space-y-4">
        <h2 className="text-base font-bold text-neutral-100">
          Policy Evaluation: Cooperative Platform (&quot;Sahkar&quot;) vs. Investor Aggregator (Urban Company)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-amber-400 block text-sm">
              Typical Investor-Owned Platform
            </span>
            <ul className="space-y-1.5 text-neutral-300">
              <li>❌ <strong>20%–30% Commission:</strong> High fee extracted for investor margins</li>
              <li>❌ <strong>Zero Worker Voice:</strong> Algorithmic de-platforming & unilateral price cuts</li>
              <li>❌ <strong>Surge Pricing:</strong> Opaque prices fluctuating 2x–3x during monsoons & heatwaves</li>
              <li>❌ <strong>Informal Exploitation:</strong> Workers classified as &quot;gig partners&quot; with no welfare rights</li>
            </ul>
          </div>

          <div className="bg-[#0D5C3A]/30 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-emerald-300 block text-sm">
              Sahkar Cooperative Model (SIH26089)
            </span>
            <ul className="space-y-1.5 text-neutral-200">
              <li>✓ <strong>5% Platform Fee Only:</strong> 93%–95% earnings retained directly by technicians</li>
              <li>✓ <strong>Democratic Governance:</strong> 1-Member-1-Vote on bylaws, welfare funds, and fee slabs</li>
              <li>✓ <strong>Zero Surge Standard Rates:</strong> Transparent, fixed pricing set by Cooperative Society</li>
              <li>✓ <strong>Organized Welfare Link:</strong> Mandatory linkage to e-Shram, PM-SYM, and insurance pool</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}

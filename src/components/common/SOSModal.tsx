'use client';

import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { demoStore } from '@/lib/demo-store';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingReference?: string;
  customerName?: string;
}

export default function SOSModal({ isOpen, onClose, bookingReference = 'COOP-2026-DEL-8941', customerName = 'Priya Sharma' }: SOSModalProps) {
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen) return null;

  const handleBroadcastSOS = () => {
    demoStore.triggerEmergencySos(bookingReference);
    setAlertSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 text-neutral-900 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
          <span>Trust & Safety Emergency SOS</span>
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          Cooperative Safety Protocol for Booking <strong>{bookingReference}</strong>
        </p>

        {alertSent ? (
          <div className="my-6 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 text-sm">Emergency Alert Broadcasted</h4>
              <p className="text-xs text-red-700 mt-1">
                Your live GPS coordinates have been securely dispatched to the <strong>Sahkar Cooperative Rapid Response Unit</strong> and Delhi Police Control Room. Support staff is dialing you now.
              </p>
            </div>
          </div>
        ) : (
          <div className="my-5 space-y-3">
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-xs text-neutral-700">
              <p className="font-medium text-neutral-900 mb-1">Live Safety Guarantee:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Immediate 2-way call with Cooperative Safety Officer</li>
                <li>Live GPS tracking beacon broadcasted to Emergency 112</li>
                <li>Incident logged in immutable audit ledger</li>
              </ul>
            </div>

            <button
              onClick={handleBroadcastSOS}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Trigger Immediate Emergency Broadcast</span>
            </button>
          </div>
        )}

        {/* Direct One-Touch Helplines */}
        <div className="pt-2 border-t border-neutral-100 space-y-2">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Direct One-Touch Helplines:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <a 
              href="tel:112"
              className="flex items-center justify-center gap-2 p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>Police / 112</span>
            </a>
            <a 
              href="tel:18001808941"
              className="flex items-center justify-center gap-2 p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0D5C3A]" />
              <span>Co-op Helpline</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

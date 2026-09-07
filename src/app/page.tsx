'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import CustomerHome from '@/components/customer/CustomerHome';
import ProviderDashboard from '@/components/provider/ProviderDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import MinistryDashboard from '@/components/ministry/MinistryDashboard';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function Home() {
  const { user, profile, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-3 text-neutral-600">
        <div className="w-12 h-12 rounded-2xl bg-[#0D5C3A] text-white flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-7 h-7 text-emerald-300 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-neutral-700">
          <Loader2 className="w-4 h-4 animate-spin text-[#0D5C3A]" />
          <span>Authenticating with Sahkar Firebase Auth...</span>
        </div>
      </div>
    );
  }

  // Guard 1: Require Authentication
  if (!user) {
    return <AuthForm />;
  }

  // Guard 2: Role-based Dashboard Access Control
  const role = profile?.role || 'customer';

  switch (role) {
    case 'customer':
      return <CustomerHome />;
    case 'provider':
      return <ProviderDashboard />;
    case 'coop_admin':
      return <AdminDashboard />;
    case 'ministry_admin':
      return <MinistryDashboard />;
    default:
      return <CustomerHome />;
  }
}

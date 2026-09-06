'use client';

import React, { useState, useEffect } from 'react';
import { demoStore } from '@/lib/demo-store';
import { UserRole } from '@/types/cooperative';
import CustomerHome from '@/components/customer/CustomerHome';
import ProviderDashboard from '@/components/provider/ProviderDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import MinistryDashboard from '@/components/ministry/MinistryDashboard';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentRole(demoStore.getState().currentRole);
    const unsubscribe = demoStore.subscribe(() => {
      setCurrentRole(demoStore.getState().currentRole);
    });
    return unsubscribe;
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-neutral-500 text-sm">
        Loading Sahkar Platform Cooperative...
      </div>
    );
  }

  switch (currentRole) {
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

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  Star, 
  Clock, 
  Zap, 
  Droplets, 
  Sparkles, 
  Cpu, 
  Hammer, 
  CheckCircle2, 
  Phone, 
  AlertTriangle,
  ChevronRight,
  Receipt,
  HeartHandshake
} from 'lucide-react';
import { demoStore } from '@/lib/demo-store';
import { subscribeToBookings } from '@/lib/firestore-bookings';
import { ServiceCategory, ServiceItem, ProviderProfile, Booking } from '@/types/cooperative';
import { formatINR, calculateFeeSplit } from '@/lib/fee-calculator';
import { translations } from '@/lib/i18n';
import LeafletMap from '@/components/maps/LeafletMap';
import SOSModal from '@/components/common/SOSModal';

export default function CustomerHome() {
  const [state, setState] = useState(demoStore.getState());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModalService, setBookingModalService] = useState<ServiceItem | null>(null);
  const [bookingAddress, setBookingAddress] = useState('Flat 402, Block C, Mayur Vihar Phase 1, New Delhi 110091');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<Booking | null>(null);

  useEffect(() => {
    const storeUnsubscribe = demoStore.subscribe(() => {
      setState(demoStore.getState());
    });

    const firestoreUnsubscribe = subscribeToBookings(
      (firestoreBookings) => {
        demoStore.setBookingsFromFirestore(firestoreBookings);
      },
      (error) => {
        console.error('[CustomerHome] Firestore onSnapshot error:', error);
      }
    );

    return () => {
      storeUnsubscribe();
      firestoreUnsubscribe();
    };
  }, []);

  const t = translations[state.language] || translations.en;

  // Active in-flight booking (for tracker)
  const activeBooking = state.bookings.find(b => b.status !== 'completed' && b.status !== 'cancelled') || state.bookings[0];

  // Filtered services
  const filteredServices = state.services.filter(s => {
    const matchesCat = selectedCategory === 'all' || 
      (selectedCategory === 'electrical' && s.categoryId === 'cat-1') ||
      (selectedCategory === 'plumbing' && s.categoryId === 'cat-2') ||
      (selectedCategory === 'cleaning' && s.categoryId === 'cat-3') ||
      (selectedCategory === 'appliances' && s.categoryId === 'cat-4') ||
      (selectedCategory === 'carpentry' && s.categoryId === 'cat-5');
    
    const matchesQuery = s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleConfirmBooking = () => {
    if (!bookingModalService) return;
    demoStore.bookService(bookingModalService, bookingAddress);
    setIsBookingSuccess(true);
    setTimeout(() => {
      setIsBookingSuccess(false);
      setBookingModalService(null);
    }, 1800);
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electrical': return <Zap className="w-4 h-4" />;
      case 'plumbing': return <Droplets className="w-4 h-4" />;
      case 'cleaning': return <Sparkles className="w-4 h-4" />;
      case 'appliances': return <Cpu className="w-4 h-4" />;
      case 'carpentry': return <Hammer className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-7 pb-28">
      
      {/* 1. Header Greeting & Location */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0D5C3A]" />
            <span>{t.currentLocation}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            {t.welcomeGreeting}, Priya
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button aria-label="Notifications" className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D97706] rounded-full ring-2 ring-white" />
          </div>
          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
            PS
          </div>
        </div>
      </header>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white border border-neutral-200 rounded-full py-3.5 pl-12 pr-4 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A] shadow-sm transition-all"
        />
      </div>

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-[#0D5C3A] text-white shadow-md shadow-emerald-900/10'
              : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
          }`}
        >
          <span>{t.allCategories}</span>
        </button>

        {state.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.slug
                ? 'bg-[#0D5C3A] text-white shadow-md shadow-emerald-900/10'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {getCategoryIcon(cat.slug)}
            <span>{state.language === 'hi' ? cat.nameHi : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* 4. "The Cooperative Advantage" Hero Card */}
      <div className="bg-gradient-to-r from-[#18181B] via-neutral-900 to-[#0D5C3A] text-white rounded-3xl p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none">
          <HeartHandshake className="w-56 h-56 text-white" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#D97706]/20 border border-[#D97706]/50 text-[#FBBF24] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ministry of Cooperation Initiative</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.coopGuaranteeTitle}: Zero Surge • 95% Retained by Workers
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {t.coopGuaranteeDesc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-neutral-200 font-medium">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Fixed Standard Rates</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Police Verified Members</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>48-Hour SLA Redressal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Active In-Flight Booking Tracker */}
      {activeBooking && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-neutral-200/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[11px] font-bold text-[#0D5C3A] uppercase tracking-wider block">
                {t.bookingStatus} • {activeBooking.bookingReference}
              </span>
              <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                {activeBooking.serviceName}
              </h3>
              <p className="text-xs text-neutral-500">
                Assigned Member: <strong>{activeBooking.providerName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Emergency SOS Button */}
              <button
                onClick={() => setShowSosModal(true)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                <span>{t.sosButton}</span>
              </button>

              {/* View Digital Invoice */}
              <button
                onClick={() => setShowInvoiceModal(activeBooking)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-3 py-2 rounded-2xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-4 h-4" />
                <span>Invoice</span>
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#0D5C3A] font-bold border border-emerald-200">
              ✓ Assigned
            </div>
            <div className={`p-2 rounded-xl font-bold ${
              activeBooking.status === 'en_route' || activeBooking.status === 'arrived' || activeBooking.status === 'in_progress'
                ? 'bg-emerald-50 text-[#0D5C3A] border border-emerald-200' 
                : 'bg-neutral-50 text-neutral-400'
            }`}>
              {activeBooking.status === 'en_route' ? '● En Route' : '✓ En Route'}
            </div>
            <div className={`p-2 rounded-xl font-bold ${
              activeBooking.status === 'arrived' || activeBooking.status === 'in_progress'
                ? 'bg-emerald-50 text-[#0D5C3A] border border-emerald-200' 
                : 'bg-neutral-50 text-neutral-400'
            }`}>
              Arrived
            </div>
            <div className={`p-2 rounded-xl font-bold ${
              activeBooking.status === 'in_progress'
                ? 'bg-emerald-50 text-[#0D5C3A] border border-emerald-200' 
                : 'bg-neutral-50 text-neutral-400'
            }`}>
              In Progress
            </div>
          </div>

          {/* Leaflet Interactive Map */}
          <div className="rounded-2xl overflow-hidden">
            <LeafletMap 
              customerLat={activeBooking.customerLat}
              customerLng={activeBooking.customerLng}
              providerLat={28.6180}
              providerLng={77.2850}
              providerName={activeBooking.providerName}
              status={activeBooking.status}
            />
          </div>

          {/* Security Start OTP Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <div>
                <span className="text-xs font-semibold text-amber-900 block">{t.startOtp}</span>
                <span className="text-[11px] text-amber-700">Share this code with Ramesh upon arrival to begin work</span>
              </div>
            </div>
            <div className="text-2xl font-black text-amber-900 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
              {activeBooking.otpServiceStart}
            </div>
          </div>
        </div>
      )}

      {/* 6. Standardized Transparent Price Services Catalog */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {t.fixedPricingHeading}
            </h2>
            <p className="text-xs text-neutral-500">
              Cooperative audited standard rates — no surge pricing during peak hours
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0D5C3A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {filteredServices.length} Services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const split = calculateFeeSplit(service.basePrice, state.cooperativeFeePercent, state.welfareFundPercent);
            return (
              <div 
                key={service.id}
                className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-base">
                        {state.language === 'hi' ? service.nameHi : service.nameEn}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-extrabold text-neutral-900 block">
                        {formatINR(service.basePrice)}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        /{service.priceUnit}
                      </span>
                    </div>
                  </div>

                  {/* Transparent Fee-Split Mini Strip */}
                  <div className="mt-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl p-2.5 text-[11px] flex items-center justify-between text-neutral-600">
                    <span className="text-[#0D5C3A] font-semibold">
                      Worker receives: {formatINR(split.providerPayoutAmount)} (93%)
                    </span>
                    <span className="text-neutral-400">
                      Co-op + Welfare: {formatINR(split.cooperativeFeeAmount + split.welfareFundAmount)} (7%)
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.estimatedDurationMins} mins</span>
                  </div>

                  <button
                    onClick={() => setBookingModalService(service)}
                    className="bg-[#0D5C3A] hover:bg-[#09442A] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1"
                  >
                    <span>{t.bookNow}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Featured Verified Cooperative Providers */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Verified Cooperative Worker-Members Nearby
          </h2>
          <p className="text-xs text-neutral-500">
            Direct member owners under the Multi-State Cooperative Societies Act
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.providers.map((provider) => (
            <div 
              key={provider.id}
              className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm space-y-3 relative"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-neutral-900 text-white font-bold flex items-center justify-center text-base shadow-sm">
                  {provider.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">
                    {provider.fullName}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {provider.trade}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{provider.ratingAvg}</span>
                    <span className="text-neutral-400 font-normal">({provider.totalRatings} jobs)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {provider.policeVerificationBadge && (
                  <span className="bg-emerald-50 text-[#0D5C3A] border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t.policeVerified}</span>
                  </span>
                )}
                <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                  {provider.trainingInstitute.split('-')[0]}
                </span>
              </div>

              <p className="text-xs text-neutral-600 line-clamp-2 italic">
                "{provider.bio}"
              </p>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">
                  Within {provider.serviceRadiusKm} km radius
                </span>
                <span className={`font-semibold ${provider.isAvailable ? 'text-emerald-700' : 'text-neutral-400'}`}>
                  {provider.isAvailable ? '● Available Now' : '○ Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Booking Confirmation Modal with Transparent Fee Split */}
      {bookingModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 text-neutral-900 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">
              Confirm Cooperative Service Booking
            </h3>
            
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 space-y-1 text-xs">
              <span className="font-bold text-neutral-800">{bookingModalService.nameEn}</span>
              <p className="text-neutral-600">{bookingModalService.description}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Service Address:</label>
              <input 
                type="text"
                value={bookingAddress}
                onChange={(e) => setBookingAddress(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-[#0D5C3A] outline-none"
              />
            </div>

            {/* Transparent Economics Breakdown */}
            {(() => {
              const split = calculateFeeSplit(bookingModalService.basePrice, state.cooperativeFeePercent, state.welfareFundPercent);
              return (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-[#0D5C3A] block text-sm">
                    Audited Transparent Cooperative Split:
                  </span>
                  <div className="flex justify-between text-neutral-700">
                    <span>Base Service Total:</span>
                    <span className="font-bold">{formatINR(split.grossAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>Platform Exploitation / Surge Fee:</span>
                    <span className="font-bold text-emerald-700">₹0 (0%)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Co-op Technology & Admin Fee ({split.cooperativeFeePercent}%):</span>
                    <span>{formatINR(split.cooperativeFeeAmount)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Member Welfare & Insurance Fund ({split.welfareFundPercent}%):</span>
                    <span>{formatINR(split.welfareFundAmount)}</span>
                  </div>
                  <div className="border-t border-emerald-200 pt-2 flex justify-between font-bold text-neutral-900 text-sm">
                    <span className="text-[#0D5C3A]">Direct Member Payout ({split.providerPayoutPercent}%):</span>
                    <span className="text-[#0D5C3A]">{formatINR(split.providerPayoutAmount)}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 pt-1">
                    ★ Under Sahkar Co-op, Ramesh retains <strong>{formatINR(split.workerSurplusRetained)} more</strong> on this single job compared to commercial aggregators.
                  </p>
                </div>
              );
            })()}

            {isBookingSuccess ? (
              <div className="bg-emerald-600 text-white py-3 rounded-2xl text-center font-bold text-sm animate-pulse">
                ✓ Booking Confirmed & Dispatched!
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setBookingModalService(null)}
                  className="w-1/3 py-3 rounded-2xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="w-2/3 py-3 rounded-2xl bg-[#0D5C3A] hover:bg-[#09442A] text-white font-bold text-xs shadow-lg shadow-emerald-900/20"
                >
                  Pay via UPI / Card (Razorpay Sandbox)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. Digital Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-neutral-900 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Digital Tax Invoice</h3>
                <span className="text-xs text-neutral-500">Ref: {showInvoiceModal.bookingReference}</span>
              </div>
              <button 
                onClick={() => setShowInvoiceModal(null)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-neutral-700">
              <div className="flex justify-between">
                <span>Issued by:</span>
                <span className="font-semibold text-right">Sahkar Urban Co-op Ltd.</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{showInvoiceModal.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{showInvoiceModal.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span>Provider:</span>
                <span>{showInvoiceModal.providerName}</span>
              </div>
              <div className="border-t border-dashed border-neutral-300 my-2 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Gross Job Fee:</span>
                  <span>{formatINR(showInvoiceModal.grossAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Co-op Service Maintenance (5%):</span>
                  <span>{formatINR(showInvoiceModal.cooperativeFeeAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Worker Welfare & Medical Pool (2%):</span>
                  <span>{formatINR(showInvoiceModal.welfareFundAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total Amount Paid:</span>
                  <span>{formatINR(showInvoiceModal.grossAmount)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInvoiceModal(null)}
              className="w-full bg-[#18181B] text-white py-2.5 rounded-xl font-semibold text-xs hover:bg-neutral-800"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {/* Emergency SOS Modal */}
      <SOSModal 
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        bookingReference={activeBooking?.bookingReference}
        customerName="Priya Sharma"
      />

    </div>
  );
}

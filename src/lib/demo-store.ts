// Interactive Demo State Store with Real-Time Reactivity
// Enables seamless cross-role testing for SIH 2026 judging

import {
  UserRole,
  LanguageCode,
  ServiceCategory,
  ServiceItem,
  ProviderProfile,
  Booking,
  GovernanceProposal,
  Grievance
} from '@/types/cooperative';
import { calculateFeeSplit } from './fee-calculator';
import { isFirebaseConfigured } from './firebase';
import {
  subscribeToBookings,
  createFirestoreBooking,
  updateFirestoreBookingStatus,
  seedFirestoreInitialBookingsIfEmpty
} from './firestore-bookings';
import {
  subscribeToProviders,
  updateFirestoreProviderKyc,
  seedFirestoreInitialProvidersIfEmpty,
  subscribeToCooperativeSettings,
  updateFirestoreFeeSlab,
  seedFirestoreInitialSettingsIfEmpty,
  subscribeToGrievances,
  updateFirestoreGrievanceStatus,
  createFirestoreGrievance,
  seedFirestoreInitialGrievancesIfEmpty,
  subscribeToProposals,
  voteFirestoreProposal,
  seedFirestoreInitialProposalsIfEmpty,
  subscribeToSosAlerts,
  createFirestoreSosAlert,
  resolveFirestoreSosAlert
} from './firestore-secondary';

export interface AppState {
  currentRole: UserRole;
  language: LanguageCode;
  cooperativeFeePercent: number;
  welfareFundPercent: number;
  categories: ServiceCategory[];
  services: ServiceItem[];
  providers: ProviderProfile[];
  bookings: Booking[];
  proposals: GovernanceProposal[];
  grievances: Grievance[];
  activeSosAlert: {
    bookingId: string;
    customerName: string;
    location: string;
    timestamp: string;
  } | null;
}

export const initialCategories: ServiceCategory[] = [
  {
    id: 'cat-1',
    slug: 'electrical',
    nameEn: 'Electrical Repairs',
    nameHi: 'बिजली मरम्मत',
    description: 'Ceiling fans, wiring, switches, and short-circuit fixes by ITI-certified electricians',
    iconName: 'Zap',
    displayOrder: 1,
    startingPrice: 149,
    providerCount: 42
  },
  {
    id: 'cat-2',
    slug: 'plumbing',
    nameEn: 'Plumbing & Drainage',
    nameHi: 'प्लंबिंग व नलसाजी',
    description: 'Pipe leaks, tap replacement, blockage clearing, and water tank connection',
    iconName: 'Droplets',
    displayOrder: 2,
    startingPrice: 179,
    providerCount: 38
  },
  {
    id: 'cat-3',
    slug: 'cleaning',
    nameEn: 'Deep Home Cleaning',
    nameHi: 'घर की गहरी सफाई',
    description: 'Kitchen, bathroom & sofa sanitization by trained Women SHG collectives',
    iconName: 'Sparkles',
    displayOrder: 3,
    startingPrice: 499,
    providerCount: 56
  },
  {
    id: 'cat-4',
    slug: 'appliances',
    nameEn: 'Appliance Servicing',
    nameHi: 'उपकरण सर्विसिंग',
    description: 'Split AC foam wash, refrigerator gas recharge, washing machine motor repair',
    iconName: 'Cpu',
    displayOrder: 4,
    startingPrice: 399,
    providerCount: 29
  },
  {
    id: 'cat-5',
    slug: 'carpentry',
    nameEn: 'Carpentry & Woodwork',
    nameHi: 'बढ़ईगीरी सेवाएँ',
    description: 'Door lock fitting, hinge fixes, custom shelves, and modular furniture repair',
    iconName: 'Hammer',
    displayOrder: 5,
    startingPrice: 199,
    providerCount: 24
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-101',
    categoryId: 'cat-1',
    slug: 'fan-install',
    nameEn: 'Ceiling Fan Installation & Repair',
    nameHi: 'पंखे की स्थापना व मरम्मत',
    description: 'Complete motor diagnostic, capacitor change, or new fan ceiling anchor mounting.',
    basePrice: 199,
    priceUnit: 'fan',
    estimatedDurationMins: 45
  },
  {
    id: 'srv-102',
    categoryId: 'cat-1',
    slug: 'switchboard-fix',
    nameEn: 'Switchboard Socket & Switch Repair',
    nameHi: 'स्विचबोर्ड व सॉकेट मरम्मत',
    description: 'Safe replacement of burned switches, modular plate fitting, and earthing checks.',
    basePrice: 149,
    priceUnit: 'board',
    estimatedDurationMins: 30
  },
  {
    id: 'srv-201',
    categoryId: 'cat-2',
    slug: 'tap-leakage',
    nameEn: 'Tap & Shower Leakage Fix',
    nameHi: 'नल और शावर रिसाव मरम्मत',
    description: 'Teflon tape seal, spindle replacement, and high-pressure mixer repair.',
    basePrice: 179,
    priceUnit: 'job',
    estimatedDurationMins: 40
  },
  {
    id: 'srv-301',
    categoryId: 'cat-3',
    slug: 'kitchen-deep-clean',
    nameEn: 'Kitchen Degreasing & Sanitization (Pragati SHG)',
    nameHi: 'रसोई गहरी सफाई (प्रगति एसएचजी)',
    description: 'Chimney surface wipe, oil grime removal, tiles degreasing, and stainless steel shine.',
    basePrice: 599,
    priceUnit: 'kitchen',
    estimatedDurationMins: 120
  },
  {
    id: 'srv-401',
    categoryId: 'cat-4',
    slug: 'ac-jet-service',
    nameEn: 'Split AC Jet Pump Servicing',
    nameHi: 'स्प्लिट एसी जेट पंप सर्विसिंग',
    description: 'Indoor coil high-pressure wash, outdoor condenser blowout, and drain pipe unclog.',
    basePrice: 499,
    priceUnit: 'AC',
    estimatedDurationMins: 60
  }
];

export const initialProviders: ProviderProfile[] = [
  {
    id: 'prov-ramesh',
    fullName: 'Ramesh Kumar',
    phone: '+91 98112 23344',
    cooperativeId: 'coop-delhi',
    memberIdNumber: 'COOP-DEL-ELE-0842',
    trade: 'Electrician (ITI Certified)',
    serviceCategories: ['electrical', 'appliances'],
    verificationStatus: 'approved',
    policeVerificationBadge: true,
    idProofType: 'aadhaar',
    idProofNumber: 'XXXX-XXXX-4912',
    trainingInstitute: 'Government ITI Pusa, New Delhi',
    eshramUan: 'UAN-1008-2026-9912',
    pmsymRegistered: true,
    bankAccount: '•••• •••• 3344 (SBI)',
    bankIfsc: 'SBIN0001234',
    upiId: 'ramesh.iti@upi',
    lat: 28.6280,
    lng: 77.2150,
    serviceRadiusKm: 12.0,
    isAvailable: true,
    ratingAvg: 4.94,
    totalRatings: 156,
    totalJobsCompleted: 178,
    totalEarningsGross: 52400,
    totalEarningsNet: 48732, // >93% retained!
    experienceYears: 9,
    bio: 'Punctual, certified master electrician. Member of Sahkar Co-op since pilot launch.'
  },
  {
    id: 'prov-sunita',
    fullName: 'Sunita Devi',
    phone: '+91 98223 34455',
    cooperativeId: 'coop-delhi',
    memberIdNumber: 'COOP-DEL-CLN-1029',
    trade: 'Cleaning Specialist (Pragati Women SHG)',
    serviceCategories: ['cleaning'],
    verificationStatus: 'approved',
    policeVerificationBadge: true,
    idProofType: 'aadhaar',
    idProofNumber: 'XXXX-XXXX-8821',
    trainingInstitute: 'NSDC Skill Council - Urban Cleaning Collective',
    eshramUan: 'UAN-1008-2026-4410',
    pmsymRegistered: true,
    bankAccount: '•••• •••• 4455 (PNB)',
    bankIfsc: 'PUNB0123400',
    upiId: 'sunita.shg@upi',
    lat: 28.6340,
    lng: 77.2200,
    serviceRadiusKm: 8.0,
    isAvailable: true,
    ratingAvg: 4.89,
    totalRatings: 112,
    totalJobsCompleted: 128,
    totalEarningsGross: 38200,
    totalEarningsNet: 35526,
    experienceYears: 6,
    bio: 'Lead coordinator at Pragati SHG. Eco-friendly cleaning products and hospital-grade sanitization.'
  },
  {
    id: 'prov-ashok',
    fullName: 'Ashok Mehra',
    phone: '+91 98334 55667',
    cooperativeId: 'coop-delhi',
    memberIdNumber: 'COOP-DEL-PLM-0314',
    trade: 'Plumber & Pipe Specialist',
    serviceCategories: ['plumbing'],
    verificationStatus: 'pending',
    policeVerificationBadge: false,
    idProofType: 'aadhaar',
    idProofNumber: 'XXXX-XXXX-1943',
    trainingInstitute: 'Delhi State Plumbing Apprentice Board',
    eshramUan: 'UAN-1008-2026-6632',
    pmsymRegistered: false,
    bankAccount: '•••• •••• 5667 (Canara)',
    bankIfsc: 'CNRB0000891',
    upiId: 'ashok.plumber@upi',
    lat: 28.6190,
    lng: 77.2080,
    serviceRadiusKm: 10.0,
    isAvailable: false,
    ratingAvg: 4.75,
    totalRatings: 42,
    totalJobsCompleted: 48,
    totalEarningsGross: 14200,
    totalEarningsNet: 13206,
    experienceYears: 5,
    bio: 'Specialist in bathroom fixtures, water pressure boosters, and concealed line leak detection.'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'book-del-8941',
    bookingReference: 'COOP-2026-DEL-8941',
    cooperativeId: 'coop-delhi',
    customerId: 'cust-priya',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Block C, Mayur Vihar Phase 1, New Delhi 110091',
    customerLat: 28.6080,
    customerLng: 77.2980,
    providerId: 'prov-ramesh',
    providerName: 'Ramesh Kumar (ITI Certified)',
    providerPhone: '+91 98112 23344',
    serviceId: 'srv-101',
    serviceName: 'Ceiling Fan Installation & Repair',
    categorySlug: 'electrical',
    scheduledAt: 'Today, 2:30 PM',
    status: 'en_route',
    grossAmount: 199.00,
    cooperativeFeePercent: 5.0,
    cooperativeFeeAmount: 9.95,
    welfareFundPercent: 2.0,
    welfareFundAmount: 3.98,
    providerPayoutAmount: 185.07,
    otpServiceStart: '4892',
    createdAt: '2026-09-07T12:00:00.000Z',
    currentProviderLat: 28.6180,
    currentProviderLng: 27.2850
  }
];

export const initialProposals: GovernanceProposal[] = [
  {
    id: 'prop-14',
    cooperativeId: 'coop-delhi',
    title: 'Bylaw Proposal #14: Annual Surplus Distribution to Member Health Insurance Pool',
    description: 'Proposal to allocate 1.5% from the cooperative annual reserve to provide zero-deductible monsoon dengue/malaria hospitalization and accidental insurance to all active technicians.',
    category: 'welfare_allocation',
    options: [
      { id: 'opt_1', label: 'Approve 1.5% Welfare Health Insurance Pool (Recommended)', voteCount: 142 },
      { id: 'opt_2', label: 'Distribute as Direct Cash Dividend to Members', voteCount: 38 },
      { id: 'opt_3', label: 'Create Tool Modernization & Equipment Subsidy Grant', voteCount: 19 }
    ],
    totalVotes: 199,
    isActive: true,
    expiresAt: 'In 5 days'
  }
];

export const initialGrievances: Grievance[] = [
  {
    id: 'grv-102',
    ticketReference: 'GRV-2026-081',
    bookingId: 'book-past-1',
    customerName: 'Aakash Verma',
    providerName: 'Sunita Devi (Pragati SHG)',
    category: 'quality',
    description: 'Minor streak marks on upper window pane after deep cleaning session.',
    status: 'investigating',
    resolutionDeadline: '28h remaining (SLA: 48h)',
    createdAt: 'Yesterday, 4:10 PM'
  }
];

// Reactive singleton state manager for client components
let state: AppState = {
  currentRole: 'customer',
  language: 'en',
  cooperativeFeePercent: 5.0,
  welfareFundPercent: 2.0,
  categories: initialCategories,
  services: initialServices,
  providers: initialProviders,
  bookings: initialBookings,
  proposals: initialProposals,
  grievances: initialGrievances,
  activeSosAlert: null
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(listener => listener());
}

let isFirestoreSubscribed = false;
let secondaryUnsubscribers: (() => void)[] = [];
let firestoreSyncStatus: 'connecting' | 'connected' | 'error' = 'connecting';
let firestoreSyncError: string | null = null;

export function initFirestoreSync() {
  if (isFirestoreSubscribed || typeof window === 'undefined') return;
  if (!isFirebaseConfigured()) {
    firestoreSyncStatus = 'error';
    firestoreSyncError = 'Firebase project is not configured in environment';
    return;
  }

  isFirestoreSubscribed = true;
  firestoreSyncStatus = 'connecting';
  firestoreSyncError = null;

  // Seed initial collections if empty in Firestore
  seedFirestoreInitialBookingsIfEmpty(initialBookings).catch(() => {});
  seedFirestoreInitialProvidersIfEmpty(initialProviders).catch(() => {});
  seedFirestoreInitialSettingsIfEmpty(5.0).catch(() => {});
  seedFirestoreInitialGrievancesIfEmpty(initialGrievances).catch(() => {});
  seedFirestoreInitialProposalsIfEmpty(initialProposals).catch(() => {});

  // 1. Bookings listener
  const unsubBookings = subscribeToBookings(
    (firestoreBookings) => {
      firestoreSyncStatus = 'connected';
      firestoreSyncError = null;

      if (Array.isArray(firestoreBookings)) {
        if (firestoreBookings.length === 0) {
          state = { ...state, bookings: initialBookings };
          seedFirestoreInitialBookingsIfEmpty(initialBookings).catch(() => {});
        } else {
          state = { ...state, bookings: firestoreBookings };
        }
        notify();
      }
    },
    (error) => {
      console.error('[demoStore] Real-time Firestore sync error:', error);
      firestoreSyncStatus = 'error';
      firestoreSyncError = error.message || 'Failed to connect to real-time dispatch listener';
      notify();
    }
  );
  secondaryUnsubscribers.push(unsubBookings);

  // 2. Providers listener
  const unsubProviders = subscribeToProviders((firestoreProviders) => {
    if (Array.isArray(firestoreProviders) && firestoreProviders.length > 0) {
      state = { ...state, providers: firestoreProviders };
      notify();
    }
  });
  secondaryUnsubscribers.push(unsubProviders);

  // 3. Settings listener
  const unsubSettings = subscribeToCooperativeSettings((settings) => {
    if (settings && typeof settings.cooperativeFeePercent === 'number') {
      state = { ...state, cooperativeFeePercent: settings.cooperativeFeePercent };
      notify();
    }
  });
  secondaryUnsubscribers.push(unsubSettings);

  // 4. Grievances listener
  const unsubGrievances = subscribeToGrievances((firestoreGrievances) => {
    if (Array.isArray(firestoreGrievances) && firestoreGrievances.length > 0) {
      state = { ...state, grievances: firestoreGrievances };
      notify();
    }
  });
  secondaryUnsubscribers.push(unsubGrievances);

  // 5. Proposals listener
  const unsubProposals = subscribeToProposals((firestoreProposals) => {
    if (Array.isArray(firestoreProposals) && firestoreProposals.length > 0) {
      state = { ...state, proposals: firestoreProposals };
      notify();
    }
  });
  secondaryUnsubscribers.push(unsubProposals);

  // 6. SOS Alerts listener
  const unsubSos = subscribeToSosAlerts((sosAlert) => {
    state = { ...state, activeSosAlert: sosAlert };
    notify();
  });
  secondaryUnsubscribers.push(unsubSos);
}

// Auto-initialize real-time listener in browser
if (typeof window !== 'undefined') {
  initFirestoreSync();
}

export const demoStore = {
  getState: () => state,

  isFirebaseLive: () => isFirebaseConfigured(),

  getSyncStatus: () => ({
    status: firestoreSyncStatus,
    error: firestoreSyncError
  }),

  unsubscribeFirestore: () => {
    secondaryUnsubscribers.forEach(unsub => unsub());
    secondaryUnsubscribers = [];
    isFirestoreSubscribed = false;
  },

  setBookingsFromFirestore: (newBookings: Booking[]) => {
    if (Array.isArray(newBookings) && newBookings.length > 0) {
      state = {
        ...state,
        bookings: newBookings
      };
    } else if (Array.isArray(newBookings) && newBookings.length === 0 && state.bookings.length === 0) {
      state = {
        ...state,
        bookings: initialBookings
      };
    }
    notify();
  },

  subscribe: (listener: () => void) => {
    // Ensure Firestore real-time sync is active
    if (!isFirestoreSubscribed && typeof window !== 'undefined') {
      initFirestoreSync();
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setRole: (role: UserRole) => {
    state = { ...state, currentRole: role };
    notify();
  },

  setLanguage: (lang: LanguageCode) => {
    state = { ...state, language: lang };
    notify();
  },

  toggleProviderAvailability: (providerId: string = 'prov-ramesh') => {
    state = {
      ...state,
      providers: state.providers.map(p =>
        p.id === providerId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    };
    notify();
  },

  bookService: (
    service: ServiceItem,
    address: string,
    instructions?: string,
    customerProfile?: { customerId?: string; customerName?: string; customerPhone?: string }
  ) => {
    const split = calculateFeeSplit(service.basePrice, state.cooperativeFeePercent, state.welfareFundPercent);
    const matchedProvider = state.providers.find(p => p.isAvailable && p.verificationStatus === 'approved') || state.providers[0];

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingReference: `COOP-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      cooperativeId: 'coop-delhi',
      customerId: customerProfile?.customerId || 'cust-priya',
      customerName: customerProfile?.customerName || 'Priya Sharma',
      customerPhone: customerProfile?.customerPhone || '+91 98765 43210',
      customerAddress: address || 'Flat 402, Block C, Mayur Vihar, New Delhi',
      customerLat: 28.6080,
      customerLng: 77.2980,
      providerId: matchedProvider.id,
      providerName: matchedProvider.fullName,
      providerPhone: matchedProvider.phone,
      serviceId: service.id,
      serviceName: service.nameEn,
      categorySlug: service.slug || 'electrical',
      scheduledAt: 'Today, Within 45 mins',
      status: 'assigned',
      grossAmount: split.grossAmount,
      cooperativeFeePercent: split.cooperativeFeePercent,
      cooperativeFeeAmount: split.cooperativeFeeAmount,
      welfareFundPercent: split.welfareFundPercent,
      welfareFundAmount: split.welfareFundAmount,
      providerPayoutAmount: split.providerPayoutAmount,
      otpServiceStart: String(Math.floor(1000 + Math.random() * 9000)),
      specialInstructions: instructions || '',
      createdAt: new Date().toISOString()
    };

    // Optimistic local state update for instant UI feedback
    state = {
      ...state,
      bookings: [newBooking, ...state.bookings.filter(b => b.id !== newBooking.id)]
    };
    notify();

    // Persist to Firestore (will broadcast to other browser sessions via onSnapshot)
    createFirestoreBooking(newBooking).catch((err) => {
      console.error('[demoStore] Error saving booking to Firestore:', err);
    });

    return newBooking;
  },

  updateBookingStatus: (bookingId: string, newStatus: Booking['status']) => {
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : undefined;

    // Optimistic local state update
    state = {
      ...state,
      bookings: state.bookings.map(b =>
        b.id === bookingId ? {
          ...b,
          status: newStatus,
          completedAt: completedAt || b.completedAt
        } : b
      )
    };
    notify();

    // Persist status update to Firestore (will broadcast to other browser sessions via onSnapshot)
    updateFirestoreBookingStatus(bookingId, newStatus, completedAt ? { completedAt } : {}).catch((err) => {
      console.error(`[demoStore] Error updating booking ${bookingId} in Firestore:`, err);
    });
  },

  castVote: (proposalId: string, optionId: string) => {
    let updatedProp: GovernanceProposal | null = null;
    state = {
      ...state,
      proposals: state.proposals.map(p => {
        if (p.id !== proposalId) return p;
        if (p.userVotedOptionId) return p;
        const updatedOptions = p.options.map(opt =>
          opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
        );
        updatedProp = {
          ...p,
          options: updatedOptions,
          totalVotes: p.totalVotes + 1,
          userVotedOptionId: optionId
        };
        return updatedProp;
      })
    };
    notify();

    if (updatedProp) {
      voteFirestoreProposal(proposalId, updatedProp).catch((err) => {
        console.error('[demoStore] Error persisting vote:', err);
      });
    }
  },

  approveProviderKyc: (providerId: string, givePoliceBadge: boolean = true) => {
    state = {
      ...state,
      providers: state.providers.map(p =>
        p.id === providerId ? {
          ...p,
          verificationStatus: 'approved',
          policeVerificationBadge: givePoliceBadge
        } : p
      )
    };
    notify();

    updateFirestoreProviderKyc(providerId, 'approved', givePoliceBadge).catch((err) => {
      console.error('[demoStore] Error persisting provider KYC:', err);
    });
  },

  rejectProviderKyc: (providerId: string) => {
    state = {
      ...state,
      providers: state.providers.map(p =>
        p.id === providerId ? {
          ...p,
          verificationStatus: 'rejected',
          policeVerificationBadge: false
        } : p
      )
    };
    notify();

    updateFirestoreProviderKyc(providerId, 'rejected', false).catch((err) => {
      console.error('[demoStore] Error persisting provider KYC rejection:', err);
    });
  },

  updateFeeSlab: (newPercent: number) => {
    state = {
      ...state,
      cooperativeFeePercent: newPercent
    };
    notify();

    updateFirestoreFeeSlab(newPercent).catch((err) => {
      console.error('[demoStore] Error persisting fee slab:', err);
    });
  },

  createGrievance: (
    category: Grievance['category'],
    description: string,
    bookingId?: string,
    customerName?: string,
    providerName?: string
  ) => {
    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      ticketReference: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: bookingId || 'book-general',
      customerName: customerName || 'Priya Sharma',
      providerName: providerName || 'Assigned Technician',
      category,
      description,
      status: 'investigating',
      resolutionDeadline: '48h remaining (SLA: 48h)',
      createdAt: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    state = {
      ...state,
      grievances: [newGrievance, ...state.grievances]
    };
    notify();

    createFirestoreGrievance(newGrievance).catch((err) => {
      console.error('[demoStore] Error creating grievance in Firestore:', err);
    });

    return newGrievance;
  },

  resolveGrievance: (grievanceId: string, resolutionNotes?: string) => {
    const notes = resolutionNotes || 'Escrow released upon mutual customer satisfaction.';
    state = {
      ...state,
      grievances: state.grievances.map(g =>
        g.id === grievanceId ? { ...g, status: 'resolved', resolutionNotes: notes } : g
      )
    };
    notify();

    updateFirestoreGrievanceStatus(grievanceId, 'resolved', notes).catch((err) => {
      console.error('[demoStore] Error persisting grievance status:', err);
    });
  },

  triggerEmergencySos: (bookingId: string) => {
    const booking = state.bookings.find(b => b.id === bookingId);
    const alertRecord = {
      bookingId,
      customerName: booking?.customerName || 'Priya Sharma',
      location: booking?.customerAddress || 'Indiranagar / Mayur Vihar',
      timestamp: new Date().toLocaleTimeString('en-IN')
    };
    state = {
      ...state,
      activeSosAlert: alertRecord
    };
    notify();

    createFirestoreSosAlert(alertRecord).catch((err) => {
      console.error('[demoStore] Error creating SOS alert in Firestore:', err);
    });
  },

  dismissSosAlert: () => {
    const alertId = state.activeSosAlert?.bookingId;
    state = { ...state, activeSosAlert: null };
    notify();

    resolveFirestoreSosAlert(alertId).catch((err) => {
      console.error('[demoStore] Error resolving SOS alert in Firestore:', err);
    });
  }
};

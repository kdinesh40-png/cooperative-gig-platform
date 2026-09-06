// Cooperative Gig Services Platform - Core Types
// Aligned with SIH26089 & Ministry of Cooperation

export type UserRole = 'customer' | 'provider' | 'coop_admin' | 'ministry_admin';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type BookingStatus = 
  | 'requested' 
  | 'assigned' 
  | 'en_route' 
  | 'arrived' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 
  | 'escrow_held' 
  | 'disbursed_to_provider' 
  | 'refunded' 
  | 'disputed';

export type GrievanceStatus = 'open' | 'investigating' | 'resolved' | 'escalated';

export type GrievanceCategory = 'pricing' | 'quality' | 'safety' | 'conduct' | 'delay';

export type LanguageCode = 'en' | 'hi' | 'mr';

export interface CooperativeSociety {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  district: string;
  headquartersAddress: string;
  cooperativeFeePercent: number; // e.g. 5.00%
  welfareFundPercent: number;    // e.g. 2.00%
  helplinePhone: string;
  isActive: boolean;
}

export interface User {
  id: string;
  cooperativeId: string;
  phone: string;
  fullName: string;
  email?: string;
  role: UserRole;
  preferredLanguage: LanguageCode;
  avatarUrl?: string;
  isPhoneVerified: boolean;
}

export interface ProviderProfile {
  id: string; // matches user id
  fullName: string;
  phone: string;
  cooperativeId: string;
  memberIdNumber: string;
  trade: string;
  serviceCategories: string[];
  verificationStatus: VerificationStatus;
  policeVerificationBadge: boolean;
  idProofType: 'aadhaar' | 'voter_id';
  idProofNumber: string;
  idProofUrl?: string;
  skillCertificateUrl?: string;
  trainingInstitute: string;
  eshramUan?: string;
  pmsymRegistered: boolean;
  bankAccount: string;
  bankIfsc: string;
  upiId: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number;
  isAvailable: boolean;
  ratingAvg: number;
  totalRatings: number;
  totalJobsCompleted: number;
  totalEarningsGross: number;
  totalEarningsNet: number;
  experienceYears: number;
  bio: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string;
  description: string;
  iconName: string;
  displayOrder: number;
  startingPrice: number;
  providerCount: number;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  slug: string;
  nameEn: string;
  nameHi: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  estimatedDurationMins: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  cooperativeId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLat: number;
  customerLng: number;
  providerId?: string;
  providerName?: string;
  providerPhone?: string;
  serviceId: string;
  serviceName: string;
  categorySlug: string;
  scheduledAt: string;
  status: BookingStatus;
  grossAmount: number;
  cooperativeFeePercent: number;
  cooperativeFeeAmount: number;
  welfareFundPercent: number;
  welfareFundAmount: number;
  providerPayoutAmount: number;
  otpServiceStart: string;
  otpVerifiedAt?: string;
  specialInstructions?: string;
  createdAt: string;
  completedAt?: string;
  currentProviderLat?: number;
  currentProviderLng?: number;
}

export interface Grievance {
  id: string;
  ticketReference: string;
  bookingId: string;
  customerName: string;
  providerName: string;
  category: GrievanceCategory;
  description: string;
  status: GrievanceStatus;
  resolutionDeadline: string; // ISO date
  resolutionNotes?: string;
  createdAt: string;
}

export interface GovernanceProposal {
  id: string;
  cooperativeId: string;
  title: string;
  description: string;
  category: 'fee_slab' | 'bylaw_amendment' | 'welfare_allocation';
  options: {
    id: string;
    label: string;
    voteCount: number;
  }[];
  totalVotes: number;
  isActive: boolean;
  expiresAt: string;
  userVotedOptionId?: string;
}

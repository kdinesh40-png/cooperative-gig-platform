-- ============================================================================
-- COOPERATIVE GIG SERVICES PLATFORM (SIH 2026 - Problem Statement: SIH26089)
-- Database: PostgreSQL 15+ with PostGIS Extension
-- Aligned with: Ministry of Cooperation ("Sahkar Se Samriddhi")
-- Multi-Tenant Platform Cooperative Data Model
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Enumerated Types
CREATE TYPE user_role AS ENUM (
    'customer',
    'provider',
    'coop_admin',
    'ministry_admin'
);

CREATE TYPE verification_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'suspended'
);

CREATE TYPE booking_status AS ENUM (
    'requested',
    'assigned',
    'en_route',
    'arrived',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TYPE payment_status AS ENUM (
    'escrow_held',
    'disbursed_to_provider',
    'refunded',
    'disputed'
);

CREATE TYPE grievance_category AS ENUM (
    'pricing',
    'quality',
    'safety',
    'conduct',
    'delay'
);

CREATE TYPE grievance_status AS ENUM (
    'open',
    'investigating',
    'resolved',
    'escalated'
);

CREATE TYPE proposal_category AS ENUM (
    'fee_slab',
    'bylaw_amendment',
    'welfare_allocation'
);

-- ============================================================================
-- 3. Core Tables
-- ============================================================================

-- 3.1 Cooperative Societies (Multi-Tenant Entities)
CREATE TABLE IF NOT EXISTS cooperative_societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    headquarters_address TEXT NOT NULL,
    cooperative_fee_percent NUMERIC(4,2) NOT NULL DEFAULT 5.00 CHECK (cooperative_fee_percent >= 0 AND cooperative_fee_percent <= 15),
    welfare_fund_percent NUMERIC(4,2) NOT NULL DEFAULT 2.00 CHECK (welfare_fund_percent >= 0 AND welfare_fund_percent <= 5),
    helpline_phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID REFERENCES cooperative_societies(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    role user_role NOT NULL DEFAULT 'customer',
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en', -- 'en', 'hi', 'mr', etc.
    avatar_url TEXT,
    is_phone_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Provider Profiles (Worker-Member Profiles)
CREATE TABLE IF NOT EXISTS provider_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    cooperative_id UUID NOT NULL REFERENCES cooperative_societies(id) ON DELETE RESTRICT,
    member_id_number VARCHAR(50) UNIQUE,
    service_categories TEXT[] NOT NULL DEFAULT '{}',
    verification_status verification_status NOT NULL DEFAULT 'pending',
    police_verification_badge BOOLEAN NOT NULL DEFAULT false,
    id_proof_type VARCHAR(50), -- 'aadhaar', 'voter_id'
    id_proof_number VARCHAR(50),
    id_proof_document_url TEXT,
    skill_certificate_url TEXT,
    training_institute_name VARCHAR(200),
    eshram_uan VARCHAR(30), -- National Social Security linkage
    pmsym_registered BOOLEAN NOT NULL DEFAULT false,
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(50),
    current_location GEOGRAPHY(POINT, 4326),
    last_location_updated_at TIMESTAMPTZ,
    service_radius_km NUMERIC(4,1) NOT NULL DEFAULT 10.0,
    is_available BOOLEAN NOT NULL DEFAULT false,
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (rating_avg >= 1.0 AND rating_avg <= 5.0),
    total_ratings INT NOT NULL DEFAULT 0,
    total_jobs_completed INT NOT NULL DEFAULT 0,
    total_earnings_gross NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_earnings_net NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for PostGIS spatial searches (nearest available provider)
CREATE INDEX IF NOT EXISTS idx_provider_profiles_location 
ON provider_profiles USING GIST (current_location);

-- 3.4 Service Categories & Services (Transparent Upfront Pricing - NO Surge)
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'wrench',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    cooperative_id UUID REFERENCES cooperative_societies(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    name_hi VARCHAR(150) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL, -- Transparent standard rate
    price_unit VARCHAR(50) NOT NULL DEFAULT 'job', -- 'job', 'hour', 'item'
    estimated_duration_mins INT NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Bookings & Transparent Cooperative Economics
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    cooperative_id UUID NOT NULL REFERENCES cooperative_societies(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    provider_id UUID REFERENCES provider_profiles(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    customer_address TEXT NOT NULL,
    customer_location GEOGRAPHY(POINT, 4326) NOT NULL,
    status booking_status NOT NULL DEFAULT 'requested',
    gross_amount NUMERIC(10,2) NOT NULL,
    cooperative_fee_percent NUMERIC(4,2) NOT NULL DEFAULT 5.00,
    cooperative_fee_amount NUMERIC(10,2) NOT NULL,
    welfare_fund_percent NUMERIC(4,2) NOT NULL DEFAULT 2.00,
    welfare_fund_amount NUMERIC(10,2) NOT NULL,
    provider_payout_amount NUMERIC(10,2) NOT NULL,
    otp_service_start VARCHAR(6) NOT NULL,
    otp_verified_at TIMESTAMPTZ,
    special_instructions TEXT,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 3.6 Payment Transactions & Escrow Ledger
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    cooperative_id UUID NOT NULL REFERENCES cooperative_societies(id) ON DELETE RESTRICT,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_method VARCHAR(50) DEFAULT 'upi',
    status payment_status NOT NULL DEFAULT 'escrow_held',
    disbursed_at TIMESTAMPTZ,
    provider_settlement_reference VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 Reviews & Safety Grievances
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_reference VARCHAR(30) NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    cooperative_id UUID NOT NULL REFERENCES cooperative_societies(id) ON DELETE RESTRICT,
    raised_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category grievance_category NOT NULL,
    description TEXT NOT NULL,
    status grievance_status NOT NULL DEFAULT 'open',
    resolution_deadline TIMESTAMPTZ NOT NULL, -- 48-hour SLA
    resolution_notes TEXT,
    resolved_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Member Voice: Democratic Governance & Voting
CREATE TABLE IF NOT EXISTS governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID NOT NULL REFERENCES cooperative_societies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category proposal_category NOT NULL,
    proposed_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    options JSONB NOT NULL, -- e.g. [{"id": "opt1", "label": "Maintain 5% Fee"}, {"id": "opt2", "label": "Increase to 6% for Tool Subsidy"}]
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
    selected_option_id VARCHAR(50) NOT NULL,
    voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_member_vote UNIQUE(proposal_id, provider_id) -- 1 Member = 1 Vote
);

-- 3.9 Emergency SOS Logs (Trust & Safety)
CREATE TABLE IF NOT EXISTS emergency_sos_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    triggered_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_location GEOGRAPHY(POINT, 4326),
    helpline_dialed VARCHAR(20) NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolution_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- COOPERATIVE GIG SERVICES PLATFORM (SIH 2026 - PS: SIH26089)
-- Seed Data: Pilot Cooperative Society ("Sahkar Urban Services Co-op")
-- Aligned with: Ministry of Cooperation, "Sahkar Se Samriddhi"
-- ============================================================================

-- 1. Pilot Cooperative Society
INSERT INTO cooperative_societies (
    id, name, registration_number, state, district, headquarters_address, 
    cooperative_fee_percent, welfare_fund_percent, helpline_phone
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Sahkar Urban Services Multi-State Cooperative Society Ltd.',
    'MSCS/CR/2026/8941',
    'Delhi',
    'New Delhi',
    'Krishi Bhawan Complex, Dr. Rajendra Prasad Road, New Delhi 110001',
    5.00,
    2.00,
    '1800-180-8941'
) ON CONFLICT (id) DO NOTHING;

-- 2. Service Categories
INSERT INTO service_categories (id, slug, name_en, name_hi, description, icon_name, display_order) VALUES
('b0000000-0000-0000-0000-000000000001', 'electrical', 'Electrical Services', 'बिजली सेवाएँ', 'Certified electricians for installations, wiring, and repairs', 'zap', 1),
('b0000000-0000-0000-0000-000000000002', 'plumbing', 'Plumbing Services', 'नलसाजी (प्लंबिंग)', 'Leak repairs, pipe installations, tap fixes, and drainage', 'droplets', 2),
('b0000000-0000-0000-0000-000000000003', 'cleaning', 'Home Deep Cleaning', 'घर की सफाई', 'Women SHG-run professional cleaning & sanitization', 'sparkles', 3),
('b0000000-0000-0000-0000-000000000004', 'appliances', 'Appliance Repair', 'उपकरण मरम्मत', 'AC, refrigerator, washing machine, and microwave repair', 'cpu', 4),
('b0000000-0000-0000-0000-000000000005', 'carpentry', 'Carpentry & Woodwork', 'बढ़ईगीरी (कारपेंट्री)', 'Furniture repair, door locks, hinges, and custom woodwork', 'hammer', 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Standard Fixed Services (No Surge Pricing)
INSERT INTO services (id, category_id, cooperative_id, slug, name_en, name_hi, description, base_price, price_unit, estimated_duration_mins) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'fan-repair', 'Ceiling Fan Installation & Repair', 'पंखे की स्थापना और मरम्मत', 'Complete motor servicing, blade balancing, or new fan installation', 199.00, 'item', 45),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'switchboard-fix', 'Switchboard Repair & Socket Upgrade', 'स्विचबोर्ड मरम्मत और सॉकेट बदलाव', 'Fixing loose wiring, damaged switches, and MCB trips', 149.00, 'item', 30),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'tap-leakage', 'Tap & Pipe Leakage Repair', 'नल और पाइप रिसाव मरम्मत', 'Washer replacement, cartridge fix, and high-pressure leak sealing', 179.00, 'job', 40),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'kitchen-deep-clean', 'Kitchen Deep Cleaning (SHG Collective)', 'रसोई की गहरी सफाई (एसएचजी समूह)', 'Degreasing tiles, chimney exterior, slab, and cabinets by trained SHG members', 599.00, 'job', 120),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'ac-service', 'Split AC Jet Foam Servicing', 'स्प्लिट एसी सर्विसिंग', 'Indoor coil deep foaming, blower wash, and filter sanitization', 499.00, 'item', 60)
ON CONFLICT (id) DO NOTHING;

-- 4. Key Users Across All 4 Roles
INSERT INTO users (id, cooperative_id, phone, full_name, email, role, preferred_language) VALUES
-- 4.1 Customer
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '+919876543210', 'Priya Sharma', 'priya.sharma@example.in', 'customer', 'en'),
-- 4.2 Verified Electrician Provider (Ramesh)
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '+919811223344', 'Ramesh Kumar (ITI Certified)', 'ramesh.kumar@worker.coop', 'provider', 'hi'),
-- 4.3 SHG Cleaning Specialist Provider (Sunita)
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', '+919822334455', 'Sunita Devi (Pragati SHG)', 'sunita.devi@worker.coop', 'provider', 'hi'),
-- 4.4 Cooperative Admin
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', '+919833445566', 'V. K. Sharma (Co-op Registrar)', 'admin@sahkar.gov.in', 'coop_admin', 'en'),
-- 4.5 Ministry / NCDC Oversight
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', '+919844556677', 'Dr. Anand Verma (Ministry Observer)', 'oversight@cooperation.gov.in', 'ministry_admin', 'en')
ON CONFLICT (id) DO NOTHING;

-- 5. Provider Profiles
INSERT INTO provider_profiles (
    id, cooperative_id, member_id_number, service_categories, verification_status,
    police_verification_badge, id_proof_type, id_proof_number, training_institute_name,
    eshram_uan, pmsym_registered, bank_account_number, bank_ifsc, upi_id,
    current_location, service_radius_km, is_available, rating_avg, total_ratings,
    total_jobs_completed, total_earnings_gross, total_earnings_net
) VALUES
(
    'd0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'COOP-DEL-ELE-0842',
    ARRAY['electrical', 'appliances'],
    'approved',
    true,
    'aadhaar',
    'XXXX-XXXX-4912',
    'Industrial Training Institute (ITI) Pusa, Delhi',
    'UAN-1008-2026-9912',
    true,
    '919811223344',
    'SBIN0001234',
    'ramesh.iti@upi',
    ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), -- Central Delhi
    12.0,
    true,
    4.92,
    148,
    164,
    48600.00,
    45200.00 -- >93% retained!
),
(
    'd0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'COOP-DEL-CLN-1029',
    ARRAY['cleaning'],
    'approved',
    true,
    'aadhaar',
    'XXXX-XXXX-8821',
    'National Skill Development Corp (NSDC) - Pragati Mahila SHG',
    'UAN-1008-2026-4410',
    true,
    '919822334455',
    'PUNB0123400',
    'sunita.shg@upi',
    ST_SetSRID(ST_MakePoint(77.2150, 28.6250), 4326),
    8.0,
    true,
    4.88,
    94,
    108,
    32400.00,
    30132.00
)
ON CONFLICT (id) DO NOTHING;

-- 6. Member Voice: Active Democratic Governance Proposal
INSERT INTO governance_proposals (
    id, cooperative_id, title, description, category, options, is_active, expires_at
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Bylaw Ballot #14: Annual Surplus Distribution to Member Health Insurance Pool',
    'Proposal to allocate 1.5% from the cooperative operational reserve to subsidize zero-deductible monsoon accident and dengue/malaria medical insurance for all active member-workers.',
    'welfare_allocation',
    '[
        {"id": "opt_approve", "label": "Yes — Approve 1.5% health insurance subsidy (Recommended)"},
        {"id": "opt_cashback", "label": "No — Distribute as direct annual cash dividend instead"},
        {"id": "opt_tools", "label": "Alternative — Use fund for tool kit upgrade grants"}
    ]'::jsonb,
    true,
    NOW() + INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- 7. Realistic Demonstration Booking (Active In-Flight for Live Tracking Demo)
INSERT INTO bookings (
    id, booking_reference, cooperative_id, customer_id, provider_id, service_id,
    scheduled_at, customer_address, customer_location, status, gross_amount,
    cooperative_fee_percent, cooperative_fee_amount, welfare_fund_percent,
    welfare_fund_amount, provider_payout_amount, otp_service_start
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'COOP-2026-DEL-8941',
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001', -- Priya Sharma
    'd0000000-0000-0000-0000-000000000002', -- Ramesh Kumar
    'c0000000-0000-0000-0000-000000000001', -- Ceiling Fan Repair
    NOW() + INTERVAL '30 minutes',
    'Flat 402, Block C, Mayur Vihar Phase 1, New Delhi 110091',
    ST_SetSRID(ST_MakePoint(77.2980, 28.6080), 4326),
    'en_route',
    199.00,
    5.00,
    9.95,  -- 5% Co-op Fee
    2.00,
    3.98,  -- 2% Welfare Fund
    185.07, -- 93% Net Direct to Ramesh
    '4892'
) ON CONFLICT (id) DO NOTHING;

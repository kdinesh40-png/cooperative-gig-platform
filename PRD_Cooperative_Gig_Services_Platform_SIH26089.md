# Product Requirements Document (PRD)

## Cooperative Gig Services Platform for Household & Community Services
**Smart India Hackathon 2026 | Problem Statement ID: 26089**
**Category:** Software | **Theme:** Smart Automation
**Organization:** Ministry of Cooperation (aligned with the "Sahkar Se Samriddhi" mission)

---

## 1. Document Control

| Field | Detail |
|---|---|
| Document Owner | [Team Name] |
| Version | 1.0 |
| Status | Draft — for SIH Internal/Grand Finale submission |
| Last Updated | [Date] |
| Reviewers | [Team Lead / Mentor] |

---

## 2. Context & Background

The Ministry of Cooperation has been extending the cooperative model into technology-driven service sectors under its **"Sahkar Se Samriddhi" (Prosperity through Cooperation)** vision. Its flagship initiative, **Sahakar Taxi (Bharat Taxi)** — a driver-owned, zero-commission, cooperative alternative to Ola/Uber — demonstrated that a platform cooperative can compete with venture-backed gig platforms while returning surplus value directly to worker-members instead of extracting commission.

PS 26089 asks teams to replicate this model for a much larger and more fragmented segment of India's gig economy: **household and community services** — plumbing, electrical work, appliance repair, domestic help/cleaning, carpentry, painting, pest control, tutoring, elder/child care, and similar hyper-local services currently dominated by platforms such as Urban Company, or by informal, unorganized local providers.

### 2.1 The Core Problem
- **Workers (electricians, plumbers, domestic help, etc.)** lose 20–30% of earnings to commissions on aggregator platforms, or operate entirely informally with no discoverability, no ratings-based trust, no insurance, and no collective bargaining power.
- **Households/consumers** face inconsistent quality, safety concerns (unverified providers), price opacity, and no recourse for disputes when using informal channels.
- **Existing gig platforms** are investor-owned; profits are extracted rather than redistributed to the workers who create the value, and workers have no voice in platform governance, pricing, or policy changes.
- **Cooperative societies** (women's SHGs, labour cooperatives, ITI/skilling graduates, urban local body-registered service providers) currently lack a shared digital storefront and booking infrastructure comparable to what venture-funded platforms offer.

### 2.2 Why a Cooperative Model
A **platform cooperative** is jointly owned and democratically governed by the worker-members who use it. Applied here, it should:
- Return a larger share of the service fee to the worker (near zero-commission or a small member-fee model, mirroring Sahakar Taxi).
- Give worker-members a governance voice (e.g., through the cooperative's General Body / elected board) over pricing, working conditions, and platform features.
- Provide organized-sector protections informally denied to gig workers: verified identity, skill certification, grievance redressal, and pathways to insurance/social security schemes (e.g., PM-SYM, e-Shram linkage).
- Be replicable and scalable across states via the Multi-State Cooperative Societies Act, 2002 framework, following the Sahakar Taxi precedent.

---

## 3. Vision & Objectives

**Vision:** Build India's first cooperative-owned digital marketplace for household and community services — a trusted, worker-owned alternative to commission-heavy gig platforms.

**Primary Objectives:**
1. Enable households to discover, book, and pay for verified local service providers through a simple, trustworthy app/web platform.
2. Ensure the majority of the service fee is retained by the worker-member (near zero-commission, cooperative-fee model).
3. Give service-provider members a stake in governance, transparent earnings, and access to skilling, insurance, and grievance redressal.
4. Provide cooperative administrators and the Ministry with tools to onboard, verify, and manage member-providers at scale across regions.
5. Build a scalable, replicable digital backbone that any Primary/State-level Cooperative Society can adopt (similar in spirit to PACS computerization and Sahakar Taxi).

---

## 4. Target Users & Personas

| Persona | Description | Key Needs |
|---|---|---|
| **Household Customer (Priya, 34, urban resident)** | Books a plumber/electrician/maid via app | Fast discovery, verified providers, transparent pricing, safety, easy rescheduling, digital payment |
| **Service-Provider Member (Ramesh, 41, electrician)** | Cooperative member offering services via the platform | Steady bookings, near-zero commission, transparent payouts, skill upgrade path, dispute support, insurance access |
| **Women SHG / Domestic Worker Member (Sunita, 29)** | Offers home-cleaning/cooking services | Safety verification for both sides, flexible scheduling, fair wage floor, community support |
| **Cooperative Society Admin** | Manages onboarding, verification, dispute resolution for a district/state cooperative | Bulk onboarding tools, KYC/background-check workflow, dashboards, grievance queue |
| **Ministry/NCDC Oversight User** | Monitors platform-wide metrics across cooperatives/states | State-wise dashboards, compliance reports, growth & payout-equity metrics |
| **Support/Grievance Agent** | Handles disputes, refunds, safety complaints | Case management tools, SLA tracking, escalation workflow |

---

## 5. Scope

### 5.1 In Scope (MVP for Hackathon Prototype)
- Customer-facing web/mobile app: search, browse categories, book a service, track provider, rate & review, pay digitally.
- Provider-facing app/portal: profile & skill registration, availability toggle, accept/reject bookings, view earnings ledger, request payout.
- Cooperative Admin Portal: member (provider) onboarding & KYC/verification workflow, service catalog & pricing management, dispute/grievance dashboard, basic analytics.
- Core booking engine: category → sub-service → slot → provider matching (rule-based/nearest-available for MVP; ML-based matching as a stretch goal).
- Trust & safety layer: government ID + address verification, police-verification status flag, ratings/reviews, SOS/emergency contact button during active bookings.
- Cooperative-economics engine: transparent fee split (e.g., 90–95% to provider, 5–10% cooperative service fee for platform upkeep — configurable, no investor profit extraction), digital wallet/payout ledger.
- Multilingual support (Hindi + regional language + English) for both apps, given the informal-sector worker base.
- Basic notifications (SMS/push) for booking confirmation, provider arrival, payment receipt.

### 5.2 Out of Scope (for MVP; Future Roadmap)
- Full integration with e-Shram / PM-SYM / national insurance databases (design the API hooks, but live integration deferred).
- Advanced ML-based dynamic pricing or demand forecasting (state a rule-based v1; propose ML roadmap).
- Full multi-state cooperative federation governance/voting module (design data model; UI can be a lightweight "member voice" board for MVP).
- Native iOS/Android apps (a responsive PWA is sufficient for hackathon demo; mention app-store roadmap).

---

## 6. Functional Requirements

### 6.1 Customer App
| ID | Requirement |
|---|---|
| FR-C1 | User can register/login via mobile OTP. |
| FR-C2 | User can browse service categories (Electrical, Plumbing, Cleaning, Appliance Repair, Carpentry, Painting, Pest Control, Home Tutoring, Elder/Child Care, etc.). |
| FR-C3 | User can view transparent, upfront pricing per service (no surge pricing, mirroring the Sahakar Taxi "no surge fee" principle). |
| FR-C4 | User can book a slot; system auto-assigns or lets user pick a rated, available, verified provider nearby. |
| FR-C5 | User can track provider (live status: assigned → en route → arrived → in progress → completed). |
| FR-C6 | User can pay via UPI/card/wallet; view digital invoice. |
| FR-C7 | User can rate & review the provider and raise a complaint/dispute if needed. |
| FR-C8 | User can view/repeat past bookings and save favorite providers. |
| FR-C9 | SOS button visible during an active booking, linked to emergency contacts / cooperative support line. |

### 6.2 Provider (Member) App
| ID | Requirement |
|---|---|
| FR-P1 | Provider registers with ID proof, address proof, skill certificate (if any), and bank/UPI details; status = "Pending Verification" until cooperative admin approves. |
| FR-P2 | Provider sets service categories, service area (radius/pincode), and availability calendar. |
| FR-P3 | Provider receives booking requests and can accept/decline within an SLA window. |
| FR-P4 | Provider sees a real-time earnings ledger: gross booking value, cooperative fee deducted, net payout, and payout history. |
| FR-P5 | Provider can request instant/scheduled payout to bank/UPI. |
| FR-P6 | Provider can view ratings, feedback, and access dispute resolution if a customer complaint is raised against them. |
| FR-P7 | Provider can access skilling/upskilling resources and cooperative membership benefits (insurance enrolment status, welfare scheme links). |
| FR-P8 | Provider can view and, per cooperative bylaws, participate in governance items (e.g., vote on fee-slab proposals) — lightweight "Member Voice" module. |

### 6.3 Cooperative Admin Portal
| ID | Requirement |
|---|---|
| FR-A1 | Admin can review and approve/reject provider KYC and background-verification documents. |
| FR-A2 | Admin can manage service catalog, category-wise base pricing, and cooperative fee percentage. |
| FR-A3 | Admin can view a real-time dashboard: active bookings, GMV, provider payouts, complaint counts, member growth. |
| FR-A4 | Admin can manage a grievance/dispute queue with SLA timers and resolution status. |
| FR-A5 | Admin can broadcast notices to all members (e.g., new welfare scheme, training camp). |
| FR-A6 | Admin can export state/district-wise reports for the Ministry/NCDC oversight layer. |

### 6.4 Platform/Backend
| ID | Requirement |
|---|---|
| FR-B1 | Matching engine assigns nearest available, verified, category-matching provider (rule-based v1: distance + rating + availability). |
| FR-B2 | Fee-split engine computes cooperative fee vs. provider payout per transaction, fully auditable. |
| FR-B3 | Notification service sends SMS/push at each booking-state transition. |
| FR-B4 | Audit log captures all KYC approvals, payouts, and dispute resolutions for compliance/transparency. |
| FR-B5 | Role-based access control: Customer / Provider / Cooperative Admin / Ministry Oversight. |

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Booking search-to-confirmation under 5 seconds; support at least 1,000 concurrent bookings for demo/scale testing. |
| **Scalability** | Multi-tenant architecture so any state/district cooperative society can onboard as a separate tenant on shared infrastructure. |
| **Security** | End-to-end encryption for personal data; OTP-based auth; role-based access; compliance with the Digital Personal Data Protection (DPDP) Act, 2023. |
| **Availability** | 99.5%+ uptime target for production; graceful offline/low-network handling for rural/semi-urban providers (as seen in other SIH PS requiring offline-sync). |
| **Accessibility** | Multilingual UI (minimum Hindi + English + 1 regional language), large-tap-target design for low-literacy users, voice-assisted option as stretch goal. |
| **Compliance** | Alignment with Multi-State Cooperative Societies Act, 2002 (for governance structure), Consumer Protection Act (for grievance redressal), and applicable labour codes on gig/platform workers. |
| **Auditability** | All financial transactions and fee splits must be logged and reportable for cooperative-society statutory audits. |

---

## 8. Proposed System Architecture (High-Level)

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  Customer PWA/    │     │  Provider PWA/    │     │  Cooperative Admin    │
│  Mobile Web App   │     │  Mobile Web App   │     │  Web Dashboard        │
└─────────┬────────┘     └─────────┬────────┘     └──────────┬───────────┘
          │                        │                          │
          └───────────────┬────────┴──────────────┬───────────┘
                           │      REST/GraphQL API   │
                  ┌────────▼─────────────────────────▼────────┐
                  │           API Gateway / Auth (JWT/OTP)      │
                  └────────┬─────────────────────────┬────────┘
        ┌──────────────────┼───────────────┬─────────┼──────────────────┐
┌───────▼──────┐  ┌────────▼───────┐ ┌─────▼───────┐ ┌────▼─────────┐ ┌──▼───────────┐
│ Booking &     │  │ Matching       │ │ Payments &   │ │ KYC/Verific- │ │ Notification  │
│ Scheduling    │  │ Engine         │ │ Fee-Split    │ │ ation Service│ │ Service       │
│ Service       │  │ (rule-based)   │ │ Ledger       │ │              │ │ (SMS/Push)    │
└───────┬──────┘  └────────┬───────┘ └─────┬───────┘ └────┬─────────┘ └──┬───────────┘
        └──────────────────┴───────────────┴───────────────┴──────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │  PostgreSQL / Postgis    │  (geospatial queries for matching)
                        │  + Redis (cache/queue)   │
                        └───────────┬────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │  Cloud Storage (docs,    │
                        │  KYC files, images)      │
                        └─────────────────────────┘
```

**Suggested Tech Stack (hackathon-friendly, production-viable):**
- **Frontend:** React / Next.js (customer + admin web), responsive PWA for provider app (installable, offline-tolerant).
- **Backend:** Node.js (NestJS/Express) or Python (FastAPI/Django) exposing REST/GraphQL APIs.
- **Database:** PostgreSQL with PostGIS extension for location-based provider matching; Redis for session/queue/cache.
- **Auth:** Firebase Auth or custom OTP service (MSG91/Twilio) + JWT.
- **Payments:** Razorpay/UPI PSP sandbox integration for wallet & payouts.
- **Notifications:** Firebase Cloud Messaging (push) + SMS gateway.
- **Hosting:** Any cloud (AWS/GCP/Azure) with containerized services (Docker) for portability across state-level deployments.
- **Maps/Geolocation:** OpenStreetMap/Google Maps API for provider discovery and live tracking.

---

## 9. Data Model (Key Entities)

- **User** (customer) — id, name, phone, address(es), saved providers, booking history.
- **Provider/Member** — id, cooperative_id, KYC docs, skill categories, service radius, rating, verification_status, bank/UPI details.
- **Cooperative Society (Tenant)** — id, name, region, registration details (Multi-State Cooperative Societies Act ref), fee-slab config.
- **Booking** — id, customer_id, provider_id, category, scheduled_time, status, price, cooperative_fee, provider_payout.
- **Payment/Ledger Entry** — booking_id, gross_amount, fee_amount, net_payout, payout_status, timestamp.
- **Review/Rating** — booking_id, rating, comment, flagged_for_dispute (bool).
- **Grievance/Dispute** — id, booking_id, raised_by, category, status, resolution_notes, SLA_deadline.
- **Skill/Training Record** — provider_id, course, certification_date, issuing_body.

---

## 10. Cooperative Economics Model (Differentiator vs. Existing Platforms)

| Element | Typical Gig Platform (e.g., Urban Company) | Proposed Cooperative Model |
|---|---|---|
| Commission | 20–30% to platform | 5–10% cooperative service fee (covers tech, ops, insurance pool) |
| Ownership | Investor/shareholder owned | Worker-members are joint owners |
| Governance | Corporate board, no worker vote | Elected member board; "Member Voice" module for policy input |
| Pricing | Platform sets/surge-prices | Cooperative sets transparent, no-surge pricing (as in Sahakar Taxi) |
| Worker benefits | Ad hoc, platform-discretionary | Structured path to insurance/welfare scheme enrolment, skilling |
| Surplus | Distributed to shareholders | Reinvested in the cooperative / distributed as member dividend |

This mirrors the "Sarathi Hi Malik" (driver-is-owner) philosophy of Bharat Taxi, adapted to "Sevak Hi Malik" (service-provider-is-owner) for household services.

---

## 11. Success Metrics / KPIs

| Metric | Target (Pilot Phase, e.g., 1 city/district) |
|---|---|
| Verified provider-members onboarded | 500+ in 60 days |
| Bookings completed | 2,000+ in 60 days |
| Provider earnings retention | ≥ 90% of gross booking value paid to provider |
| Customer satisfaction (avg. rating) | ≥ 4.3/5 |
| Grievance resolution SLA compliance | ≥ 90% within 48 hours |
| Repeat booking rate | ≥ 35% |
| Gender diversity among providers | Track % women members (SHG linkage) |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Cold-start problem (no providers → no customers, and vice versa) | Partner with existing cooperatives/SHGs/ITI alumni networks for initial supply-side onboarding, mirroring Sahakar Taxi's use of existing apex cooperatives (IFFCO, NDDB, etc. equivalents at local level). |
| Trust/safety concerns for in-home services | Mandatory ID + address verification, optional police verification badge, live tracking, SOS button, insurance-linked bookings. |
| Provider digital literacy gap | Voice/regional-language UI, simplified provider app, assisted onboarding camps via cooperative admin. |
| Payment/payout fraud | Escrow-style hold until service completion; audit logs; reconciliation dashboard for admin. |
| Regulatory/governance complexity of multi-state cooperatives | Design tenant model early so each state cooperative operates under its own registration while sharing the tech backbone (as recommended in the Land Stack / PACS computerization precedents). |

---

## 13. Hackathon Delivery Plan (36-Hour Build Roadmap)

| Phase | Hours | Deliverable |
|---|---|---|
| 1. Setup & Design | 0–4 | Repo scaffolding, DB schema, wireframes for 3 apps |
| 2. Core Booking Flow | 4–14 | Customer booking + provider accept/reject working end-to-end |
| 3. Admin & Verification | 14–20 | Cooperative admin KYC approval + service catalog management |
| 4. Payments & Fee-Split Engine | 20–26 | Mock payment integration, transparent fee-split ledger UI |
| 5. Trust & Safety + Notifications | 26–30 | SOS button, ratings, SMS/push notifications |
| 6. Polish, Multilingual, Dashboard | 30–34 | Hindi/regional language toggle, analytics dashboard, demo data |
| 7. Demo Prep | 34–36 | Pitch deck, live demo script, judging-criteria alignment |

---

## 14. Alignment with SIH Judging Criteria

- **Innovation:** First-of-kind cooperative marketplace for household services, directly extending the Ministry of Cooperation's proven Sahakar Taxi model into a new sector.
- **Technical feasibility:** Standard, well-understood marketplace architecture (booking + matching + payments) reduces execution risk within the hackathon window.
- **Social impact:** Directly improves gig-worker earnings retention, formalizes an unorganized workforce, and extends social security access — aligned with national cooperative and labour-welfare policy goals.
- **Scalability:** Multi-tenant design allows replication across states/cooperative societies, similar to the PACS computerization and Land Stack rollout patterns already used by other government digital-platform initiatives.
- **Presentation-readiness:** Working prototype with live booking flow, transparent fee-split visualization, and a multilingual UI gives judges a tangible, demoable experience.

---

## 15. Open Questions for the Team to Resolve Before Build

1. Which specific cooperative society/state will be used as the pilot context in the demo narrative (mirrors Sahakar Taxi's Delhi/Gujarat pilot)?
2. What exact fee-slab percentage will be proposed as the cooperative service fee, and how is it justified (tech + ops + insurance pool costing)?
3. Should background/police verification be mocked for the demo or partially integrated with a real API (e.g., DigiLocker for ID verification)?
4. What minimum viable "Member Voice" governance feature will be shown (e.g., a simple poll/vote UI) to demonstrate the cooperative-governance differentiator?

---

*This PRD is a working draft intended to guide the hackathon team's design and build. Update Sections 6–9 as implementation decisions are finalized, and validate the pilot-city, fee-slab, and verification-flow assumptions with your mentor before the final pitch.*

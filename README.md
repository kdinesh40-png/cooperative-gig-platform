# Sahkar — Cooperative Gig Services Platform
### Smart India Hackathon 2026 | Problem Statement ID: SIH26089
**Theme:** Smart Automation | **Ministry:** Ministry of Cooperation (*"Sahkar Se Samriddhi"*)  
**Core Model:** *"Sevak Hi Malik"* (Service Provider as Owner) — A Democratic Platform Cooperative Alternative to Aggregator Exploitation.

---

## 🌟 Executive Summary

Aggregator platforms (e.g., Urban Company) extract **20%–30% in corporate commissions**, impose opaque surge pricing, and offer workers zero say in governance. 

**Sahkar** extends the Ministry of Cooperation's proven **Sahakar Taxi (Bharat Taxi)** model into household and community services (electricians, plumbers, deep cleaning by Women SHGs, carpenters, appliance technicians). Under the **Multi-State Cooperative Societies Act, 2002**, worker-members retain **93%–95% of gross earnings**, enjoy democratic **1-Member-1-Vote** governance, and work under transparent, no-surge fixed rates.

---

## 🚀 Key Differentiators & Features

| Capability | Corporate Aggregator (e.g., Urban Company) | Sahkar Platform Cooperative (SIH26089) |
|---|---|---|
| **Worker Earnings Retention** | Only 70%–80% (high commission extracted) | **93%–95% directly retained by technicians** |
| **Platform Commission** | 20%–30% for shareholder profit | **5% Cooperative Tech & Maintenance Fee only** |
| **Worker Welfare & Health** | Minimal / Discretionary | **2% Dedicated Welfare & Accident Insurance Pool** |
| **Democratic Voice** | Zero worker representation | **"Member Voice": 1-Member-1-Vote on bylaws & fee slabs** |
| **Pricing Policy** | Opaque surge pricing (2x–3x during peaks) | **Standardized transparent rates (Zero Surge Guarantee)** |
| **Social Security Linkage** | Informal gig classification | **Direct e-Shram UAN & PM-SYM Pension Integration** |
| **Safety & Redressal** | Platform-biased dispute handling | **One-Touch SOS Emergency Hub + 48h Statutory SLA Queue** |

---

## 🏗️ System Architecture & Tech Stack

- **Frontend & App Framework:** Next.js 15 (App Router, Turbopack, React 19, TypeScript Strict)
- **Styling & Aesthetics:** Tailwind CSS v4 with custom design tokens adhering to high-craft editorial design (Warm Sand `#F8F6F0`, Charcoal `#18181B`, Cooperative Emerald `#0D5C3A`, Saffron Gold `#D97706`)
- **Database & Geospatial:** PostgreSQL 15+ with PostGIS spatial indexing (`ST_DWithin`, `ST_Distance`)
- **Interactive Geolocation:** Leaflet + OpenStreetMap (No credit card or API billing friction)
- **Cooperative Economics Math Engine:** Fully audited financial ledger down to the exact paisa
- **Multilingual Localization:** English, Hindi (हिंदी), and Marathi (मराठी)
- **Trust & Safety:** Instant SOS emergency broadcast and police verification badging

---

## 📂 Project Structure

```
cooperative-gig-platform/
├── docs/                                      # Project specifications & research
│   ├── PRD_Cooperative_Gig_Services_Platform_SIH26089.md
│   ├── Tech_Stack_Recommendation.docx
│   └── Design_Doc_Premium_Travel_Booking_App.md
├── database/                                  # Multi-tenant DB schemas & seeds
│   ├── schema.sql                             # Full PostgreSQL + PostGIS DDL
│   └── seed_demo_data.sql                     # Realistic Indian demo dataset
├── scripts/
│   └── verify-economics.js                    # Automated ledger integrity test suite
├── src/
│   ├── app/
│   │   ├── layout.tsx                         # Root layout with Demo Role Switcher & Bottom Nav
│   │   ├── page.tsx                           # Dynamic multi-role orchestrator
│   │   └── globals.css                        # Design token definitions & custom UI classes
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DemoRoleSwitcher.tsx           # Persistent top bar (Customer / Worker / Admin / Ministry)
│   │   │   └── FloatingBottomNav.tsx          # Floating bottom nav with elevated CTA
│   │   ├── customer/                          # Discovery, catalog, live Leaflet tracker, receipt
│   │   ├── provider/                          # Online radar, 93% net ledger, Start OTP, Member Voice
│   │   ├── admin/                             # KYC document queue, fee slab slider, 48h SLA grievances
│   │   ├── ministry/                          # Multi-state federation & policy comparison
│   │   ├── maps/                              # Client-side Leaflet OpenStreetMap wrapper
│   │   └── common/                            # One-touch Trust & Safety Emergency SOS modal
│   ├── lib/
│   │   ├── demo-store.ts                      # Reactive in-memory state store with cross-role sync
│   │   ├── fee-calculator.ts                  # Cooperative fee split math engine
│   │   └── i18n.ts                            # Multilingual dictionary (EN / HI / MR)
│   └── types/
│       └── cooperative.ts                     # Strict TypeScript interfaces
├── package.json
└── tsconfig.json
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Financial Ledger Integrity
Run the automated test suite verifying that all service fee splits reconcile down to the exact paisa and preserve $\ge 90\%$ worker retention:
```bash
node scripts/verify-economics.js
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎯 How to Demo to SIH 2026 Judges

Use the **Demo Role Switcher** at the top of the screen to guide evaluators through the 4 personas:

1. **Customer View (Priya Sharma):**
   - Browse standardized fixed rates (e.g. Ceiling Fan Installation ₹199).
   - Click **"Book Service"** to show the transparent fee split (Worker receives 93%, Platform 5%, Welfare 2%).
   - Inspect the active booking tracker with live **Leaflet GPS tracking** and Security Start OTP (`4892`).
   - Trigger the **"Emergency SOS"** button to showcase the trust & safety protocol.

2. **Worker-Member View (Ramesh Kumar - ITI Electrician):**
   - Toggle **"Online & Available"** availability switch.
   - Inspect the **Member Earnings Ledger** displaying ₹48,732 net retained (+₹12,400 more than aggregator platforms).
   - Enter Start OTP `4892` to verify and complete the job.
   - Vote on **Proposal #14** in the **"Member Voice"** ballot to demonstrate democratic cooperative governance.

3. **Cooperative Society Admin View:**
   - Review pending applicant **Ashok Mehra (Plumber)** in the KYC Queue. Inspect his Aadhaar and Apprenticeship certificate, then click **"Approve & Grant Police Verification Badge"**.
   - Use the **Fee Slab Slider** to dynamically adjust platform fee between 3% and 10% and observe real-time retention recalculation.
   - Resolve the active ticket in the **48-Hour Statutory SLA Grievance Queue**.

4. **Ministry & NCDC Oversight View:**
   - Inspect the **State-Wise Cooperative Federation Table** (Delhi, Maharashtra, Karnataka).
   - Review policy metrics highlighting **44.6% Women SHG Inclusion** and 98.2% e-Shram social security coverage.

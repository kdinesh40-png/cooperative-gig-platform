import { demoStore } from './demo-store';
import { formatINR } from './fee-calculator';

export function exportStatutoryAuditReport(): void {
  const state = demoStore.getState();
  const completedBookings = state.bookings.filter(b => b.status === 'completed');

  const totalGmv = completedBookings.reduce((sum, b) => sum + b.grossAmount, 0);
  const totalCoopFees = completedBookings.reduce((sum, b) => sum + b.cooperativeFeeAmount, 0);
  const totalWelfareFees = completedBookings.reduce((sum, b) => sum + b.welfareFundAmount, 0);
  const totalNetPayouts = completedBookings.reduce((sum, b) => sum + b.providerPayoutAmount, 0);

  const retentionPct = ((100 - state.cooperativeFeePercent - state.welfareFundPercent)).toFixed(1);

  const csvRows: string[] = [];

  const addRow = (cells: (string | number)[]) => {
    csvRows.push(cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
  };

  // Section 1: Header
  addRow(['SAHKAR PLATFORM COOPERATIVE - STATUTORY REGULATORY AUDIT REPORT']);
  addRow(['Generated Date', new Date().toLocaleString('en-IN')]);
  addRow(['Regulatory Alignment', 'Ministry of Cooperation / Multi-State Cooperative Societies Act 2002']);
  addRow(['Cooperative Society', 'Sahkar Urban Services Multi-State Co-op Society Ltd.']);
  addRow(['Registration No.', 'MSCS/CR/2026/8941']);
  addRow([]);

  // Section 2: Audit Metrics
  addRow(['SECTION 1: AUDITED FINANCIAL LEDGER METRICS']);
  addRow(['Metric', 'Audited Value', 'Regulatory Benchmark']);
  addRow(['Cooperative Platform Fee Slab', `${state.cooperativeFeePercent.toFixed(1)}%`, 'Capped at 10.0% max']);
  addRow(['Member Welfare & Health Pool', `${state.welfareFundPercent.toFixed(1)}%`, 'Mandatory Accidental Cover']);
  addRow(['Technician Net Payout Retention', `${retentionPct}%`, 'Aggregator benchmark ~72%']);
  addRow(['Completed Bookings Count', completedBookings.length, 'Audited on-chain/Firestore']);
  addRow(['Gross Job Volume (GMV)', formatINR(totalGmv), 'Escrow Audited']);
  addRow(['Cooperative Upkeep Collected', formatINR(totalCoopFees), 'Tech & Ops Only']);
  addRow(['Welfare Pool Reserve Accumulated', formatINR(totalWelfareFees), 'Accident & Health']);
  addRow(['Net Direct Worker Payouts Disbursed', formatINR(totalNetPayouts), 'NPCI/UPI Instant Payouts']);
  addRow([]);

  // Section 3: Member Onboarding & KYC Log
  addRow(['SECTION 2: MEMBER ONBOARDING & POLICE VERIFICATION TRAIL']);
  addRow(['Member ID', 'Full Name', 'Trade / Skill', 'Verification Status', 'Police Verified', 'e-Shram UAN']);
  state.providers.forEach(p => {
    addRow([
      p.memberIdNumber,
      p.fullName,
      p.trade,
      p.verificationStatus.toUpperCase(),
      p.policeVerificationBadge ? 'YES (Police Verified)' : 'NO (Standard)',
      p.eshramUan || 'N/A'
    ]);
  });
  addRow([]);

  // Section 4: Statutory Grievances Log
  addRow(['SECTION 3: STATUTORY CONSUMER & WORKER GRIEVANCE SLA TRAIL']);
  addRow(['Ticket Ref', 'Customer', 'Provider', 'Category', 'Status', 'SLA Resolution Notes']);
  state.grievances.forEach(g => {
    addRow([
      g.ticketReference,
      g.customerName,
      g.providerName,
      g.category.toUpperCase(),
      g.status.toUpperCase(),
      g.resolutionNotes || 'Under 48h Statutory SLA Investigation'
    ]);
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Sahkar_Statutory_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

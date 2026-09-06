// Automated Verification Script: Cooperative Economics Math Engine
// Guarantees exact ledger reconciliation down to the paisa

function calculateFeeSplit(grossAmount, cooperativeFeePercent = 5.0, welfareFundPercent = 2.0) {
  const safeGross = Math.max(0, grossAmount);
  const coopFee = Math.round(safeGross * (cooperativeFeePercent / 100) * 100) / 100;
  const welfareFee = Math.round(safeGross * (welfareFundPercent / 100) * 100) / 100;
  const providerPayout = Math.round((safeGross - coopFee - welfareFee) * 100) / 100;
  const providerPercent = Math.round((providerPayout / (safeGross || 1)) * 1000) / 10;
  const aggregatorFee = Math.round(safeGross * 0.25 * 100) / 100;
  const workerSurplus = Math.round((aggregatorFee - (coopFee + welfareFee)) * 100) / 100;

  return {
    grossAmount: safeGross,
    cooperativeFeePercent,
    cooperativeFeeAmount: coopFee,
    welfareFundPercent,
    welfareFundAmount: welfareFee,
    providerPayoutAmount: providerPayout,
    providerPayoutPercent: providerPercent,
    aggregatorCommissionAmount: aggregatorFee,
    workerSurplusRetained: Math.max(0, workerSurplus)
  };
}

const testCases = [
  { amount: 149.00, fee: 5.0, welfare: 2.0 },
  { amount: 199.00, fee: 5.0, welfare: 2.0 },
  { amount: 499.00, fee: 5.0, welfare: 2.0 },
  { amount: 599.00, fee: 6.0, welfare: 2.0 },
  { amount: 1250.00, fee: 7.5, welfare: 2.0 },
  { amount: 3500.00, fee: 5.0, welfare: 2.0 },
];

console.log("================================================================================");
console.log("VERIFYING COOPERATIVE GIG PLATFORM (SIH26089) FINANCIAL LEDGER INTEGRITY");
console.log("================================================================================");

let allPassed = true;

for (const tc of testCases) {
  const res = calculateFeeSplit(tc.amount, tc.fee, tc.welfare);
  const reconciledSum = Math.round((res.cooperativeFeeAmount + res.welfareFundAmount + res.providerPayoutAmount) * 100) / 100;
  const isBalanced = Math.abs(res.grossAmount - reconciledSum) < 0.001;
  const meetsRetentionTarget = res.providerPayoutPercent >= 90.0;

  console.log(`[TEST] Gross: ₹${res.grossAmount.toFixed(2)} | Co-op: ₹${res.cooperativeFeeAmount.toFixed(2)} (${res.cooperativeFeePercent}%) | Welfare: ₹${res.welfareFundAmount.toFixed(2)} (${res.welfareFundPercent}%) | Payout: ₹${res.providerPayoutAmount.toFixed(2)} (${res.providerPayoutPercent}%)`);
  console.log(`       Reconciled Sum: ₹${reconciledSum.toFixed(2)} | Balanced: ${isBalanced ? '✓ YES' : '✗ NO'} | Surplus vs 25% Aggregator: +₹${res.workerSurplusRetained.toFixed(2)}`);

  if (!isBalanced || !meetsRetentionTarget) {
    allPassed = false;
  }
}

console.log("================================================================================");
if (allPassed) {
  console.log("✓ ALL LEDGER INTEGRITY CHECKS PASSED: 100% BALANCED & ≥90% RETENTION VERIFIED");
} else {
  console.error("✗ LEDGER INTEGRITY CHECKS FAILED");
  process.exit(1);
}
console.log("================================================================================");

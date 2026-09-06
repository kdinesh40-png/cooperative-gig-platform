// Cooperative Economics Fee-Split Calculation Engine
// Compliant with Multi-State Cooperative Societies Act & "Sevak Hi Malik" Model

export interface FeeSplitBreakdown {
  grossAmount: number;
  cooperativeFeePercent: number;
  cooperativeFeeAmount: number;
  welfareFundPercent: number;
  welfareFundAmount: number;
  providerPayoutAmount: number;
  providerPayoutPercent: number;
  // Comparative savings against typical 25% aggregator commission
  aggregatorCommissionAmount: number;
  workerSurplusRetained: number; // Extra money Ramesh/Sunita keeps vs aggregator
}

/**
 * Computes transparent cooperative fee split down to 2 decimal places.
 * Guarantees: grossAmount === cooperativeFeeAmount + welfareFundAmount + providerPayoutAmount
 */
export function calculateFeeSplit(
  grossAmount: number,
  cooperativeFeePercent: number = 5.0,
  welfareFundPercent: number = 2.0
): FeeSplitBreakdown {
  const safeGross = Math.max(0, grossAmount);
  
  // Calculate raw amounts
  const coopFee = Math.round(safeGross * (cooperativeFeePercent / 100) * 100) / 100;
  const welfareFee = Math.round(safeGross * (welfareFundPercent / 100) * 100) / 100;
  
  // Guarantee exact ledger balance
  const providerPayout = Math.round((safeGross - coopFee - welfareFee) * 100) / 100;
  const providerPercent = Math.round((providerPayout / (safeGross || 1)) * 1000) / 10;

  // Typical aggregator comparison (25% commission extracted)
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

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

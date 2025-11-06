// returns monthly EMI
export const calcEmi = (principal, annualRate, months) => {
  const P = Number(principal) || 0;
  const r = (Number(annualRate) || 0) / 12 / 100;
  const n = Number(months) || 0;
  if (!P || !n) return 0;
  if (r === 0) return P / n;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
};

export const totalPayable = (emi, months) => (emi * months) || 0;

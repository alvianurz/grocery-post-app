// Utility functions for currency formatting
export function formatRupiah(amount: string | number): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function convertToRupiah(usdAmount: string | number): string {
  // For demo purposes, using a fixed exchange rate
  // In a real app, you would fetch the current exchange rate
  const exchangeRate = 15000; // 1 USD = 15,000 IDR
  const numericAmount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  const idrAmount = numericAmount * exchangeRate;
  return formatRupiah(idrAmount);
}
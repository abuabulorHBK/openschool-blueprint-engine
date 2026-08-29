/**
 * Multi-Currency Exchange Rates & Formatting Helpers
 * Base currency is USD ($).
 * Contains default exchange rates for 9 African currencies, with formatting helpers.
 */

export const CURRENCIES = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateToUSD: 1.0,
    decimals: 2,
    flag: '🇺🇸'
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    rateToUSD: 155.0,
    decimals: 0,
    flag: '🇰🇪'
  },
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rateToUSD: 1550.0,
    decimals: 0,
    flag: '🇳🇬'
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rateToUSD: 18.5,
    decimals: 2,
    flag: '🇿🇦'
  },
  GHS: {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    rateToUSD: 14.8,
    decimals: 2,
    flag: '🇬🇭'
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    rateToUSD: 2500.0,
    decimals: 0,
    flag: '🇹🇿'
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    rateToUSD: 48.5,
    decimals: 2,
    flag: '🇪🇬'
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    rateToUSD: 3750.0,
    decimals: 0,
    flag: '🇺🇬'
  },
  MZN: {
    code: 'MZN',
    name: 'Mozambican Metical',
    symbol: 'MT',
    rateToUSD: 63.5,
    decimals: 2,
    flag: '🇲🇿'
  },
  LSL: {
    code: 'LSL',
    name: 'Lesotho Loti',
    symbol: 'L',
    rateToUSD: 18.5,
    decimals: 2,
    flag: '🇱🇸'
  }
};

/**
 * Format currency value according to currency rules
 */
export function formatCurrency(amount, currencyCode = 'USD') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals
  });

  return `${curr.symbol} ${formatted}`;
}

/**
 * Convert USD amount to target currency
 */
export function convertFromUSD(usdAmount, targetCurrencyCode) {
  const curr = CURRENCIES[targetCurrencyCode] || CURRENCIES.USD;
  const num = typeof usdAmount === 'number' ? usdAmount : parseFloat(usdAmount) || 0;
  return num * curr.rateToUSD;
}

// Global currency configuration organized by geographical regions
export const currencies = {
  "Americas": [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  ],
  "European Union": [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  ],
  "Asia-Pacific": [
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  ],
  "Middle East & Africa": [
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  ],
};

// Flatten all currencies into a single array for easy lookup
export const allCurrencies = Object.values(currencies).flat();

// Asset class definitions with unique identifiers and visual representations
export const investmentTypes = [
  { id: 'equities', name: 'Equity Stocks', icon: '📈' },
  { id: 'govt_bonds', name: 'Government Bonds', icon: '🏛️' },
  { id: 'precious_metals', name: 'Gold & Precious Metals', icon: '🥇' },
  { id: 'fixed_deposits', name: 'Fixed Deposits', icon: '🏦' },
  { id: 'index_funds', name: 'Index Funds (ETF)', icon: '📊' },
  { id: 'digital_assets', name: 'Cryptocurrency', icon: '₿' },
  { id: 'real_estate', name: 'Real Estate (REITs)', icon: '🏢' },
  { id: 'raw_materials', name: 'Commodities', icon: '🛢️' },
];
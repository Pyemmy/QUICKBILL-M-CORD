export interface NigerianBank {
  name: string;
  code: string;
  isFintech?: boolean;
}

export const NIGERIAN_BANKS: NigerianBank[] = [
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Access Bank', code: '044' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Moniepoint Microfinance Bank', code: '50515', isFintech: true },
  { name: 'OPay Digital Services', code: '999992', isFintech: true },
  { name: 'PalmPay', code: '999991', isFintech: true },
  { name: 'Kuda Bank', code: '50211', isFintech: true },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First City Monument Bank (FCMB)', code: '214' },
  { name: 'Wema Bank (ALAT)', code: '035' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Jaiz Bank', code: '301' },
  { name: 'Taj Bank', code: '302' },
  { name: 'VFD Microfinance Bank', code: '566', isFintech: true },
  { name: 'FairMoney Microfinance Bank', code: '51318', isFintech: true },
  { name: 'Rubies Bank', code: '125', isFintech: true },
  { name: 'Providus Bank', code: '101' },
  { name: 'Titan Trust Bank', code: '102' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Citibank Nigeria', code: '023' },
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Renders dates as "21 Sep 2026" (not "Sept")
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  let d: Date;
  if (typeof dateInput === 'string') {
    // If format is YYYY-MM-DD
    const parts = dateInput.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${MONTHS[monthIndex]} ${year}`;
      }
    }
    d = new Date(dateInput);
  } else {
    d = dateInput;
  }

  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Money renders as ₦50,000 (no decimals unless needed), with tabular numerals
 */
export function formatMoney(amount: number | string | undefined | null): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return '₦0';
  
  const hasDecimals = num % 1 !== 0;
  const formatted = num.toLocaleString('en-NG', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `₦${formatted}`;
}

/**
 * Normalizes phone numbers to Nigerian international format (+234...)
 */
export function normalizeNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

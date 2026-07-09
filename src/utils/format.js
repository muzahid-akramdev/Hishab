// Formats a number using Bangladeshi digit grouping (lakh/crore style),
// e.g. 1234567.5 -> "৳12,34,567.50"
export function formatBDT(amount) {
  const sign = amount < 0 ? '−' : '';
  const abs = Math.abs(amount || 0);
  const fixed = abs.toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  let lastThree = intPart.slice(-3);
  const other = intPart.slice(0, -3);
  if (other !== '') {
    lastThree = ',' + lastThree;
  }
  const groupedOther = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${sign}৳${groupedOther}${lastThree}.${decPart}`;
}

export function formatDateHeader(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';

  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

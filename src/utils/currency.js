export function formatILS(amount) {
  const n = Number.isFinite(amount) ? amount : 0;
  return '₪' + n.toLocaleString('he-IL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

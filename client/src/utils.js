export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
